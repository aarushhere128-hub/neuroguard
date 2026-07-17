import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { PoseLandmarker, FilesetResolver } = vision;

const upload = document.getElementById("imageUpload");
const preview = document.getElementById("previewImage");

const status = document.getElementById("status");
const score = document.getElementById("score");
const risk = document.getElementById("risk");

const leftText = document.getElementById("leftWrist");
const rightText = document.getElementById("rightWrist");
const differenceText = document.getElementById("difference");

const analyzeBtn = document.getElementById("analyzeBtn");
const lang = localStorage.getItem("language") || "en";

window.armMessages = {
    en: {
        loading: "Loading AI model...",
        loaded: "✅ Model Loaded",
        upload: "Please upload an image.",
        analyzing: "Analyzing posture...",
        noPerson: "❌ No person detected.",
        complete: "✅ Analysis Complete",

        normal: "🟢 Normal",
        mild: "🟡 Mild Difference",
        weak: "🟠 Possible Arm Weakness",
        severe: "🔴 Significant Arm Drift"
    },

    hi: {
        loading: "एआई मॉडल लोड हो रहा है...",
        loaded: "✅ मॉडल लोड हो गया",
        upload: "कृपया एक चित्र अपलोड करें।",
        analyzing: "मुद्रा का विश्लेषण किया जा रहा है...",
        noPerson: "❌ कोई व्यक्ति नहीं मिला।",
        complete: "✅ विश्लेषण पूरा हुआ",

        normal: "🟢 सामान्य",
        mild: "🟡 हल्का अंतर",
        weak: "🟠 हाथ में संभावित कमजोरी",
        severe: "🔴 हाथ में गंभीर कमजोरी"
    },

    pa: {
        loading: "ਏਆਈ ਮਾਡਲ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
        loaded: "✅ ਮਾਡਲ ਲੋਡ ਹੋ ਗਿਆ",
        upload: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ।",
        analyzing: "ਪੋਸਚਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
        noPerson: "❌ ਕੋਈ ਵਿਅਕਤੀ ਨਹੀਂ ਮਿਲਿਆ।",
        complete: "✅ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋਇਆ",

        normal: "🟢 ਸਧਾਰਣ",
        mild: "🟡 ਹਲਕਾ ਫਰਕ",
        weak: "🟠 ਬਾਂਹ ਵਿੱਚ ਸੰਭਾਵਿਤ ਕਮਜ਼ੋਰੀ",
        severe: "🔴 ਬਾਂਹ ਵਿੱਚ ਗੰਭੀਰ ਕਮਜ਼ੋਰੀ"
    }
};

function getText() {
    const lang = localStorage.getItem("language") || "en";
    return armMessages[lang];
}

let poseLandmarker;

init();

async function init() {

    status.textContent = getText().loading;

    const filesetResolver =
        await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );

    poseLandmarker =
        await PoseLandmarker.createFromOptions(
            filesetResolver,
            {

                baseOptions: {

                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"

                },

                runningMode: "IMAGE",

                numPoses: 1

            });

    status.textContent = getText().loaded;

}

upload.addEventListener("change", e => {

    const file = e.target.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";

});

analyzeBtn.addEventListener("click", detect);

async function detect() {

    if (!preview.src) {

        status.textContent = getText().upload;

        return;

    }

    status.textContent = getText().analyzing;

    const result =
        await poseLandmarker.detect(preview);

    if (!result.landmarks.length) {

        status.textContent = getText().noPerson;

        return;

    }

    const landmarks = result.landmarks[0];

    const leftWrist = landmarks[15];

    const rightWrist = landmarks[16];

    leftText.textContent = leftWrist.y.toFixed(3);

    rightText.textContent = rightWrist.y.toFixed(3);

    const diff = Math.abs(leftWrist.y - rightWrist.y);

    differenceText.textContent = diff.toFixed(3);

    let armScore;

   let riskKey;

if (diff < 0.05) {
    armScore = 10;
    riskKey = "normal";
}
else if (diff < 0.10) {
    armScore = 8;
    riskKey = "mild";
}
else if (diff < 0.18) {
    armScore = 6;
    riskKey = "weak";
}
else {
    armScore = 3;
    riskKey = "severe";
}

risk.textContent = getText()[riskKey];

localStorage.setItem("armRiskKey", riskKey);

    score.textContent = armScore.toFixed(1) + " / 10";

    risk.textContent = risk;

    status.textContent = getText().complete;

    // Save for report page

    localStorage.setItem("armScore", armScore.toFixed(1));
    localStorage.setItem("risk", risk);
    localStorage.setItem("armDifference", diff.toFixed(3));
    localStorage.setItem("leftWrist", leftWrist.y.toFixed(3));
    localStorage.setItem("rightWrist", rightWrist.y.toFixed(3));
    localStorage.setItem("armCompleted", "true");

    console.log("Arm assessment saved.");

}
