/* ==========================================================
   NeuroGuard - app.js
   Main Application Controller
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 NeuroGuard Initializing...");

    initializeApplication();

});

/* ==========================================================
   Initialize Everything
========================================================== */

function initializeApplication() {

    initializeTheme();
    initializeNavigation();
    initializeComponents();
    initializeAnimations();

    initializeLoader();

    initializeCounters();

    initializeCharts();

    initializeEmergencyButton();

    initializeTooltips();

    initializeScrollProgress();

    initializeBackToTop();

    initializeStatistics();

    console.log("✅ NeuroGuard Ready");

}

/* ==========================================================
   LOADER
========================================================== */

function initializeLoader() {
    console.log("initializeLoader() called");

    const loader = document.querySelector(".loading-screen");
    console.log(loader);

    if (!loader) return;

    setTimeout(() => {
        console.log("Hiding loader...");
        loader.classList.add("hide");

        setTimeout(() => {
            console.log("Removing loader...");
            loader.remove();
        }, 600);
    }, 1200);
}
/* ==========================================================
   COUNTERS
========================================================== */

function initializeCounters() {

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        if (!target) return;

        let value = 0;

        const speed = target / 80;

        function updateCounter() {

            value += speed;

            if (value < target) {

                counter.textContent = Math.floor(value);

                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent = target;

            }

        }

        updateCounter();

    });

}

/* ==========================================================
   CHART PLACEHOLDER
========================================================== */

function initializeCharts() {

    const charts = document.querySelectorAll(".progress-bar");

    charts.forEach(bar => {

        const percentage = bar.dataset.progress || "100";

        bar.style.width = percentage + "%";

    });

}

/* ==========================================================
   EMERGENCY BUTTON
========================================================== */

function initializeEmergencyButton() {

    const emergency = document.querySelector(".emergency-btn");

    if (!emergency) return;

    emergency.addEventListener("click", () => {

        alert(
            "🚑 Emergency Mode\n\nCall Emergency Services Immediately.\nRecord symptom onset time."
        );

    });

}

/* ==========================================================
   TOOLTIPS
========================================================== */

function initializeTooltips() {

    document.querySelectorAll("[data-tooltip]").forEach(element => {

        element.addEventListener("mouseenter", () => {

            element.setAttribute(
                "title",
                element.dataset.tooltip
            );

        });

    });

}

/* ==========================================================
   SCROLL PROGRESS BAR
========================================================== */

function initializeScrollProgress() {

    const progress = document.querySelector(".scroll-progress");

    if (!progress) return;

    window.addEventListener("scroll", () => {

        const totalHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progressValue =
            (window.scrollY / totalHeight) * 100;

        progress.style.width = progressValue + "%";

    });

}

/* ==========================================================
   BACK TO TOP BUTTON
========================================================== */

function initializeBackToTop() {

    const button = document.querySelector(".back-to-top");

    if (!button) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ==========================================================
   LIVE STATS
========================================================== */

function initializeStatistics() {

    const stats = document.querySelectorAll(".live-stat");

    stats.forEach(stat => {

        if (!stat.dataset.random) return;

        setInterval(() => {

            const min = Number(stat.dataset.min);
            const max = Number(stat.dataset.max);

            stat.textContent =
                Math.floor(
                    Math.random() * (max - min + 1)
                ) + min;

        }, 3000);

    });

}

/* ==========================================================
   PLACEHOLDER FUNCTIONS
   (Implemented in other JS files)
========================================================== */

function initializeTheme() {

    if (typeof initTheme === "function") {

        initTheme();

    }

}

function initializeNavigation() {

    if (typeof initNavigation === "function") {

        initNavigation();

    }

}

function initializeComponents() {

    if (typeof initComponents === "function") {

        initComponents();

    }

}

function initializeAnimations() {

    if (typeof initAnimations === "function") {

        initAnimations();

    }

}

/* ==========================================================
   WINDOW RESIZE
========================================================== */

window.addEventListener("resize", () => {

    console.log("📱 Layout Updated");

});

/* ==========================================================
   NETWORK STATUS
========================================================== */

window.addEventListener("offline", () => {

    console.warn("⚠ Offline Mode");

});

window.addEventListener("online", () => {

    console.log("🌐 Back Online");

});

/* ==========================================================
   PAGE VISIBILITY
========================================================== */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        console.log("⏸ Page Hidden");

    } else {

        console.log("▶ Page Active");

    }

});

/* ==========================================================
   END
========================================================== */

console.log("❤️ NeuroGuard App Controller Loaded");