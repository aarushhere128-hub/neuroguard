const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

console.log(hamburger);
console.log(navMenu);

hamburger.addEventListener("click", () => {
    console.log("Hamburger clicked");

    navMenu.classList.toggle("show");

    console.log(navMenu.className);
});
