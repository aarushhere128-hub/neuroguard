/* ==========================================================
   NeuroGuard - navigation.js
   Handles Navbar, Mobile Menu, Smooth Scrolling
   ========================================================== */

function initNavigation() {

    console.log("🧭 Navigation Initialized");

    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links a");

    /* ==========================================
       Navbar Background on Scroll
    ========================================== */

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 40) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }

    updateNavbar();

    window.addEventListener("scroll", updateNavbar);

    /* ==========================================
       Mobile Menu Toggle
    ========================================== */

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");

            document.body.classList.toggle("menu-open");

        });

    }

    /* ==========================================
       Close Mobile Menu After Click
    ========================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (navMenu) {

                navMenu.classList.remove("active");

            }

            if (menuToggle) {

                menuToggle.classList.remove("active");

            }

            document.body.classList.remove("menu-open");

        });

    });

    /* ==========================================
       Smooth Scrolling
    ========================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function(e) {

            const targetID = this.getAttribute("href");

            if (targetID === "#") return;

            const target = document.querySelector(targetID);

            if (!target) return;

            e.preventDefault();

            const offset = navbar ? navbar.offsetHeight : 0;

            window.scrollTo({

                top: target.offsetTop - offset,

                behavior: "smooth"

            });

        });

    });

    /* ==========================================
       Active Navigation Link
    ========================================== */

    const sections = document.querySelectorAll("section[id]");

    function highlightNav() {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 150;
            const height = section.offsetHeight;

            if (
                window.scrollY >= top &&
                window.scrollY < top + height
            ) {

                current = section.id;

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    }

    highlightNav();

    window.addEventListener("scroll", highlightNav);

    /* ==========================================
       Escape Key Closes Menu
    ========================================== */

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            if (navMenu) navMenu.classList.remove("active");

            if (menuToggle) menuToggle.classList.remove("active");

            document.body.classList.remove("menu-open");

        }

    });

    /* ==========================================
       Click Outside Menu Closes It
    ========================================== */

    document.addEventListener("click", e => {

        if (!navMenu || !menuToggle) return;

        const insideMenu = navMenu.contains(e.target);
        const insideButton = menuToggle.contains(e.target);

        if (!insideMenu && !insideButton) {

            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            document.body.classList.remove("menu-open");

        }

    });

}

/* ==========================================================
   Auto Initialize if app.js is absent
========================================================== */

if (typeof initializeApplication === "undefined") {

    document.addEventListener("DOMContentLoaded", () => {

        initNavigation();

    });

}