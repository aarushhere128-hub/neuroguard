import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const authButtons = document.getElementById("authButtons");

onAuthStateChanged(auth, (user) => {

    if (user) {

        authButtons.innerHTML = `
            <div id="profileButton" class="profile-button">
                👤
            </div>
        `;
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
