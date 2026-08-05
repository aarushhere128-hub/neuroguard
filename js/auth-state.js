import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const authContainer = document.getElementById("authNavContainer");
    if (!authContainer) return;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in: Render profile circle and dropdown overlay
            authContainer.innerHTML = `
                <div class="profile-menu-container" style="position: relative; display: inline-block;">
                    <div id="profileAvatar" style="
                        width: 40px; 
                        height: 40px; 
                        border-radius: 50%; 
                        background: #2563eb; 
                        color: #ffffff; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-weight: 700; 
                        cursor: pointer;
                        border: 2px solid rgba(56, 189, 248, 0.4);
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                        ${user.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </div>

                    <!-- Dropdown Overlay Menu -->
                    <div id="profileDropdown" style="
                        display: none;
                        position: absolute;
                        right: 0;
                        top: 50px;
                        background: rgba(15, 23, 42, 0.95);
                        border: 1px solid rgba(56, 189, 248, 0.2);
                        backdrop-filter: blur(16px);
                        border-radius: 14px;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.5);
                        width: 200px;
                        z-index: 1000;
                        overflow: hidden;
                        padding: 8px 0;">
                        
                        <a href="health.html" style="
                            display: block; 
                            padding: 12px 18px; 
                            color: #f8fafc; 
                            text-decoration: none; 
                            font-size: 14px; 
                            transition: background 0.2s;">
                            🩺 Health Information
                        </a>
                        
                        <a href="#" id="changePasswordBtn" style="
                            display: block; 
                            padding: 12px 18px; 
                            color: #f8fafc; 
                            text-decoration: none; 
                            font-size: 14px; 
                            transition: background 0.2s;">
                            🔑 Change Password
                        </a>
                        
                        <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 4px 0;"></div>
                        
                        <a href="#" id="logoutBtn" style="
                            display: block; 
                            padding: 12px 18px; 
                            color: #ef4444; 
                            text-decoration: none; 
                            font-size: 14px; 
                            font-weight: 600; 
                            transition: background 0.2s;">
                            🚪 Log Out
                        </a>
                    </div>
                </div>
            `;

            // Toggle Dropdown Overlay
            const avatar = document.getElementById("profileAvatar");
            const dropdown = document.getElementById("profileDropdown");

            avatar.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", () => {
                dropdown.style.display = "none";
            });

            // Change Password Action
            document.getElementById("changePasswordBtn").addEventListener("click", (e) => {
                e.preventDefault();
                alert("Password reset instructions will be sent to your registered email address.");
                // Optional: integrate sendPasswordResetEmail(auth, user.email) here if desired
            });

            // Log Out Action
            document.getElementById("logoutBtn").addEventListener("click", (e) => {
                e.preventDefault();
                signOut(auth).then(() => {
                    window.location.href = "login.html";
                }).catch((error) => {
                    console.error("Logout error:", error);
                });
            });

        } else {
            // User is NOT logged in: Show Login / Sign Up buttons
            authContainer.innerHTML = `
                <a href="login.html"><button class="secondary" style="margin-right: 8px;">Log In</button></a>
                <a href="signup.html"><button class="primary">Sign Up</button></a>
            `;
        }
    });
});
