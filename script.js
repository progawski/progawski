/* Get the time stamp */
let timeBeforeLoad = Date.now();

/* Scroll top before page refresh */
window.onbeforeunload = () => {  
    window.scrollTo(0, 0);  
};

/* Assign constant variables */

const body = document.querySelector("body");
const loadContainer = document.querySelector("#load-container");
const spinner = document.querySelector("#spinner");
const spinnerCircle = document.querySelectorAll(".spinner-circle");
const headerLogo = document.querySelector("#header-logo");
const menuContainer = document.querySelector("#menu-container");
const photo = document.querySelector("#photo");
const titleContainer = document.querySelector(".title-container");
const sections = document.querySelectorAll(".section");
const menuItem = document.querySelectorAll(".menu-item");
const chevronBorder = document.querySelector("#chevron-border");
const copyrightDate = document.querySelector("#copyright-date");
const menuToggleBtn = document.querySelector("#menu-toggle-btn");
const menuToggleIcon = document.querySelector("#menu-toggle-btn img");
const mediaQueryAnim = window.matchMedia('(min-width: 768px)');

copyrightDate.textContent = new Date().getFullYear();

/* Stop the animation */
const stopAnimation = (el) => {
    el.forEach(val => {
        val.style.animationPlayState = "paused"; 
    });
}

/* Slide down the section when in the viewport*/
const slideDown = () => {   
    for(let i = 1; i < sections.length; i++){
        if(sections[i].getBoundingClientRect().top + 200 <= document.documentElement.clientHeight){
            sections[i].classList.add("slide-down");
        }
    }
}

/* Autoscroll to the desired section */
const autoScroll = (e) => {
    let dataLink = e.target.getAttribute('data-link');
    document.querySelector('#' + dataLink).scrollIntoView({behavior: "smooth"});
}

/* Enable animations on bigger resolutions */
const enableAnimations = (e) => {
    if(e.matches){
        loadContainer.style.display = "flex";
        let timeOnLoad = Date.now();

        /* Ensure that animation will last at least 500ms */
        if(timeOnLoad-timeBeforeLoad < 500){
            setTimeout(() => {
                $('.spinner-circle').fadeOut(500, function(){
                    stopAnimation(spinnerCircle);
                    spinner.classList.add("zoom-in-out");
                });
            }, 500-(timeOnLoad-timeBeforeLoad));
        } else{
            $('.spinner-circle').fadeOut(500, function(){
                stopAnimation(spinnerCircle);
                spinner.classList.add("zoom-in-out");
            });
        }
    }
    else{
        body.style.overflowY = "auto";
        titleContainer.classList.remove("slide-left-50");
    }
}

window.onload = () => {
    enableAnimations(mediaQueryAnim);
};


/* Animations chain */

spinner.addEventListener("animationend", () =>{
    document.querySelector("#load-container").remove();
    headerLogo.classList.add("zoom-in");
});

headerLogo.addEventListener("animationend", () =>{
    menuContainer.classList.add("slide-right");
});

menuContainer.addEventListener("animationend", () =>{
    chevronBorder.classList.add("slide-right-border");
    photo.classList.add("slide-right-50");
    titleContainer.classList.add("slide-left-50");
});

photo.addEventListener("animationend", () =>{
    sections[0].classList.add("slide-down");
    body.style.overflowY = "auto";
    document.addEventListener('scroll', slideDown);
});

/* Change toggle icon on click */
menuToggleBtn.addEventListener("click", () =>{
    menuToggleIcon.classList.toggle("rotate-icon");
    menuContainer.classList.toggle("show-menu");
});


menuItem.forEach(item => item.addEventListener('click', autoScroll));
menuItem.forEach(item => item.addEventListener('click', () => {
    menuContainer.classList.remove("show-menu");
}));

mediaQueryAnim.addEventListener('change', enableAnimations);

