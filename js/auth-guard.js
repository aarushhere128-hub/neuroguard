import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Immediately hide the page content to prevent flickering before the auth check completes
document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is NOT logged in, save the current page and redirect to login.html
        sessionStorage.setItem("redirectAfterLogin", window.location.href);
        window.location.replace("login.html");
    } else {
        // User is logged in, show the page content
        document.documentElement.style.visibility = "visible";
    }
});
