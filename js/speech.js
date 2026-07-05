// =========================================
// NeuroGuard | Speech Assessment
// =========================================

// ===== CHANGE THIS WHEN YOU HAVE A MICROPHONE =====
const demoToggle = document.getElementById("demoToggle");

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
const status = document.getElementById("status");
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

// =========================================
// DEMO MODE
// =========================================

if (DEMO_MODE) {

    startBtn.addEventListener("click", () => {

    status.textContent = "🤖 Running Demo Assessment...";
    startBtn.disabled = true;

    setTimeout(() => {

        // Generate a realistic score
        const percent = (70 + Math.random() * 30).toFixed(1);

        let score;
        let risk;

        if (percent >= 95) {
            score = 10.0;
            risk = "🟢 Normal";
        }
        else if (percent >= 80) {
            score = 8.0;
            risk = "🟡 Mild Difficulty";
        }
        else {
            score = 6.0;
            risk = "🟠 Possible Speech Impairment";
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
            "❌ Speech Recognition not supported.";

        startBtn.disabled = true;

    }

    else {

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        startBtn.addEventListener("click", () => {

            status.textContent = "🎤 Listening...";
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

            if (percent >= 90) {
    score = 10;
    risk = "🟢 Normal";
}
else if (percent >= 75) {
    score = 8;
    risk = "🟡 Mild Difficulty";
}
else if (percent >= 60) {
    score = 6;
    risk = "🟠 Possible Speech Impairment";
}
else {
    score = 4;
    risk = "🔴 Significant Speech Difficulty";
}

            speechScore.textContent =
                score.toFixed(1) + " / 10";

            speechRisk.textContent = risk;

            status.textContent =
                "✅ Assessment Complete";

            localStorage.setItem("speechTranscript", transcript);
            localStorage.setItem("speechSimilarity", percent.toFixed(1));
            localStorage.setItem("speechScore", score.toFixed(1));
            localStorage.setItem("speechRisk", risk);
            localStorage.setItem("speechCompleted", "true");

            console.log("Speech assessment saved.");

        };

        recognition.onerror = function (event) {

            status.textContent =
                "❌ Error: " + event.error;

        };

        recognition.onend = function () {

            if (status.textContent === "🎤 Listening...") {

                status.textContent =
                    "Recording stopped.";

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
