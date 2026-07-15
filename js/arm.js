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

const armMessages = {
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

const t = armMessages[lang];

let poseLandmarker;

init();

async function init() {

    status.textContent = t.loading;

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

    status.textContent = t.loaded;

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

        status.textContent = t.upload;

        return;

    }

    status.textContent = t.analyzing;

    const result =
        await poseLandmarker.detect(preview);

    if (!result.landmarks.length) {

        status.textContent = t.noPerson;

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

    let armRisk;

    if (diff < 0.05) {
    armScore = 10;
    armRisk = t.normal;
}
else if (diff < 0.10) {
    armScore = 8;
    armRisk = t.mild;
}
else if (diff < 0.18) {
    armScore = 6;
    armRisk = t.weak;
}
else {
    armScore = 3;
    armRisk = t.severe;
}

    score.textContent = armScore.toFixed(1) + " / 10";

    risk.textContent = armRisk;

    status.textContent = t.complete;

    // Save for report page

    localStorage.setItem("armScore", armScore.toFixed(1));
    localStorage.setItem("armRisk", armRisk);
    localStorage.setItem("armDifference", diff.toFixed(3));
    localStorage.setItem("leftWrist", leftWrist.y.toFixed(3));
    localStorage.setItem("rightWrist", rightWrist.y.toFixed(3));
    localStorage.setItem("armCompleted", "true");

    console.log("Arm assessment saved.");

}
