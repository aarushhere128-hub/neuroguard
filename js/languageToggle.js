// ===============================
// NeuroGuard - languageToggle.js
// ===============================

const SUPPORTED_LANGUAGES = [
    { code: "en", label: "English", native: "🇬🇧 English" },
    { code: "hi", label: "Hindi", native: "🇮🇳 हिन्दी" },
    { code: "pa", label: "Punjabi", native: "🇮🇳 ਪੰਜਾਬੀ" }
];

/**
 * Initializes and renders the dynamic language toggle menu into a given container.
 * @param {string} containerId - The ID of the element where the pills should be rendered.
 * @param {Function} [onLanguageChange] - Optional callback function to execute when language changes.
 */
export function initLanguageToggle(containerId = "languageMenuContainer", onLanguageChange = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentLang = localStorage.getItem("language") || "en";

    // Clear existing contents to prevent duplication
    container.innerHTML = "";
    container.className = "language-menu-grid";

    SUPPORTED_LANGUAGES.forEach((lang) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `lang-pill ${lang.code === currentLang ? "active" : ""}`;
        button.textContent = lang.native;
        button.setAttribute("data-lang", lang.code);
        button.setAttribute("aria-label", `Switch language to ${lang.label}`);

        button.addEventListener("click", () => {
            // Update active state visually
            container.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
            button.classList.add("active");

            // Save preference
            localStorage.setItem("language", lang.code);

            console.log(`🌍 Language switched to: ${lang.label} (${lang.code})`);

            // Execute callback or reload page to update page strings
            if (typeof onLanguageChange === "function") {
                onLanguageChange(lang.code);
            } else {
                window.location.reload();
            }
        });

        container.appendChild(button);
    });
}
