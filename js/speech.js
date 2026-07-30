// =========================================
// NeuroGuard | Speech Assessment
// =========================================
import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});
// ===== CHANGE THIS WHEN YOU HAVE A MICROPHONE =====
const demoToggle = document.getElementById("demoToggle");
const t = translations[localStorage.getItem("language") || "en"];
// Load previous preference
demoToggle.checked =
    localStorage.getItem("demoMode") === "true";

demoToggle.addEventListener("change", () => {

    localStorage.setItem(
        "demoMode",
        demoToggle.checked
    );

    location.reload();

});

const DEMO_MODE = demoToggle.checked;
const demoLabel = document.getElementById("demoLabel");

demoLabel.textContent =
    DEMO_MODE ? "Demo Mode" : "Microphone Mode";

demoToggle.addEventListener("change", () => {

    localStorage.setItem(
        "demoMode",
        demoToggle.checked
    );

    location.reload();

});
console.log("Demo mode:", DEMO_MODE);
// false = Real Speech Recognition
// true = Random Demo Results
// ==================================================

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const startBtn = document.getElementById("startBtn");
const status = document.getElementById("speechstatus");
const recognizedText = document.getElementById("recognizedText");
const speechScore = document.getElementById("speechScore");
const similarity = document.getElementById("similarity");
const speechRisk = document.getElementById("speechRisk");

// =========================================
// Random Target Sentence
// =========================================

const sentences = [

    "The sky is blue and the sun is bright today.",

    "Today is a beautiful day to go outside.",

    "Please say this sentence clearly and slowly.",

    "NeuroGuard helps detect possible stroke symptoms.",

    "Artificial intelligence can improve healthcare awareness."

];

// Pick one randomly
const targetSentence =
    sentences[Math.floor(Math.random() * sentences.length)];

// Display it on the page
document.getElementById("targetSentence").textContent = targetSentence;
document.addEventListener("DOMContentLoaded", () => {
    [
        "speechTranscript",
        "speechSimilarity",
        "speechScore",
        "speechRisk",
        "speechRiskKey",
        "speechCompleted"
    ].forEach(key => localStorage.removeItem(key));
});
// =========================================
// DEMO MODE
// =========================================

if (DEMO_MODE) {

    startBtn.addEventListener("click", () => {

    status.textContent = "🤖 Running Demo Assessment...";
    startBtn.disabled = true;

    setTimeout(() => {

        // Generate a realistic score
        const percent = (60 + Math.random() * 30).toFixed(1);

        let score;
let risk;
let riskKey;
if (percent >= 95) {
    score = 10.0;
    risk = t.speechNormal;
    riskKey = "speechNormal";
}
else if (percent >= 80) {
    score = 8.0;
    risk = t.speechMild;
    riskKey = "speechMild";
}
else {
    score = 6.0;
    risk = t.speechSevere;
    riskKey = "speechSevere";
}

        // Display results
        recognizedText.textContent = targetSentence;
        similarity.textContent = percent + "%";
        speechScore.textContent = score.toFixed(1) + " / 10";
        speechRisk.textContent = risk;

        status.textContent = "✅ Demo Assessment Complete";

        // Save to localStorage
        localStorage.setItem("speechTranscript", targetSentence);
        localStorage.setItem("speechSimilarity", percent);
        localStorage.setItem("speechScore", score.toFixed(1));
        localStorage.setItem("speechRisk", risk);
        localStorage.setItem("speechRiskKey", riskKey);
        localStorage.setItem("speechCompleted", "true");

        console.log("Speech demo saved.");

        startBtn.disabled = false;

        // Optional: automatically continue to results page
        // window.location.href = "results.html";

    }, 1500);

});
}

// =========================================
// REAL MODE
// =========================================

else {

    if (!SpeechRecognition) {

        status.textContent =
            t.speechNotSupported;

        startBtn.disabled = true;

    }

    else {

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        startBtn.addEventListener("click", () => {

            status.textContent = t.listening;
            recognizedText.textContent = "-";

            recognition.start();

        });

        recognition.onresult = function (event) {

            const transcript =
                event.results[0][0].transcript;

            recognizedText.textContent = transcript;

            const percent =
                calculateSimilarity(
                    transcript.toLowerCase(),
                    targetSentence.toLowerCase()
                );

            similarity.textContent =
                percent.toFixed(1) + "%";

            let score;
let risk;
let riskKey;

if (percent >= 90) {
    score = 10;
    riskKey = "speechNormal";
}
else if (percent >= 75) {
    score = 8;
    riskKey = "speechMild";
}
else if (percent >= 60) {
    score = 6;
    riskKey = "speechPossible";
}
else {
    score = 4;
    riskKey = "speechSevere";
}

risk = t[riskKey];

speechScore.textContent = score.toFixed(1) + " / 10";
speechRisk.textContent = risk;

status.textContent = t.complete;

localStorage.setItem("speechTranscript", transcript);
localStorage.setItem("speechSimilarity", percent.toFixed(1));
localStorage.setItem("speechScore", score.toFixed(1));
localStorage.setItem("speechRisk", risk);
localStorage.setItem("speechRiskKey", riskKey);
localStorage.setItem("speechCompleted", "true");

            console.log("Speech assessment saved.");

        };

   recognition.onerror = function (event) {

    if (event.error === "no-speech") {
        status.textContent = t.speechNoSpeech;

        recognizedText.textContent = "-";
        similarity.textContent = "-";
        speechScore.textContent = "-";
        speechRisk.textContent = "-";

        localStorage.removeItem("speechTranscript");
        localStorage.removeItem("speechSimilarity");
        localStorage.removeItem("speechScore");
        localStorage.removeItem("speechRisk");
        localStorage.removeItem("speechCompleted");

        return;
    }

    if (event.error === "not-allowed") {
        status.textContent = t.speechPermissionDenied;
        return;
    }

    status.textContent = "❌ Error: " + event.error;
};
     recognition.onend = function () {
    if (status.textContent === t.listening) {
        status.textContent = t.speechNoSpeech;
    }

        };

    }

}

// =========================================
// Similarity Function
// =========================================

function calculateSimilarity(spoken, target) {

    const ignoreWords = ["a", "an", "the"];

    spoken = spoken
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();

    target = target
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();

    const spokenWords = spoken.split(/\s+/);

    const targetWords = target
        .split(/\s+/)
        .filter(word => !ignoreWords.includes(word));

    let matches = 0;

    targetWords.forEach(word => {

        if (spokenWords.includes(word))
            matches++;

    });

    return (matches / targetWords.length) * 100;
}
