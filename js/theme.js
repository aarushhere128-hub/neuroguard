/* ==========================================================
   NeuroGuard - theme.js
   Dark / Light Theme Controller
========================================================== */
const themeBtn = document.getElementById("themeToggle");
const themeBtnMobile = document.getElementById("themeToggleMobile");
function initTheme() {
   console.log("initTheme ran");

    const themeBtn = document.getElementById("themeToggle");
    const themeBtnMobile = document.getElementById("themeToggleMobile");

    const savedTheme = localStorage.getItem("neuroguard-theme") || "light";

    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    [themeBtn, themeBtnMobile].forEach(button => {

        if (!button) return;

button.addEventListener("click", () => {

    console.log("Theme button clicked");

    const current =
        document.documentElement.getAttribute("data-theme") || "light";

    const next =
        current === "light" ? "dark" : "light";

    console.log(current, "->", next);

    document.documentElement.setAttribute("data-theme", next);

    localStorage.setItem("neuroguard-theme", next);

    updateThemeIcon(next);

});

    });

}
/* ==========================================================
   Update Theme Button Icon
========================================================== */

function updateThemeIcon(theme) {

    const themeBtn = document.getElementById("themeToggle");
    const themeBtnMobile = document.getElementById("themeToggleMobile");

    [themeBtn, themeBtnMobile].forEach(button => {

        if (!button) return;

        button.textContent = theme === "dark" ? "☀️" : "🌙";

    });

}

/* ==========================================================
   Optional: Follow System Theme on First Visit
========================================================== */

(function () {
    if (localStorage.getItem("neuroguard-theme")) return;

    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme = prefersDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);
})();

/* ==========================================================
   Auto-update if system theme changes
========================================================== */

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

mediaQuery.addEventListener("change", (e) => {
    if (localStorage.getItem("neuroguard-theme")) return;

    const theme = e.matches ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);

    updateThemeIcon(theme);
});

/* ==========================================================
   Theme Initialized
========================================================== */

console.log("🌙 Theme Controller Loaded");

