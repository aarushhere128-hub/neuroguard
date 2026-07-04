// =========================================
// NeuroGuard | Speech Assessment
// speech.js
// =========================================

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const startBtn = document.getElementById("startBtn");

const status = document.getElementById("status");
const recognizedText = document.getElementById("recognizedText");
const speechScore = document.getElementById("speechScore");
const similarity = document.getElementById("similarity");
const speechRisk = document.getElementById("speechRisk");

const targetSentence =
"The sky is blue and the sun is bright today.";

if (!SpeechRecognition) {

    status.textContent =
        "❌ Speech Recognition is not supported in this browser.";

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

    recognition.onresult = function(event){

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

        if(percent >= 95){

            score = 10;
            risk = "🟢 Normal";

        }

        else if(percent >= 80){

            score = 8;
            risk = "🟡 Mild Difficulty";

        }

        else if(percent >= 60){

            score = 6;
            risk = "🟠 Possible Speech Impairment";

        }

        else{

            score = 4;
            risk = "🔴 Significant Speech Difficulty";

        }

        speechScore.textContent =
            score.toFixed(1) + " / 10";

        speechRisk.textContent = risk;

        status.textContent =
            "✅ Assessment Complete";

        // Save to local storage

        localStorage.setItem(
            "speechTranscript",
            transcript
        );

        localStorage.setItem(
            "speechSimilarity",
            percent.toFixed(1)
        );

        localStorage.setItem(
            "speechScore",
            score.toFixed(1)
        );

        localStorage.setItem(
            "speechRisk",
            risk
        );

        localStorage.setItem(
            "speechCompleted",
            "true"
        );

        console.log("Speech assessment saved.");

    };

    recognition.onerror = function(event){

        status.textContent =
            "❌ Error: " + event.error;

    };

    recognition.onend = function(){

        if(status.textContent === "🎤 Listening..."){

            status.textContent =
                "Recording stopped.";

        }

    };

}

// =========================================
// Similarity Function
// =========================================

function calculateSimilarity(a,b){

    const wordsA = a.split(" ");
    const wordsB = b.split(" ");

    let matches = 0;

    wordsB.forEach(word=>{

        if(wordsA.includes(word))
            matches++;

    });

    return (matches / wordsB.length) * 100;

}
