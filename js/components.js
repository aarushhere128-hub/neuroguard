/* ==========================================================
   NeuroGuard - components.js
   Reusable UI Components
   ========================================================== */

function initComponents() {

    console.log("🧩 Components Initialized");

    initAccordion();
    initTabs();
    initModal();
    initTooltips();
    initRippleButtons();
    initProgressBars();
    initToast();
    initCopyButtons();

}

/* ==========================================================
   ACCORDION
========================================================== */

function initAccordion() {

    const accordions = document.querySelectorAll(".accordion-item");

    accordions.forEach(item => {

        const header = item.querySelector(".accordion-header");

        if (!header) return;

        header.addEventListener("click", () => {

            item.classList.toggle("active");

        });

    });

}

/* ==========================================================
   TABS
========================================================== */

function initTabs() {

    const buttons = document.querySelectorAll("[data-tab]");
    const contents = document.querySelectorAll(".tab-content");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const target = button.dataset.tab;

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            contents.forEach(content =>
                content.classList.remove("active")
            );

            button.classList.add("active");

            const tab = document.getElementById(target);

            if(tab){
                tab.classList.add("active");
            }

        });

    });

}

/* ==========================================================
   MODAL
========================================================== */

function initModal() {

    const openButtons = document.querySelectorAll("[data-modal]");
    const closeButtons = document.querySelectorAll(".modal-close");

    openButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.modal;

            const modal = document.getElementById(id);

            if(modal){

                modal.classList.add("show");

                document.body.classList.add("modal-open");

            }

        });

    });

    closeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const modal = button.closest(".modal");

            if(modal){

                modal.classList.remove("show");

                document.body.classList.remove("modal-open");

            }

        });

    });

    document.querySelectorAll(".modal").forEach(modal=>{

        modal.addEventListener("click",e=>{

            if(e.target===modal){

                modal.classList.remove("show");

                document.body.classList.remove("modal-open");

            }

        });

    });

}

/* ==========================================================
   TOOLTIPS
========================================================== */

function initTooltips(){

    document.querySelectorAll("[data-tooltip]").forEach(element=>{

        element.setAttribute("title",element.dataset.tooltip);

    });

}

/* ==========================================================
   RIPPLE BUTTON EFFECT
========================================================== */

function initRippleButtons(){

    document.querySelectorAll(".btn").forEach(button=>{

        button.addEventListener("click",function(e){

            const ripple=document.createElement("span");

            ripple.className="ripple";

            ripple.style.left=e.offsetX+"px";
            ripple.style.top=e.offsetY+"px";

            this.appendChild(ripple);

            setTimeout(()=>{

                ripple.remove();

            },600);

        });

    });

}

/* ==========================================================
   PROGRESS BARS
========================================================== */

function initProgressBars(){

    document.querySelectorAll(".progress-fill").forEach(bar=>{

        const value=bar.dataset.progress||100;

        setTimeout(()=>{

            bar.style.width=value+"%";

        },300);

    });

}

/* ==========================================================
   TOAST NOTIFICATION
========================================================== */

function showToast(message,type="success"){

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },50);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },400);

    },3000);

}

function initToast(){

    document.querySelectorAll("[data-toast]").forEach(button=>{

        button.addEventListener("click",()=>{

            showToast(button.dataset.toast);

        });

    });

}

/* ==========================================================
   COPY BUTTON
========================================================== */

function initCopyButtons(){

    document.querySelectorAll("[data-copy]").forEach(button=>{

        button.addEventListener("click",()=>{

            navigator.clipboard.writeText(button.dataset.copy);

            showToast("Copied to clipboard!");

        });

    });

}

/* ==========================================================
   DROPDOWN
========================================================== */

document.querySelectorAll(".dropdown-toggle").forEach(toggle=>{

    toggle.addEventListener("click",()=>{

        toggle.parentElement.classList.toggle("active");

    });

});

/* ==========================================================
   AUTO CLOSE DROPDOWN
========================================================== */

document.addEventListener("click",(e)=>{

    document.querySelectorAll(".dropdown").forEach(drop=>{

        if(!drop.contains(e.target)){

            drop.classList.remove("active");

        }

    });

});

/* ==========================================================
   AUTO INIT (if app.js isn't used)
========================================================== */

if(typeof initializeApplication==="undefined"){

    document.addEventListener("DOMContentLoaded",()=>{

        initComponents();

    });

}