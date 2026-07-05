// =============================
// NeuroGuard Results
// =============================

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
const overall =
    completed > 0 ? (total / completed).toFixed(1) : "--";

document.getElementById("overallScore").textContent =
    overall === "--" ? "-- / 10" : overall + " / 10";

// Overall Risk

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
sessionStorage.removeItem("assessmentStarted");
// Debug

console.log("Face:",faceScore);
console.log("Arm:",armScore);
console.log("Speech:",speechScore);
console.log("Overall:",overall);
