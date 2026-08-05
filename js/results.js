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
const t = resultTranslations[lang];
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
let currentGpsUrl = ""; // Stores live maps URL for fallback/database sync if needed

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
document.getElementById("timeResult").textContent =
    localStorage.getItem("symptomTime") || t.notProvided;

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
        const profileRef = doc(db, "healthProfiles", user.uid);
        const snapshot = await getDoc(profileRef);

        if (snapshot.exists()) {
            const data = snapshot.data();
            emergencyName = data.emergencyName || "";
            emergencyNumber = data.emergencyNumber || "";

            console.log("Emergency Contact:", emergencyName);
            console.log("Emergency Number:", emergencyNumber);
        }
    }
    catch (err) {
        console.error("Failed to load emergency contact:", err);
    }
});

// Show module risks
document.getElementById("faceResult").textContent = faceRisk;
document.getElementById("armResult").textContent = armRisk;
document.getElementById("speechResult").textContent = speechRisk;

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
document.getElementById("faceIcon").textContent = faceCompleted ? "✅" : "❌";
document.getElementById("armIcon").textContent = armCompleted ? "✅" : "❌";
document.getElementById("speechIcon").textContent = speechCompleted ? "✅" : "❌";

let overall =
    completed > 0 ? Number((total / completed).toFixed(1)) : 0;
const baseScore = overall;

// Overall Risk
sessionStorage.removeItem("assessmentStarted");
const user = auth.currentUser;
console.log("Current User:", user);

onAuthStateChanged(auth, async (user) => {
    console.log("Current User:", user);

    if (!user) {
        console.log("No user is logged in.");
        return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const healthDoc = await getDoc(
        doc(db, "healthProfiles", user.uid)
    );

    const healthData = healthDoc.exists()
        ? healthDoc.data()
        : {};
        
    if (completed > 0) {
        overall = calculateFinalRisk(overall, healthData);
        document.getElementById("baseScore").textContent = baseScore.toFixed(1) + " / 10";
        document.getElementById("personalizedScore").textContent = overall.toFixed(1) + " / 10";
    }
    
    document.getElementById("overallScore").textContent =
        completed === 0
            ? "-- / 10"
            : overall.toFixed(1) + " / 10";
    
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
        // ---------- Possible Conditions ----------
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

        // remove duplicates
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

        // ---------- Overall Severity ----------
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

    document.getElementById("resultAssessmentTitle").textContent = risk;
    document.getElementById("overallMessage").textContent = message;
    document.getElementById("recommendation").textContent = recommendation;

    const notifyBtn = document.getElementById("notifyBtn");

    if (
        risk.includes("Neurological Signs") ||
        risk.includes("Urgent")
    ) {
        notifyBtn.style.display = "inline-block";
    }

    // Updated Notify Button Handler with Live GPS Location
    notifyBtn.addEventListener("click", () => {
        if (!emergencyNumber) {
            alert("No emergency contact has been added.");
            return;
        }

        if (!confirm(`Notify ${emergencyName}?`))
            return;

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        const originalText = notifyBtn.innerHTML;
        notifyBtn.innerHTML = "📍 Acquiring Live GPS...";
        notifyBtn.disabled = true;

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

                const symptomTime =
                    localStorage.getItem("symptomTime") || t.notProvided;

                const sms =
`Hello ${emergencyName},

I have completed a NeuroGuard FAST assessment.

Overall Risk: ${risk}

Face:
${faceRisk} (${faceScore}/10)

Arm:
${armRisk} (${armScore}/10)

Speech:
${speechRisk} (${speechScore}/10)

Symptom Onset:
${symptomTime}

Live Location:
${googleMapsUrl}

This is an AI-assisted educational assessment and is NOT a medical diagnosis.

Please contact me immediately if possible.

Generated by NeuroGuard`;

                notifyBtn.innerHTML = originalText;
                notifyBtn.disabled = false;

                window.location.href =
                    `sms:${emergencyNumber}?body=${encodeURIComponent(sms)}`;
            },
            (error) => {
                notifyBtn.innerHTML = originalText;
                notifyBtn.disabled = false;

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Location permission was denied. Please allow location access to share your live GPS coordinates.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Location information is currently unavailable.");
                        break;
                    case error.TIMEOUT:
                        alert("The request to get your GPS location timed out.");
                        break;
                    default:
                        alert("An unknown error occurred while retrieving location.");
                        break;
                }
            },
            options
        );
    });

    if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User Data:", userData);
        document.getElementById("patientName").textContent = userData.name;
        document.getElementById("patientAge").textContent = userData.age;
        document.getElementById("patientGender").textContent = userData.gender;
        
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

        console.log("✅ Assessment saved!");
    }
});

// Debug
console.log("Face:", faceScore);
console.log("Arm:", armScore);
console.log("Speech:", speechScore);
console.log("Overall:", overall);

document.getElementById("downloadReport").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const user = auth.currentUser;

    let healthData = {};

    if (user) {
        const healthDoc = await getDoc(
            doc(db, "healthProfiles", user.uid)
        );

        if (healthDoc.exists()) {
            healthData = healthDoc.data();
        }
    }

    // ===========================
    // Title
    // ===========================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("NeuroGuard Neurological Screening Report", 20, 20);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(
        "Generated on: " + new Date().toLocaleString(),
        20,
        30
    );

    // ===========================
    // Patient Information
    // ===========================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("Patient Information", 20, 45);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    pdf.text(
        "Name: " +
        document.getElementById("patientName").textContent,
        20,
        55
    );

    pdf.text(
        "Age: " +
        document.getElementById("patientAge").textContent,
        20,
        65
    );

    pdf.text(
        "Gender: " +
        document.getElementById("patientGender").textContent,
        20,
        75
    );

    pdf.text(
        "Blood Group: " +
        (healthData.bloodGroup || "Not Set"),
        20,
        85
    );
    pdf.text(
        "Emergency Contact: " +
        (healthData.emergencyContact || "Not Set"),
        20,
        95
    );

    pdf.text(
        "Symptom Started: " +
        (localStorage.getItem("symptomTime") || t.notProvided),
        20,
        105
    );

    // ===========================
    // FAST Results
    // ===========================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("Neurological Assessment Results", 20, 125);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    pdf.text(
        "Face Score: " +
        (localStorage.getItem("faceScore") || "-"),
        20,
        135
    );

    pdf.text(
        "Face Risk: " +
        ((localStorage.getItem("faceRisk") || "")
            .replace("🔴 ", "")
            .replace("🟠 ", "")
            .replace("🟡 ", "")
            .replace("🟢 ", "") || "-"),
        110,
        135
    );

    pdf.text(
        "Arm Score: " +
        (localStorage.getItem("armScore") || "-"),
        20,
        145
    );

    pdf.text(
        "Arm Risk: " +
        ((localStorage.getItem("armRisk") || "")
            .replace("🔴 ", "")
            .replace("🟠 ", "")
            .replace("🟡 ", "")
            .replace("🟢 ", "") || "-"),
        110,
        145
    );
    pdf.text(
        "Speech Score: " +
        (localStorage.getItem("speechScore") || "-"),
        20,
        155
    );

    pdf.text(
        "Speech Risk: " +
        ((localStorage.getItem("speechRisk") || "")
            .replace("🔴 ", "")
            .replace("🟠 ", "")
            .replace("🟡 ", "")
            .replace("🟢 ", "") || "-"),
        110,
        155
    );

    // ===========================
    // Overall Assessment
    // ===========================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("Overall Assessment", 20, 175);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    pdf.text(
        "Overall Score: " +
        document.getElementById("overallScore").textContent,
        20,
        195
    );

    // ===========================
    // AI Interpretation
    // ===========================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("AI Interpretation", 20, 215);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    const message =
        document.getElementById("overallMessage").textContent;

    const recommendation =
        document.getElementById("recommendation").textContent;

    const messageLines =
        pdf.splitTextToSize(message, 170);

    pdf.text(messageLines, 20, 225);

    const y =
        225 + (messageLines.length * 7) + 5;

    pdf.setFont("helvetica", "bold");
    pdf.text("Recommendation", 20, y);

    pdf.setFont("helvetica", "normal");

    const recommendationLines =
        pdf.splitTextToSize(recommendation, 170);

    pdf.text(
        recommendationLines,
        20,
        y + 10
    );

    // ===========================
    // Footer
    // ===========================
    pdf.setDrawColor(180);
    pdf.line(20, 280, 190, 280);

    pdf.setFontSize(9);

    pdf.text(
        "Generated by NeuroGuard",
        20,
        286
    );

    pdf.text(
        "This AI-assisted neurological screening is educational only and cannot diagnose any medical condition.",
        20,
        292
    );

    pdf.save("NeuroGuard_Report.pdf");
});
