/* ==========================================================
   NeuroGuard - theme.js
   Permanent Dark Theme
========================================================== */

function initTheme() {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    console.log("🌙 Dark theme locked");
}

// Keep for compatibility
function toggleTheme() {
    return;
}
