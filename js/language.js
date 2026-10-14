// ==============================
// NeuroGuard Language Switcher
// ==============================
const languageSelect = document.getElementById("languageSelect");
const languageSelectMobile = document.getElementById("languageSelectMobile");
export const translations = {
    en: {

        // Navbar
        navhome: "Home",
        navproblem: "Problem",
        navfeature: "Features",
        navtech: "Technology",
        navcompare: "Comparison",
        navcontact: "Contact",
        backBtn: "Back",
        armBadge: "💪 FAST Arm Assessment",
        navAssessment: "Assessment",
        navInstructions: "Instructions",
        instructionsTitle: "📋 Instructions",
        instruction1: "Face the camera.",
        instruction2: "Stand straight.",
        instruction3: "Raise both arms horizontally.",
        instruction4: "Keep elbows straight.",
        instruction5: "Ensure both hands are visible.",
        instruction6: "Upload the image below.",
        
        analyzeBtn: "Analyze Arms",
        
        resultTitle: "Assessment Result",
        status: "Waiting for image...",
        
        armScoreTitle: "Arm Score",
        riskTitle: "Risk Level",
        leftWristTitle: "Left Wrist Height",
        rightWristTitle: "Right Wrist Height",
        differenceTitle: "Difference",
        
        educationTitle: "What does this test check?",
        educationDescription: "During the FAST stroke assessment, difficulty raising one arm or one arm drifting downward may indicate possible muscle weakness. This AI assessment is designed only for edu[...]",
        
        footerLogo: "NeuroGuard",
        footerTagline: "AI Assisted Stroke Awareness Platform",
        footerHome: "Home",
        footerPrivacy: "Privacy",
        footerAbout: "About",
        footerCopyright: "© 2026 NeuroGuard",
        
        // Hero
        badgeText: "AI-Assisted Stroke Awareness Platform",
        heroTitle: "Every Minute Matters.<br>Detect Earlier.<br>Act Faster.",
        heroDescription:
            "NeuroGuard is an AI-assisted educational screening platform that guides users through FAST assessment, records symptom onset time, and provides structured emergency guidance during th[...]",
        demoButton: "Start Demo",
        learnButton: "Learn More",

        // Hero Stats
       stat1: "People affected by neurological disorders",
    stat2: "Can make a difference in neurological emergencies",
    stat3: "Multiple neurological conditions",

        // Problem
        problemTitle: "The Problem",
        problemDesc:
            "Stroke treatment is highly time-sensitive, yet most delays occur before reaching the hospital.",
        timeline1: "Symptoms Begin",
        timeline2: "Confusion",
        timeline3: "Delay",
        timeline4: "Hospital",
        compareBadge: "Comparison",
        compareTitle: "How NeuroGuard Compares",
        compareDesc: "NeuroGuard combines AI-assisted educational screening, multilingual support, and emergency guidance in one accessible platform.",

        compareFeature: "Feature",
        compareTraditional: "Traditional Awareness",
        compareApps: "General Health Apps",

        row1: "AI-Assisted FAST Screening",
        row2: "Face Assessment",
        row3: "Arm Assessment",
        row4: "Speech Assessment",
        row5: "Symptom Timer",
        row6: "Emergency Guidance",
        row7: "Multilingual Support",
        row8: "Interactive FAST Learning",
        row9: "Web-Based Access",
        row10: "Purpose",

    armTitle1: "Arm Weakness Detection",
    armDescription1: "Raise both arms to shoulder height while facing the camera. Upload a clear front-facing image showing your entire upper body. NeuroGuard will estimate whether both arms appea[...]",

    purposeNG: "Educational Stroke Screening",
    purposeTA: "General Awareness",
    purposeHA: "General Health Monitoring",

        // Features
        featuresTitle: "Core Features",

        feature1Title: "Face Detection",
        feature1Desc: "AI-assisted facial landmark analysis detects possible facial asymmetry.",

        feature2Title: "Arm Assessment",
        feature2Desc: "Guided arm raise using pose estimation.",

        feature3Title: "Speech Analysis",
        feature3Desc: "Detects slurred or unclear speech patterns.",

        feature4Title: "Symptom Timer",
        feature4Desc: "Records exact symptom onset for clinicians.",
        // FAST Test Page
        logoText: "NeuroGuard",
        navassessment: "Assessment",
        navemergency: "Emergency",

        badgeText: "FAST Stroke Assessment",

        heroDesc: "Follow each guided assessment. NeuroGuard will help identify possible stroke symptoms using educational AI-assisted screening.",

        backButton: "Back",
        progressText: "Step 1 of 4",

        faceTitle: "Face",
        faceDesc: "Smile naturally while facing the camera.",
        faceButton: "Start Face Test",

        armTitle: "Arms",
        armDesc: "Raise both arms equally for 10 seconds.",
        armButton: "Start Arm Test",

        speechTitle: "Speech",
        speechDesc: "Read the displayed sentence aloud.",
        speechButton: "Start Speech Test",

        timeTitle: "Time",
        timeDesc: "Record when symptoms first appeared.",

        cameraTitle: "Live Camera Preview",
        cameraText: "📷 Camera Preview",

        summaryTitle: "Assessment Summary",
        summaryFace: "Face",
        summaryFaceStatus: "Pending",
        summaryArm: "Arms",
        summaryArmStatus: "Pending",
        summarySpeech: "Speech",
        summarySpeechStatus: "Pending",

        emergencyTitle: "Emergency Guidance",
        emergencyDesc: "If any FAST symptom is detected, call emergency medical services immediately. Early treatment can significantly improve outcomes.",
        emergencyButton: "🚑 Emergency Guidance",

        finishTitle: "Finish Assessment",
        finishDesc: "View your complete educational report.",
        reportButton: "Generate Report",

        footerHome: "Home",
        footerPrivacy: "Privacy",
        footerAbout: "About",
        footerCopyright: "© 2026 NeuroGuard",
        notCompleted: "Not Completed",
        notProvided: "Not Provided",
        assessmentIncomplete: "⚪ Assessment Incomplete",
        completeOneAssessment: "Complete at least one neurological assessment.",
        finishAssessment: "Finish the assessment to receive an educational screening."

        
    },

    hi: {
        pageTitle: "FAST परीक्षण परिणाम | NeuroGuard",
        home: "होम",

        badge: "FAST परीक्षण पूर्ण",
        heading: "परीक्षण परिणाम",
        intro:
            'यह परीक्षण केवल शैक्षिक स्क्रीनिंग के लिए है और <strong>चिकित्सीय निदान प्रदान नहीं करता।</strong><br>यदि स्ट्रोक के लक्षण हों, तो तुरंत आपातकालीन चिकित्सा सहायता प्राप्त करें।',

``` (truncated) 
