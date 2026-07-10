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

const faceRisk =
    faceCompleted ? localStorage.getItem("faceRisk") : "Not Completed";

const armRisk =
    armCompleted ? localStorage.getItem("armRisk") : "Not Completed";

const speechRisk =
    speechCompleted ? localStorage.getItem("speechRisk") : "Not Completed";

// Current time

document.getElementById("timeResult").textContent =
    localStorage.getItem("symptomTime") || "Not Provided";

// Show module risks

document.getElementById("faceResult").textContent =
faceRisk;

document.getElementById("armResult").textContent =
armRisk;

document.getElementById("speechResult").textContent =
speechRisk;

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
document.getElementById("faceIcon").textContent =
    faceCompleted ? "✅" : "❌";

document.getElementById("armIcon").textContent =
    armCompleted ? "✅" : "❌";

document.getElementById("speechIcon").textContent =
    speechCompleted ? "✅" : "❌";
let overall =
    completed > 0 ? Number((total / completed).toFixed(1)) : 0;



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
    }
    document.getElementById("overallScore").textContent =
    completed === 0
        ? "-- / 10"
        : overall.toFixed(1) + " / 10";
    
let risk;
let message;
let recommendation;

if (completed === 0) {

    risk = "⚪ No Assessment";
    message = "No FAST assessments have been completed yet.";
    recommendation = "Please complete at least one assessment.";

}
else if (overall >= 8) {

    risk = "🟢 Low Risk";
    message = "No significant abnormalities were detected.";
    recommendation = "Continue monitoring your health.";

}
else if (overall >= 6) {

    risk = "🟡 Moderate Risk";
    message = "Some FAST indicators require attention.";
    recommendation = "Consult a healthcare professional.";

}
else {

    risk = "🔴 High Risk";
    message = "Multiple FAST indicators suggest possible stroke symptoms.";
    recommendation = "🚑 Seek emergency medical attention immediately.";

}

document.getElementById("riskLevel").textContent =
risk;

document.getElementById("overallMessage").textContent =
message;

document.getElementById("recommendation").textContent =
recommendation;
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

    symptomTime: localStorage.getItem("symptomTime") || "Not Provided",

    createdAt: serverTimestamp()
});

console.log("✅ Assessment saved!");
    }
});
// Debug

console.log("Face:",faceScore);
console.log("Arm:",armScore);
console.log("Speech:",speechScore);
console.log("Overall:",overall);
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
    pdf.text("NeuroGuard Stroke Assessment Report", 20, 20);

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
    65
);
pdf.text(
    "Emergency Contact: " +
    (healthData.emergencyContact || "Not Set"),
    20,
    75
);

    pdf.text(
        "Symptom Started: " +
        (localStorage.getItem("symptomTime") || "Not Provided"),
        20,
        105
    );

    // ===========================
    // FAST Results
    // ===========================

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("FAST Assessment Results", 20, 125);

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

const riskLevel = document
    .getElementById("riskLevel")
    .textContent
    .replace("🔴 ", "")
    .replace("🟡 ", "")
    .replace("🟠 ", "")
    .replace("🟢 ", "")
    .replace("⚪ ", "");

pdf.text(
    "Risk Level: " + riskLevel,
    20,
    205
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
        "Generated by NeuroGuard v2",
        20,
        286
    );

    pdf.text(
        "This report is intended for screening purposes only and is not a medical diagnosis.",
        20,
        292
    );

    pdf.save("NeuroGuard_Report.pdf");

});
