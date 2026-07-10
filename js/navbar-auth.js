import { auth, db } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
const authButtons = document.getElementById("authButtons");

onAuthStateChanged(auth, async (user) => {

    if (user) {

    authButtons.innerHTML = `
        <div id="profileButton" class="profile-button">
            👤
        </div>
    `;

    const userDoc = await getDoc(doc(db, "users", user.uid));
const healthDoc = await getDoc(doc(db, "healthProfiles", user.uid));

if (userDoc.exists()) {

    const data = userDoc.data();

    document.getElementById("profileName").textContent = data.name;
    document.getElementById("profileEmail").textContent = data.email;
    document.getElementById("profileAge").textContent = data.age;
    document.getElementById("profileGender").textContent = data.gender;

}

if (healthDoc.exists()) {

    const health = healthDoc.data();

    document.getElementById("profileBloodGroup").textContent =
        health.bloodGroup || "Not Set";

    document.getElementById("profileEmergency").textContent =
        health.emergencyNumber || "Not Set";

}
    const profileButton = document.getElementById("profileButton");
    const profileOverlay = document.getElementById("profileOverlay");
    const closeProfile = document.getElementById("closeProfile");

    profileButton.addEventListener("click", () => {
        profileOverlay.classList.add("show");
    });

    closeProfile.addEventListener("click", () => {
        profileOverlay.classList.remove("show");
    });

}
const changePasswordBtn = document.getElementById("changePasswordBtn");

changePasswordBtn.addEventListener("click", async () => {

    const currentPassword = prompt("Enter your current password:");

    if (!currentPassword) return;

    const newPassword = prompt("Enter your new password (minimum 6 characters):");

    if (!newPassword) return;

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    try {

        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );

        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);

        alert("✅ Password changed successfully!");

    } catch (error) {

        alert(error.message);

    }

});
});
document.getElementById("logoutBtn").addEventListener("click", async () => {

    try {

        await signOut(auth);

        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "login.html";

    } catch (error) {

        alert("Logout failed: " + error.message);

    }

});
