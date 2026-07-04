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

let poseLandmarker;

init();

async function init() {

    status.textContent = "Loading AI model...";

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

    status.textContent = "✅ Model Loaded";

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

        status.textContent = "Please upload an image.";

        return;

    }

    status.textContent = "Analyzing posture...";

    const result =
        await poseLandmarker.detect(preview);

    if (!result.landmarks.length) {

        status.textContent = "❌ No person detected.";

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

        armRisk = "🟢 Normal";

    }

    else if (diff < 0.10) {

        armScore = 8;

        armRisk = "🟡 Mild Difference";

    }

    else if (diff < 0.18) {

        armScore = 6;

        armRisk = "🟠 Possible Arm Weakness";

    }

    else {

        armScore = 3;

        armRisk = "🔴 Significant Arm Drift";

    }

    score.textContent = armScore.toFixed(1) + " / 10";

    risk.textContent = armRisk;

    status.textContent = "✅ Analysis Complete";

    // Save for report page

    localStorage.setItem("armScore", armScore.toFixed(1));
    localStorage.setItem("armRisk", armRisk);
    localStorage.setItem("armDifference", diff.toFixed(3));
    localStorage.setItem("leftWrist", leftWrist.y.toFixed(3));
    localStorage.setItem("rightWrist", rightWrist.y.toFixed(3));
    localStorage.setItem("armCompleted", "true");

    console.log("Arm assessment saved.");

}
