import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
const authButtons = document.getElementById("authButtons");

onAuthStateChanged(auth, (user) => {

    if (user) {

    authButtons.innerHTML = `
        <div id="profileButton" class="profile-button">
            👤
        </div>
    `;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {

        const data = userDoc.data();

        document.getElementById("profileName").textContent = data.name;
        document.getElementById("profileEmail").textContent = data.email;

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

});
