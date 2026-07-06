import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.style.color = "#333";
    message.textContent = "Signing in...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.style.color = "green";
        message.textContent = "✅ Login successful!";

        const next =
            sessionStorage.getItem("redirectAfterLogin") ||
            "index.html";

        sessionStorage.removeItem("redirectAfterLogin");

        setTimeout(() => {
            window.location.href = next;
        }, 800);

    }
    catch (error) {

        let errorMessage = "Login failed.";

        switch (error.code) {

            case "auth/invalid-credential":
                errorMessage = "Incorrect email or password.";
                break;

            case "auth/user-not-found":
                errorMessage = "No account exists with this email.";
                break;

            case "auth/wrong-password":
                errorMessage = "Incorrect password.";
                break;

            case "auth/invalid-email":
                errorMessage = "Invalid email address.";
                break;

            default:
                errorMessage = error.message;
        }

        message.style.color = "red";
        message.textContent = errorMessage;

        console.error(error);
    }

});
