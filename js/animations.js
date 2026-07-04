// =========================================
// NeuroGuard Animations
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       Remove Loading Screen
    ====================================== */

    const loader = document.querySelector(".loading-screen");

    window.addEventListener("load", () => {
        if (loader) {
            setTimeout(() => {
                loader.classList.add("hide");

                setTimeout(() => {
                    loader.remove();
                }, 600);

            }, 1200);
        }
    });


    /* =====================================
       Scroll Reveal
    ====================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .fade-up, .fade-left, .fade-right, .zoom-in"
    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }

        });

    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => observer.observe(el));


    /* =====================================
       Navbar Blur on Scroll
    ====================================== */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    });


    /* =====================================
       Active Navigation Link
    ====================================== */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 150;

            if (window.scrollY >= top) {
                current = section.id;
            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }

        });

    });


    /* =====================================
       Counter Animation
    ====================================== */

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const update = () => {

            const target = +counter.dataset.target;
            const current = +counter.innerText;

            const increment = Math.ceil(target / 80);

            if (current < target) {

                counter.innerText = current + increment;

                setTimeout(update, 20);

            } else {

                counter.innerText = target;

            }

        };

        observer.observe(counter);

        counter.addEventListener("animationstart", update);

    });


    /* =====================================
       Theme Toggle
    ====================================== */

    const toggle = document.getElementById("themeToggle");

    if (toggle) {

        if (localStorage.getItem("theme") === "dark") {

            document.body.classList.add("dark");
            toggle.checked = true;

        }

        toggle.addEventListener("change", () => {

            document.body.classList.toggle("dark");

            localStorage.setItem(
                "theme",
                document.body.classList.contains("dark")
                    ? "dark"
                    : "light"
            );

        });

    }


    /* =====================================
       Smooth Scrolling
    ====================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function(e) {

            e.preventDefault();

            const target = document.querySelector(
                this.getAttribute("href")
            );

            if (target) {

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });


    /* =====================================
       Hero Floating Effect
    ====================================== */

    const phone = document.querySelector(".phone-mockup");

    if (phone) {

        let angle = 0;

        function floatPhone() {

            angle += 0.02;

            phone.style.transform =
                `translateY(${Math.sin(angle) * 8}px)`;

            requestAnimationFrame(floatPhone);

        }

        floatPhone();

    }


    /* =====================================
       Card Hover Tilt
    ====================================== */

    document.querySelectorAll(".feature-card").forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 12;
            const rotateX = ((y / rect.height) - 0.5) * -12;

            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
                "perspective(900px) rotateX(0) rotateY(0)";

        });

    });


    /* =====================================
       Button Ripple
    ====================================== */

    document.querySelectorAll(".btn").forEach(button => {

        button.addEventListener("click", function(e) {

            const ripple = document.createElement("span");

            ripple.classList.add("ripple");

            ripple.style.left = e.offsetX + "px";
            ripple.style.top = e.offsetY + "px";

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 700);

        });

    });

});