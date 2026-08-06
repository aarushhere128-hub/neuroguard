// =============================
// NeuroGuard Results
// =============================
import { calculateFinalRisk } from "./risk-engine.js";
import { auth, db } from "./firebase.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
    addDoc,
    collection,
    serverTimestamp,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { initLanguageToggle } from "./languageToggle.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

const faceCompleted =
    localStorage.getItem("faceCompleted") === "true";

const armCompleted =
    localStorage.getItem("armCompleted") === "true";

const speechCompleted =
    localStorage.getItem("speechCompleted") === "true";

const faceScore =
    faceCompleted ? Number(localStorage.getItem("faceScore")) : 0;

const armScore =
    armCompleted ? Number(localStorage.getItem("armScore")) : 0;

const speechScore =
    speechCompleted ? Number(localStorage.getItem("speechScore")) : 0;

const lang = localStorage.getItem("language") || "en";
const t = resultTranslations[lang] || resultTranslations["en"];

const faceRisk =
    faceCompleted ? localStorage.getItem("faceRisk") : t.notCompleted;

const armRisk =
    armCompleted ? localStorage.getItem("armRisk") : t.notCompleted;

const speechRisk =
    speechCompleted ? localStorage.getItem("speechRisk") : t.notCompleted;

const symptomTime =
    localStorage.getItem("symptomTime") || t.notProvided;

let emergencyName = "";
let emergencyNumber = "";
let currentGpsUrl = ""; 

// =============================
// Live GPS Display on Page Load
// =============================
const gpsDisplay = document.getElementById("gpsDisplay");
const locationText = document.getElementById("locationText");

if (navigator.geolocation && gpsDisplay && locationText) {
    gpsDisplay.style.display = "block";
    locationText.textContent = "Acquiring live location...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(4);
            const lng = position.coords.longitude.toFixed(4);
            currentGpsUrl = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
            
            locationText.innerHTML = `<a href="${currentGpsUrl}" target="_blank" style="color: #38bdf8; text-decoration: underline;">Lat: ${lat}, Lng: ${lng} (View Map)</a>`;
        },
        (error) => {
            locationText.textContent = "Location access denied or unavailable.";
            locationText.style.color = "#ef4444";
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

// Current time
const timeResultEl = document.getElementById("timeResult");
if (timeResultEl) {
    timeResultEl.textContent = localStorage.getItem("symptomTime") || t.notProvided;
}

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
        const profileRef = doc(db, "healthProfiles", user.uid);
        const snapshot = await getDoc(profileRef);

        if (snapshot.exists()) {
            const data = snapshot.data();
            emergencyName = data.emergencyName || "";
            emergencyNumber = data.emergencyNumber || "";
        }
    }
    catch (err) {
        console.error("Failed to load emergency contact:", err);
    }
});

// Show module risks
const faceResultEl = document.getElementById("faceResult");
const armResultEl = document.getElementById("armResult");
const speechResultEl = document.getElementById("speechResult");

if (faceResultEl) faceResultEl.textContent = faceRisk;
if (armResultEl) armResultEl.textContent = armRisk;
if (speechResultEl) speechResultEl.textContent = speechRisk;

// Calculate overall score
let completed = 0;
let total = 0;

if (faceCompleted) {
    total += faceScore;
    completed++;
}

if (armCompleted) {
    total += armScore;
    completed++;
}

if (speechCompleted) {
    total += speechScore;
    completed++;
}

// Update completion icons
const faceIcon = document.getElementById("faceIcon");
const armIcon = document.getElementById("armIcon");
const speechIcon = document.getElementById("speechIcon");

if (faceIcon) faceIcon.textContent = faceCompleted ? "✅" : "❌";
if (armIcon) armIcon.textContent = armCompleted ? "✅" : "❌";
if (speechIcon) speechIcon.textContent = speechCompleted ? "✅" : "❌";

let overall =
    completed > 0 ? Number((total / completed).toFixed(1)) : 0;
const baseScore = overall;

// Overall Risk
sessionStorage.removeItem("assessmentStarted");

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const healthDoc = await getDoc(doc(db, "healthProfiles", user.uid));

    const healthData = healthDoc.exists() ? healthDoc.data() : {};
        
    if (completed > 0) {
        overall = calculateFinalRisk(overall, healthData);
        const baseScoreEl = document.getElementById("baseScore");
        const personalizedScoreEl = document.getElementById("personalizedScore");
        if (baseScoreEl) baseScoreEl.textContent = baseScore.toFixed(1) + " / 10";
        if (personalizedScoreEl) personalizedScoreEl.textContent = overall.toFixed(1) + " / 10";
    }
    
    const overallScoreEl = document.getElementById("overallScore");
    if (overallScoreEl) {
        overallScoreEl.textContent = completed === 0 ? "-- / 10" : overall.toFixed(1) + " / 10";
    }
    
    let risk;
    let message;
    let recommendation;

    const possibleConditions = [];

    if (completed === 0) {
        risk = t.assessmentIncomplete;
        message = t.completeOneAssessment;
        recommendation = t.finishAssessment;
    }
    else {
        if (faceCompleted && faceScore < 7)
            possibleConditions.push("🙂 Bell's Palsy");

        if (
            (faceCompleted && faceScore < 7) ||
            (armCompleted && armScore < 7) ||
            (speechCompleted && speechScore < 7)
        )
            possibleConditions.push("🧠 Stroke");

        if (armCompleted && armScore < 7)
            possibleConditions.push("🤲 Parkinson's Disease");

        if (speechCompleted && speechScore < 7)
            possibleConditions.push("⚡ Other Neurological Disorder");

        const uniqueConditions = [...new Set(possibleConditions)];
        const container = document.getElementById("possibleConditions");

        if (container) {
            container.innerHTML = "";
            uniqueConditions.forEach(condition => {
                container.innerHTML += `
                    <span class="condition-chip">
                        ${condition}
                    </span>
                `;
            });
        }

        if (overall >= 8) {
            risk = "🟢 Low Concern";
            message = "No significant neurological abnormalities were detected during this educational screening.";
            recommendation = "Continue monitoring your health and seek medical advice if symptoms develop.";
        }
        else if (overall >= 6) {
            risk = "🟡 Neurological Signs Detected";
            message = "Some neurological signs were identified. These symptoms may overlap with several neurological conditions.";
            recommendation = "Arrange a prompt medical evaluation with a healthcare professional.";
        }
        else {
            risk = "🔴 Urgent Neurological Signs";
            message = "Multiple neurological warning signs were detected. These findings may be associated with one or more neurological conditions.";
            recommendation = "🚑 Seek emergency medical attention immediately, especially if symptoms appeared suddenly.";
        }
    }

    const titleEl = document.getElementById("resultAssessmentTitle");
    const msgEl = document.getElementById("overallMessage");
    const recEl = document.getElementById("recommendation");

    if (titleEl) titleEl.textContent = risk;
    if (msgEl) msgEl.textContent = message;
    if (recEl) recEl.textContent = recommendation;

    const notifyBtn = document.getElementById("notifyBtn");

    if (
        notifyBtn &&
        (risk.includes("Neurological Signs") || risk.includes("Urgent"))
    ) {
        notifyBtn.style.display = "inline-block";
    }

    if (notifyBtn) {
        notifyBtn.addEventListener("click", () => {
            if (!emergencyNumber) {
                alert("No emergency contact has been added.");
                return;
            }

            if (!confirm(`Notify ${emergencyName}?`)) return;

            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser.");
                return;
            }

            const originalText = notifyBtn.innerHTML;
            notifyBtn.innerHTML = "📍 Acquiring Live GPS...";
            notifyBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

                    const currentSymptomTime = localStorage.getItem("symptomTime") || t.notProvided;

                    const sms = `Hello ${emergencyName},\n\nI have completed a NeuroGuard FAST assessment.\n\nOverall Risk: ${risk}\n\nFace:\n${faceRisk} (${faceScore}/10)\n\nArm:\n${armRisk} (${armScore}/10)\n\nSpeech:\n${speechRisk} (${speechScore}/10)\n\nSymptom Onset:\n${currentSymptomTime}\n\nLive Location:\n${googleMapsUrl}\n\nThis is an AI-assisted educational assessment and is NOT a medical diagnosis.\n\nPlease contact me immediately if possible.\n\nGenerated by NeuroGuard`;

                    notifyBtn.innerHTML = originalText;
                    notifyBtn.disabled = false;

                    window.location.href = `sms:${emergencyNumber}?body=${encodeURIComponent(sms)}`;
                },
                (error) => {
                    notifyBtn.innerHTML = originalText;
                    notifyBtn.disabled = false;
                    alert("Location error occurred while retrieving coordinates.");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    }

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const pName = document.getElementById("patientName");
        const pAge = document.getElementById("patientAge");
        const pGender = document.getElementById("patientGender");

        if (pName) pName.textContent = userData.name;
        if (pAge) pAge.textContent = userData.age;
        if (pGender) pGender.textContent = userData.gender;
        
        await addDoc(collection(db, "assessments"), {
            uid: user.uid,
            name: userData.name,
            age: userData.age,
            gender: userData.gender,
            email: userData.email,
            faceScore,
            armScore,
            speechScore,
            aiScore: Number((total / completed).toFixed(1)),
            overallScore: overall,
            risk,
            recommendation,
            symptomTime: localStorage.getItem("symptomTime") || t.notProvided,
            createdAt: serverTimestamp()
        });
    }
});

// PDF Generation
const downloadReportBtn = document.getElementById("downloadReport");
if (downloadReportBtn) {
    downloadReportBtn.addEventListener("click", async () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const user = auth.currentUser;

        let healthData = {};

        if (user) {
            const healthDoc = await getDoc(doc(db, "healthProfiles", user.uid));
            if (healthDoc.exists()) {
                healthData = healthDoc.data();
            }
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(20);
        pdf.text("NeuroGuard Neurological Screening Report", 20, 20);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.text("Generated on: " + new Date().toLocaleString(), 20, 30);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text("Patient Information", 20, 45);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);

        pdf.text("Name: " + (document.getElementById("patientName")?.textContent || "-"), 20, 55);
        pdf.text("Age: " + (document.getElementById("patientAge")?.textContent || "-"), 20, 65);
        pdf.text("Gender: " + (document.getElementById("patientGender")?.textContent || "-"), 20, 75);
        pdf.text("Blood Group: " + (healthData.bloodGroup || "Not Set"), 20, 85);
        pdf.text("Emergency Contact: " + (healthData.emergencyContact || "Not Set"), 20, 95);
        pdf.text("Symptom Started: " + (localStorage.getItem("symptomTime") || t.notProvided), 20, 105);

        pdf.save("NeuroGuard_Report.pdf");
    });
}

// =========================================
// NeuroGuard | Results Page Language Dictionaries
// =========================================
const resultTranslations = {
    en: {
        pageTitle: "FAST Test Results | NeuroGuard",
        home: "Home",
        badge: "FAST Assessment Complete",
        heading: "Assessment Results",
        intro: 'This assessment is an educational screening tool and <strong>does not provide a medical diagnosis.</strong><br>If stroke symptoms are suspected, seek emergency medical care immediately.',
        patientInfo: "Patient Information",
        name: "Name:",
        age: "Age:",
        gender: "Gender:",
        assessment: "Neurological Assessment",
        conditions: "Possible Conditions",
        disclaimer: "These conditions share similar neurological symptoms. NeuroGuard cannot determine which condition is present. This educational assessment is not a medical diagnosis.",
        fastSummary: "FAST Summary",
        face: "Face Assessment",
        arm: "Arm Assessment",
        speech: "Speech Assessment",
        time: "Symptom Time",
        overallScore: "Overall NeuroGuard Score",
        fastScore: "FAST Score:",
        personalizedScore: "Personalized Score:",
        scoreExplanation: "FAST Score is calculated from the Face, Arm and Speech assessments. Personalized Score adjusts the FAST Score using your health profile.",
        recommendationHeading: "Recommended Action",
        recommendation: "If these symptoms are occurring now, call emergency medical services immediately. Early treatment significantly improves recovery.",
        download: "📄 Download PDF Report",
        emergency: "🚑 Call Emergency Services",
        notify: "📱 Notify Emergency Contact",
        why: "Why Immediate Action Matters",
        brainHeading: "Brain Cells Die Quickly",
        brainText: "Every minute of untreated stroke can damage nearly two million brain cells.",
        goldenHeading: "Golden Window",
        goldenText: "Treatment is most effective within approximately 4.5 hours of symptom onset.",
        driveHeading: "Do Not Drive Yourself",
        driveText: "Always call emergency medical services whenever stroke is suspected.",
        retake: "Retake Assessment",
        returnHome: "Return Home",
        notCompleted: "Not Completed",
        notProvided: "Not Provided",
        assessmentIncomplete: "⚪ Assessment Incomplete",
        completeOneAssessment: "Complete at least one neurological assessment.",
        finishAssessment: "Finish the assessment to receive an educational screening."
    },
    hi: {
        pageTitle: "FAST परीक्षण परिणाम | NeuroGuard",
        home: "होम",
        badge: "FAST परीक्षण पूर्ण",
        heading: "परीक्षण परिणाम",
        intro: 'यह परीक्षण केवल शैक्षिक स्क्रीनिंग के लिए है और <strong>चिकित्सीय निदान प्रदान नहीं करता।</strong><br>यदि स्ट्रोक के लक्षण हों, तो तुरंत आपातकालीन चिकित्सा सहायता प्राप्त करें।',
        patientInfo: "रोगी की जानकारी",
        name: "नाम:",
        age: "आयु:",
        gender: "लिंग:",
        assessment: "तंत्रिका संबंधी मूल्यांकन",
        conditions: "संभावित स्थितियाँ",
        disclaimer: "इन सभी स्थितियों के लक्षण समान हो सकते हैं। NeuroGuard यह निर्धारित नहीं कर सकता कि वास्तव में कौन-सी स्थिति मौजूद है। यह केवल शैक्षिक मूल्यांकन है।",
        fastSummary: "FAST सारांश",
        face: "चेहरा परीक्षण",
        arm: "भुजा परीक्षण",
        speech: "बोलने का परीक्षण",
        time: "लक्षण शुरू होने का समय",
        overallScore: "कुल NeuroGuard स्कोर",
        fastScore: "FAST स्कोर:",
        personalizedScore: "व्यक्तिगत स्कोर:",
        scoreExplanation: "FAST स्कोर चेहरे, भुजा और बोलने के परीक्षणों से प्राप्त होता है। व्यक्तिगत स्कोर आपके स्वास्थ्य प्रोफ़ाइल के आधार पर समायोजित किया जाता है।",
        recommendationHeading: "सुझाई गई कार्रवाई",
        recommendation: "यदि ये लक्षण अभी मौजूद हैं, तो तुरंत आपातकालीन चिकित्सा सेवा से संपर्क करें। शीघ्र उपचार से बेहतर सुधार की संभावना बढ़ती है।",
        download: "📄 PDF रिपोर्ट डाउनलोड करें",
        emergency: "🚑 आपातकालीन सेवा को कॉल करें",
        notify: "📱 आपातकालीन संपर्क को सूचित करें",
        why: "तुरंत कार्रवाई क्यों ज़रूरी है",
        brainHeading: "मस्तिष्क की कोशिकाएँ तेजी से नष्ट होती हैं",
        brainText: "अनुपचारित स्ट्रोक के हर मिनट में लगभग बीस लाख मस्तिष्क कोशिकाएँ क्षतिग्रस्त हो सकती हैं।",
        goldenHeading: "गोल्डन समय",
        goldenText: "लक्षण शुरू होने के लगभग 4.5 घंटे के भीतर उपचार सबसे प्रभावी होता है।",
        driveHeading: "खुद वाहन न चलाएँ",
        driveText: "यदि स्ट्रोक का संदेह हो, तो हमेशा आपातकालीन चिकित्सा सेवा को बुलाएँ।",
        retake: "परीक्षण दोबारा करें",
        returnHome: "होम पर लौटें",
        notCompleted: "पूरा नहीं हुआ",
        notProvided: "प्रदान नहीं किया गया",
        assessmentIncomplete: "⚪ मूल्यांकन अधूरा",
        completeOneAssessment: "कम से कम एक न्यूरोलॉजिकल परीक्षण पूरा करें।",
        finishAssessment: "शैक्षिक स्क्रीनिंग प्राप्त करने के लिए परीक्षण पूरा करें।"
    },
    pa: {
        pageTitle: "FAST ਟੈਸਟ ਨਤੀਜੇ | NeuroGuard",
        home: "ਮੁੱਖ ਪੰਨਾ",
        badge: "FAST ਟੈਸਟ ਪੂਰਾ",
        heading: "ਟੈਸਟ ਦੇ ਨਤੀਜੇ",
        intro: 'ਇਹ ਮੁਲਾਂਕਣ ਸਿਰਫ਼ ਸਿੱਖਿਆਤਮਕ ਸਕ੍ਰੀਨਿੰਗ ਲਈ ਹੈ ਅਤੇ <strong>ਕੋਈ ਡਾਕਟਰੀ ਨਿਦਾਨ ਨਹੀਂ ਕਰਦਾ।</strong><br>ਜੇ ਸਟ੍ਰੋਕ ਦੇ ਲੱਛਣ ਹਨ ਤਾਂ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਮੈਡੀਕਲ ਸਹਾਇਤਾ ਲਵੋ।',
        patientInfo: "ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ",
        name: "ਨਾਮ:",
        age: "ਉਮਰ:",
        gender: "ਲਿੰਗ:",
        assessment: "ਨਿਊਰੋਲੋਜੀਕਲ ਮੁਲਾਂਕਣ",
        conditions: "ਸੰਭਾਵਿਤ ਸਥਿਤੀਆਂ",
        disclaimer: "ਇਨ੍ਹਾਂ ਸਾਰੀਆਂ ਸਥਿਤੀਆਂ ਦੇ ਲੱਛਣ ਮਿਲਦੇ-ਜੁਲਦੇ ਹੋ ਸਕਦੇ ਹਨ। NeuroGuard ਇਹ ਨਹੀਂ ਦੱਸ ਸਕਦਾ ਕਿ ਅਸਲ ਵਿੱਚ ਕਿਹੜੀ ਸਥਿਤੀ ਮੌਜੂਦ ਹੈ। ਇਹ ਸਿਰਫ਼ ਸਿੱਖਿਆਤਮਕ ਮੁਲਾਂਕਣ ਹੈ।",
        fastSummary: "FAST ਸੰਖੇਪ",
        face: "ਚਿਹਰਾ ਟੈਸਟ",
        arm: "ਬਾਂਹ ਟੈਸਟ",
        speech: "ਬੋਲਣ ਦਾ ਟੈਸਟ",
        time: "ਲੱਛਣ ਸ਼ੁਰੂ ਹੋਣ ਦਾ ਸਮਾਂ",
        overallScore: "ਕੁੱਲ NeuroGuard ਸਕੋਰ",
        fastScore: "FAST ਸਕੋਰ:",
        personalizedScore: "ਵਿਅਕਤੀਗਤ ਸਕੋਰ:",
        scoreExplanation: "FAST ਸਕੋਰ ਚਿਹਰੇ, ਬਾਂਹ ਅਤੇ ਬੋਲਣ ਦੇ ਟੈਸਟਾਂ ਤੋਂ ਬਣਦਾ ਹੈ। ਵਿਅਕਤੀਗਤ ਸਕੋਰ ਤੁਹਾਡੇ ਸਿਹਤ ਪ੍ਰੋਫਾਈਲ ਦੇ ਅਨੁਸਾਰ ਸੋਧਿਆ ਜਾਂਦਾ ਹੈ।",
        recommendationHeading: "ਸਿਫ਼ਾਰਸ਼ੀ ਕਾਰਵਾਈ",
        recommendation: "ਜੇ ਇਹ ਲੱਛਣ ਇਸ ਵੇਲੇ ਹਨ, ਤਾਂ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਮੈਡੀਕਲ ਸੇਵਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ। ਜਲਦੀ ਇਲਾਜ ਨਾਲ ਠੀਕ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਵਧਦੀ ਹੈ।",
        download: "📄 PDF ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ",
        emergency: "🚑 ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ",
        notify: "📱 ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਨੂੰ ਸੂਚਿਤ ਕਰੋ",
        why: "ਤੁਰੰਤ ਕਾਰਵਾਈ ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ",
        brainHeading: "ਦਿਮਾਗ ਦੀਆਂ ਕੋਸ਼ਿਕਾਵਾਂ ਤੇਜ਼ੀ ਨਾਲ ਨਸ਼ਟ ਹੁੰਦੀਆਂ ਹਨ",
        brainText: "ਬਿਨਾਂ ਇਲਾਜ ਵਾਲੇ ਸਟ੍ਰੋਕ ਦੇ ਹਰ ਮਿੰਟ ਵਿੱਚ ਲਗਭਗ ਵੀਹ ਲੱਖ ਦਿਮਾਗੀ ਕੋਸ਼ਿਕਾਵਾਂ ਨੁਕਸਾਨ ਝੱਲ ਸਕਦੀਆਂ ਹਨ।",
        goldenHeading: "ਗੋਲਡਨ ਸਮਾਂ",
        goldenText: "ਲੱਛਣ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਲਗਭਗ 4.5 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਇਲਾਜ ਸਭ ਤੋਂ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਹੁੰਦਾ ਹੈ।",
        driveHeading: "ਖੁਦ ਗੱਡੀ ਨਾ ਚਲਾਓ",
        driveText: "ਜੇ ਸਟ੍ਰੋਕ ਦਾ ਸ਼ੱਕ ਹੋਵੇ ਤਾਂ ਹਮੇਸ਼ਾਂ ਐਮਰਜੈਂਸੀ ਮੈਡੀਕਲ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ।",
        retake: "ਮੁੜ ਟੈਸਟ ਕਰੋ",
        returnHome: "ਮੁੱਖ ਪੰਨੇ ਤੇ ਵਾਪਸ ਜਾਓ",
        notCompleted: "ਪੂਰਾ ਨਹੀਂ ਹੋਇਆ",
        notProvided: "ਪ੍ਰਦਾਨ ਨਹੀਂ ਕੀਤਾ ਗਿਆ",
        assessmentIncomplete: "⚪ ਮੁਲਾਂਕਣ ਅਧੂਰਾ",
        completeOneAssessment: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਨਿਊਰੋਲੋਜੀਕਲ ਟੈਸਟ ਪੂਰਾ ਕਰੋ।",
        finishAssessment: "ਸਿੱਖਿਆਤਮਕ ਸਕ੍ਰੀਨਿੰਗ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਟੈਸਟ ਪੂਰਾ ਕਰੋ।"
    }
};

function updateResultsLanguage(langCode) {
    const t = resultTranslations[langCode] || resultTranslations["en"];

    document.title = t.pageTitle;

    const elHome = document.getElementById("resultHomeBtn");
    const elBadge = document.getElementById("resultBadge");
    const elHeading = document.getElementById("resultHeading");
    const elIntro = document.getElementById("resultIntro");

    if (elHome) elHome.textContent = t.home;
    if (elBadge) elBadge.textContent = t.badge;
    if (elHeading) elHeading.textContent = t.heading;
    if (elIntro) elIntro.innerHTML = t.intro;

    const elPatientInfo = document.getElementById("resultPatientInfoHeading");
    const elName = document.getElementById("resultNameLabel");
    const elAge = document.getElementById("resultAgeLabel");
    const elGender = document.getElementById("resultGenderLabel");

    if (elPatientInfo) elPatientInfo.textContent = t.patientInfo;
    if (elName) elName.textContent = t.name;
    if (elAge) elAge.textContent = t.age;
    if (elGender) elGender.textContent = t.gender;

    const elAssessment = document.getElementById("resultAssessmentTitle");
    const elConditions = document.getElementById("resultConditionsHeading");
    const elDisclaimer = document.getElementById("resultConditionsDisclaimer");

    if (elAssessment) elAssessment.textContent = t.assessment;
    if (elConditions) elConditions.textContent = t.conditions;
    if (elDisclaimer) elDisclaimer.textContent = t.disclaimer;

    const elFastSummary = document.getElementById("resultFastSummaryHeading");
    const elFace = document.getElementById("resultFaceLabel");
    const elArm = document.getElementById("resultArmLabel");
    const elSpeech = document.getElementById("resultSpeechLabel");
    const elTime = document.getElementById("resultTimeLabel");

    if (elFastSummary) elFastSummary.textContent = t.fastSummary;
    if (elFace) elFace.textContent = t.face;
    if (elArm) elArm.textContent = t.arm;
    if (elSpeech) elSpeech.textContent = t.speech;
    if (elTime) elTime.textContent = t.time;

    const elOverallScore = document.getElementById("resultOverallScoreHeading");
    const elFastScore = document.getElementById("resultFastScoreLabel");
    const elPersonalizedScore = document.getElementById("resultPersonalizedScoreLabel");
    const elScoreExp = document.getElementById("resultScoreExplanation");

    if (elOverallScore) elOverallScore.textContent = t.overallScore;
    if (elFastScore) elFastScore.textContent = t.fastScore;
    if (elPersonalizedScore) elPersonalizedScore.textContent = t.personalizedScore;
    if (elScoreExp) elScoreExp.textContent = t.scoreExplanation;

    const elRecHeading = document.getElementById("resultRecommendationHeading");
    const elRec = document.getElementById("recommendation");

    if (elRecHeading) elRecHeading.textContent = t.recommendationHeading;
    if (elRec) elRec.textContent = t.recommendation;

    const btnDownload = document.getElementById("downloadReport");
    const btnEmergency = document.getElementById("emergencyButton");
    const btnNotify = document.getElementById("notifyBtn");

    if (btnDownload) btnDownload.textContent = t.download;
    if (btnEmergency) btnEmergency.textContent = t.emergency;
    if (btnNotify) btnNotify.textContent = t.notify;

    const elWhy = document.getElementById("resultWhyHeading");
    const elBrainH = document.getElementById("resultBrainHeading");
    const elBrainT = document.getElementById("resultBrainText");
    const elGoldenH = document.getElementById("resultGoldenHeading");
    const elGoldenT = document.getElementById("resultGoldenText");
    const elDriveH = document.getElementById("resultDriveHeading");
    const elDriveT = document.getElementById("resultDriveText");

    if (elWhy) elWhy.textContent = t.why;
    if (elBrainH) elBrainH.textContent = t.brainHeading;
    if (elBrainT) elBrainT.textContent = t.brainText;
    if (elGoldenH) elGoldenH.textContent = t.goldenHeading;
    if (elGoldenT) elGoldenT.textContent = t.goldenText;
    if (elDriveH) elDriveH.textContent = t.driveHeading;
    if (elDriveT) elDriveT.textContent = t.driveText;

    const btnRetake = document.getElementById("resultRetakeBtn");
    const btnReturnHome = document.getElementById("resultReturnHomeBtn");

    if (btnRetake) btnRetake.textContent = t.retake;
    if (btnReturnHome) btnReturnHome.textContent = t.returnHome;
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Get user's saved language preference or default to English
    const savedLanguage = localStorage.getItem("language") || "en";

    // 2. Apply translations to the results page content
    updateResultsLanguage(savedLanguage);

    // 3. Render the interactive language pills into the container
    initLanguageToggle("languageMenuContainer", (newLang) => {
        updateResultsLanguage(newLang);
    });

    // Listen for custom language change events dispatched elsewhere
    window.addEventListener("languageChanged", (e) => {
        const langCode = e.detail || localStorage.getItem("language") || "en";
        updateResultsLanguage(langCode);
    });

    // Fallback watcher for storage changes across tabs
    window.addEventListener("storage", (e) => {
        if (e.key === "language") {
            updateResultsLanguage(e.newValue || "en");
        }
    });
});
