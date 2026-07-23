
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { FaceLandmarker, FilesetResolver } = vision;

// Elements
const upload = document.getElementById("imageUpload");

const preview = document.getElementById("preview");
const score = document.getElementById("score");
const analyzeBtn = document.getElementById("analyzeBtn");
const status = document.getElementById("status");
const cameraBtn = document.getElementById("cameraBtn");
const cameraContainer = document.getElementById("cameraContainer");
const video = document.getElementById("cameraPreview");
const canvas = document.getElementById("captureCanvas");
const captureBtn = document.getElementById("captureBtn");

let stream;
console.log(upload);
console.log(preview);
console.log(analyzeBtn);
console.log(status);
console.log("%cDeveloped by Aarush Sharma", "color:#00b894;font-size:16px;");

console.log("face.js loaded");
let faceLandmarker;
let uploadedImage = null;
let model;

const MODEL_URL = "./model/";
// ----------------------
// Initialize MediaPipe
// ----------------------
async function init() {

    const resolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(resolver, {
    baseOptions: {
        modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
    },
    runningMode: "IMAGE",
    numFaces: 1,
    outputFaceBlendshapes: true,
    outputFacialTransformationMatrixes: true
});

    console.log("✅ Face Landmarker Ready");

}

init();
loadModel();

async function loadModel() {
    model = await tmImage.load(
        MODEL_URL + "model.json",
        MODEL_URL + "metadata.json"
    );

    console.log("✅ TensorFlow model loaded");

    document.getElementById("loadingModel").style.display = "none";
}

// ----------------------
// Upload Image
// ----------------------

upload.addEventListener("change", (e) => {

    const file = e.target.files[0];
    if (!file) return;

    // Create URL for preview
    const imageURL = URL.createObjectURL(file);

    // Show preview immediately
    preview.src = imageURL;
    preview.style.display = "block";

    // Reset UI
    score.textContent = "Face Score : -";
    status.textContent = "✅ Image uploaded successfully.";
    analyzeBtn.disabled = false;

    // Store image for analysis
    uploadedImage = new Image();
    uploadedImage.src = imageURL;

});
cameraBtn.addEventListener("click", async () => {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera cannot be accessed on this device.");
        return;
    }


    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: "environment"

            }

        });

        video.srcObject = stream;

await video.play();

cameraContainer.style.display = "block";
    }

    catch (err) {

    console.error(err);

    if (err.name === "NotAllowedError") {
        alert("Camera permission was denied.");
    }
    else if (err.name === "NotFoundError") {
        alert("No camera was found on this device.");
    }
    else {
        alert("Camera cannot be accessed.");
    }

}
});
captureBtn.addEventListener("click", () => {

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video,0,0);

    preview.src = canvas.toDataURL("image/png");

    preview.style.display = "block";

    uploadedImage = new Image();

    uploadedImage.onload = () => {

        analyzeBtn.disabled = false;

        status.textContent = "✅ Photo captured successfully.";
        

    };
    uploadedImage.src = preview.src;

   if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
}

video.srcObject = null;
cameraContainer.style.display = "none";

});
// ----------------------
// Analyze Button
// ----------------------

analyzeBtn.addEventListener("click", async () => {

    if (!uploadedImage) return;

    status.innerHTML = "🔍 Detecting face...";
    await wait(700);

    status.innerHTML = "🧠 Extracting landmarks...";
    await wait(900);

    status.innerHTML = "📐 Measuring facial symmetry...";
    await wait(900);

    status.innerHTML = "🤖 Calculating AI score...";
    await wait(1000);

    await detect(uploadedImage);

});

// ----------------------
// Detect Face
// ----------------------

async function detect(image) {
    if (!faceLandmarker) {
        status.textContent = "❌ AI model not loaded.";
        return;
    }

    const result = faceLandmarker.detect(image);

    if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
        status.textContent = "❌ No human face detected.";
        score.textContent = "Face Score : -";
        return;
    }

    const landmarks = result.faceLandmarks[0];
    const nose = landmarks[1];
const leftEar = landmarks[234];
const rightEar = landmarks[454];

const yaw =
    Math.abs(
        (nose.x-leftEar.x)-
        (rightEar.x-nose.x)
    );

if(yaw>0.08){
    status.textContent =
    "⚠ Face turned sideways. Look straight at the camera.";
    return;
}

    // Reject faces that are turned too much
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    const eyeLevelDiff = Math.abs(leftEye.y - rightEye.y);

    if (eyeLevelDiff > 0.05) {
        status.textContent =
            "⚠ Please upload a straight front-facing image.";
        score.textContent = "Face Score : -";
        return;
    }

    status.textContent = "✅ Analysis Complete";

status.textContent = "🤖 Running TensorFlow model...";

const predictions = await model.predict(image);

console.log(predictions);

const healthy =
    predictions.find(p => p.className === "Healthy Face");

const drooping =
    predictions.find(p => p.className === "Drooping Face");

if (!healthy || !drooping) {
    status.textContent = "❌ Model output invalid.";
    return;
}

const healthyProb = healthy.probability;
const droopingProb = drooping.probability;

const faceScore = healthyProb * 10;

let risk;
let color;

if (droopingProb >= 0.80) {
    risk = "🔴 High Risk";
    color = "red";
}
else if (droopingProb >= 0.60) {
    risk = "🟠 Moderate Risk";
    color = "orange";
}
else if (droopingProb >= 0.40) {
    risk = "🟡 Mild Risk";
    color = "#d4a100";
}
else {
    risk = "🟢 Normal";
    color = "green";
}

score.innerHTML = `
<div style="font-size:34px;
            font-weight:bold;
            color:${color};">
${faceScore.toFixed(1)}/10
</div>

<div style="font-size:22px;margin-top:10px;">
${risk}
</div>

<div style="margin-top:15px;">
Healthy :
${(healthyProb * 100).toFixed(1)}%
<br>
Drooping :
${(droopingProb * 100).toFixed(1)}%
</div>
`;

// Save results
localStorage.setItem("faceScore", faceScore.toFixed(1));
console.log("Risk =", risk);
console.log("Saving faceRisk...");
localStorage.setItem("faceRisk", risk);
console.log(localStorage.getItem("faceRisk"));
localStorage.setItem("faceHealthy", (healthyProb * 100).toFixed(1));
localStorage.setItem("faceDrooping", (droopingProb * 100).toFixed(1));
localStorage.setItem("faceCompleted", "true");
status.textContent = "✅ Analysis Complete";

} // <-- detect() ends here

// ----------------------
// Delay Function
// ----------------------

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
window.addEventListener("beforeunload", () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});
