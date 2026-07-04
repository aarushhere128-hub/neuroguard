/* ==========================================================
   NeuroGuard - theme.js
   Dark / Light Theme Controller
========================================================== */

function initTheme() {
    const themeToggle = document.getElementById("themeToggle");

    // Load saved theme
    const savedTheme = localStorage.getItem("neuroguard-theme");

    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        updateThemeIcon("light");
    }

    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "light";

        const newTheme =
            currentTheme === "light" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", newTheme);

        localStorage.setItem("neuroguard-theme", newTheme);

        updateThemeIcon(newTheme);

        console.log(`🎨 Theme changed to ${newTheme}`);
    });
}

/* ==========================================================
   Update Theme Button Icon
========================================================== */

function updateThemeIcon(theme) {
    const button = document.getElementById("themeToggle");
    if (!button) return;

    button.textContent = theme === "dark" ? "☀️" : "🌙";
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