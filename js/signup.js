import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const form = document.getElementById("signupForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.style.color = "#333";
    message.textContent = "Creating account...";

    try {

        // Create Firebase Authentication account
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        // Save user profile in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name,
            age: Number(age),
            gender,
            email,
            createdAt: serverTimestamp()
        });

        message.style.color = "green";
        message.textContent = "✅ Account created successfully!";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);

    }
    catch (error) {

        let errorMessage = error.message;

        switch (error.code) {

            case "auth/email-already-in-use":
                errorMessage = "Email is already registered.";
                break;

            case "auth/invalid-email":
                errorMessage = "Invalid email address.";
                break;

            case "auth/weak-password":
                errorMessage = "Password must be at least 6 characters.";
                break;

            default:
                errorMessage = error.message;
        }

        message.style.color = "red";
        message.textContent = errorMessage;

        console.error(error);
    }

});
