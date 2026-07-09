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
