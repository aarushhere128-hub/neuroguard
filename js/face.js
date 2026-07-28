
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
const faceMessages = {
 en: {
    uploadSuccess: "✅ Image uploaded successfully.",
    photoCaptured: "✅ Photo captured successfully.",
    detecting: "🔍 Detecting face...",
    landmarks: "🧠 Extracting landmarks...",
    symmetry: "📐 Measuring facial symmetry...",
    aiScore: "🤖 Calculating AI score...",
    runningModel: "🤖 Running TensorFlow model...",
    modelNotLoaded: "❌ AI model not loaded.",
    noFace: "❌ No human face detected.",
    sideways: "⚠ Face turned sideways. Look straight at the camera.",
    frontFacing: "⚠ Please upload a straight front-facing image.",
    invalidOutput: "❌ Model output invalid.",
    analysisComplete: "✅ Analysis Complete",

    healthy: "Healthy",
    drooping: "Drooping",
    normal: "🟢 Normal",
    mild: "🟡 Mild Risk",
    moderate: "🟠 Moderate Risk",
    high: "🔴 High Risk"
},

 hi: {
    uploadSuccess: "✅ चित्र सफलतापूर्वक अपलोड हो गया।",
    photoCaptured: "✅ फोटो सफलतापूर्वक कैप्चर हो गई।",
    detecting: "🔍 चेहरे का पता लगाया जा रहा है...",
    landmarks: "🧠 चेहरे के लैंडमार्क निकाले जा रहे हैं...",
    symmetry: "📐 चेहरे की समरूपता मापी जा रही है...",
    aiScore: "🤖 एआई स्कोर की गणना की जा रही है...",
    runningModel: "🤖 TensorFlow मॉडल चल रहा है...",
    modelNotLoaded: "❌ एआई मॉडल लोड नहीं हुआ।",
    noFace: "❌ कोई मानव चेहरा नहीं मिला।",
    sideways: "⚠ कृपया सीधे कैमरे की ओर देखें।",
    frontFacing: "⚠ कृपया सामने से ली गई स्पष्ट तस्वीर अपलोड करें।",
    invalidOutput: "❌ मॉडल का आउटपुट अमान्य है।",
    analysisComplete: "✅ विश्लेषण पूरा हुआ",

    healthy: "स्वस्थ",
    drooping: "चेहरे का झुकाव",
    normal: "🟢 सामान्य",
    mild: "🟡 हल्का जोखिम",
    moderate: "🟠 मध्यम जोखिम",
    high: "🔴 उच्च जोखिम"
},

pa: {
    uploadSuccess: "✅ ਤਸਵੀਰ ਸਫਲਤਾਪੂਰਵਕ ਅੱਪਲੋਡ ਹੋ ਗਈ।",
    photoCaptured: "✅ ਫੋਟੋ ਸਫਲਤਾਪੂਰਵਕ ਕੈਪਚਰ ਹੋ ਗਈ।",
    detecting: "🔍 ਚਿਹਰਾ ਪਛਾਣਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    landmarks: "🧠 ਚਿਹਰੇ ਦੇ ਲੈਂਡਮਾਰਕ ਲੱਭੇ ਜਾ ਰਹੇ ਹਨ...",
    symmetry: "📐 ਚਿਹਰੇ ਦੀ ਸਮਰੂਪਤਾ ਮਾਪੀ ਜਾ ਰਹੀ ਹੈ...",
    aiScore: "🤖 ਏਆਈ ਸਕੋਰ ਦੀ ਗਣਨਾ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    runningModel: "🤖 TensorFlow ਮਾਡਲ ਚੱਲ ਰਿਹਾ ਹੈ...",
    modelNotLoaded: "❌ ਏਆਈ ਮਾਡਲ ਲੋਡ ਨਹੀਂ ਹੋਇਆ।",
    noFace: "❌ ਕੋਈ ਮਨੁੱਖੀ ਚਿਹਰਾ ਨਹੀਂ ਮਿਲਿਆ।",
    sideways: "⚠ ਕਿਰਪਾ ਕਰਕੇ ਕੈਮਰੇ ਵੱਲ ਸਿੱਧਾ ਦੇਖੋ।",
    frontFacing: "⚠ ਕਿਰਪਾ ਕਰਕੇ ਸਾਹਮਣੇ ਤੋਂ ਲਈ ਗਈ ਸਾਫ਼ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ।",
    invalidOutput: "❌ ਮਾਡਲ ਦਾ ਨਤੀਜਾ ਅਵੈਧ ਹੈ।",
    analysisComplete: "✅ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋਇਆ",

    healthy: "ਸਧਾਰਣ",
    drooping: "ਚਿਹਰੇ ਦਾ ਝੁਕਾਅ",
    normal: "🟢 ਸਧਾਰਣ",
    mild: "🟡 ਹਲਕਾ ਖਤਰਾ",
    moderate: "🟠 ਦਰਮਿਆਨਾ ਖਤਰਾ",
    high: "🔴 ਉੱਚ ਖਤਰਾ"
}
};

function getText() {
    const lang = localStorage.getItem("language") || "en";
    return faceMessages[lang];
}
window.updateFaceResultLanguage = function () {

    const riskKey = localStorage.getItem("faceRiskKey");
    if (!riskKey) return;

    const healthy = localStorage.getItem("faceHealthy");
    const drooping = localStorage.getItem("faceDrooping");
    const faceScore = localStorage.getItem("faceScore");

    let color = "green";

    if (riskKey === "high") color = "red";
    else if (riskKey === "moderate") color = "orange";
    else if (riskKey === "mild") color = "#d4a100";

    score.innerHTML = `
    <div style="font-size:34px;font-weight:bold;color:${color};">
        ${faceScore}/10
    </div>

    <div style="font-size:22px;margin-top:10px;">
        ${getText()[riskKey]}
    </div>

    <div style="margin-top:15px;">
        ${getText().healthy} : ${healthy}%<br>
        ${getText().drooping} : ${drooping}%
    </div>
    `;
};
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
    status.textContent = getText().uploadSuccess;
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

       status.textContent = getText().photoCaptured;
        

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

    status.innerHTML = getText().detecting;
    await wait(700);

    status.innerHTML = getText().landmarks;
    await wait(900);

    status.innerHTML = getText().symmetry;
    await wait(900);

    status.innerHTML = getText().aiScore;
    await wait(1000);

    await detect(uploadedImage);

});

// ----------------------
// Detect Face
// ----------------------

async function detect(image) {
    if (!faceLandmarker) {
        status.textContent = getText().modelNotLoaded;
        return;
    }

    const result = faceLandmarker.detect(image);

    if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
        status.textContent = getText().noFace;
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
    getText().sideways;
    return;
}

    // Reject faces that are turned too much
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    const eyeLevelDiff = Math.abs(leftEye.y - rightEye.y);

    if (eyeLevelDiff > 0.05) {
        status.textContent =
            getText().frontFacing;
        score.textContent = "Face Score : -";
        return;
    }

    status.textContent = getText().analysisComplete;

status.textContent = getText().runningModel;

const predictions = await model.predict(image);

console.log(predictions);

const healthy =
    predictions.find(p => p.className === "Healthy Face");

const drooping =
    predictions.find(p => p.className === "Drooping Face");

if (!healthy || !drooping) {
    status.textContent = getText().invalidOutput;
    return;
}

const healthyProb = healthy.probability;
const droopingProb = drooping.probability;

const faceScore = healthyProb * 10;


let color;
let riskKey;

if (droopingProb >= 0.80) {
    riskKey = "high";
    color = "red";
}
else if (droopingProb >= 0.60) {
    riskKey = "moderate";
    color = "orange";
}
else if (droopingProb >= 0.40) {
    riskKey = "mild";
    color = "#d4a100";
}
else {
    riskKey = "normal";
    color = "green";
}

const risk = getText()[riskKey];
score.innerHTML = `
<div style="font-size:34px;font-weight:bold;color:${color};">
${faceScore.toFixed(1)}/10
</div>

<div style="font-size:22px;margin-top:10px;">
${risk}
</div>

<div style="margin-top:15px;">
${getText().healthy} :
${(healthyProb * 100).toFixed(1)}%
<br>
${getText().drooping} :
${(droopingProb * 100).toFixed(1)}%
</div>
`;

// Save results
localStorage.setItem("faceScore", faceScore.toFixed(1));
console.log("Risk =", risk);
console.log("Saving faceRisk...");
localStorage.setItem("faceRisk", risk);
console.log(localStorage.getItem("faceRisk"));
localStorage.setItem("faceRiskKey", riskKey);
localStorage.setItem("faceHealthy", (healthyProb * 100).toFixed(1));
localStorage.setItem("faceDrooping", (droopingProb * 100).toFixed(1));
localStorage.setItem("faceCompleted", "true");
status.textContent = getText().analysisComplete;

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
