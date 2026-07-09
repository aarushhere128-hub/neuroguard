// ===============================
// NeuroGuard - health-info.js
// ===============================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// -------------------------------
// Redirect if not logged in
// -------------------------------

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const profileRef = doc(db, "healthProfiles", user.uid);

    // -------------------------------
    // LOAD DATA
    // -------------------------------

    try {

        const snapshot = await getDoc(profileRef);

        if (snapshot.exists()) {

            const data = snapshot.data();

            // Toggle buttons
            document.getElementById("hypertension").checked = data.hypertension ?? false;
            document.getElementById("diabetes").checked = data.diabetes ?? false;
            document.getElementById("previousStroke").checked = data.previousStroke ?? false;
            document.getElementById("heartDisease").checked = data.heartDisease ?? false;
            document.getElementById("atrialFibrillation").checked = data.atrialFibrillation ?? false;
            document.getElementById("highCholesterol").checked = data.highCholesterol ?? false;
            document.getElementById("kidneyDisease").checked = data.kidneyDisease ?? false;
            document.getElementById("obesity").checked = data.obesity ?? false;
            document.getElementById("smoker").checked = data.smoker ?? false;
            document.getElementById("alcohol").checked = data.alcohol ?? false;
            document.getElementById("familyHistory").checked = data.familyHistory ?? false;

            // Medical Information
            document.getElementById("bloodGroup").value = data.bloodGroup ?? "";
            document.getElementById("medications").value = data.medications ?? "";
            document.getElementById("allergies").value = data.allergies ?? "";

            // Emergency Information
            document.getElementById("emergencyName").value = data.emergencyName ?? "";
            document.getElementById("relationship").value = data.relationship ?? "";
            document.getElementById("emergencyNumber").value = data.emergencyNumber ?? "";

        }

    } catch (error) {

        console.error("Error loading health profile:", error);
        alert("Failed to load health information.");

    }

    // -------------------------------
    // SAVE DATA
    // -------------------------------

    document.getElementById("saveHealth").addEventListener("click", async () => {

        const healthData = {

            // Stroke Risk Factors
            hypertension: document.getElementById("hypertension").checked,
            diabetes: document.getElementById("diabetes").checked,
            previousStroke: document.getElementById("previousStroke").checked,
            heartDisease: document.getElementById("heartDisease").checked,
            atrialFibrillation: document.getElementById("atrialFibrillation").checked,
            highCholesterol: document.getElementById("highCholesterol").checked,
            kidneyDisease: document.getElementById("kidneyDisease").checked,
            obesity: document.getElementById("obesity").checked,
            smoker: document.getElementById("smoker").checked,
            alcohol: document.getElementById("alcohol").checked,
            familyHistory: document.getElementById("familyHistory").checked,

            // Medical Information
            bloodGroup: document.getElementById("bloodGroup").value,
            medications: document.getElementById("medications").value.trim(),
            allergies: document.getElementById("allergies").value.trim(),

            // Emergency Information
            emergencyName: document.getElementById("emergencyName").value.trim(),
            relationship: document.getElementById("relationship").value.trim(),
            emergencyNumber: document.getElementById("emergencyNumber").value.trim(),

            // Metadata
            uid: user.uid,
            email: user.email,
            updatedAt: serverTimestamp()

        };

        try {

            await setDoc(profileRef, healthData, { merge: true });

            alert("✅ Health information saved successfully!");

        } catch (error) {

            console.error("Error saving health profile:", error);
            alert("❌ Failed to save health information.");

        }

    });

});
