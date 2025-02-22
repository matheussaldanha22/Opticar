const menu = document.querySelector('.nav-links');
const burger= document.querySelector('.nav-burger');
const linha1 = document.querySelector('#linha1');
const linha2 = document.querySelector('#linha2');
const linha3 = document.querySelector('#linha3');
burger.addEventListener('click' ,()=>
{

linha1.classList.toggle('linha1-active');
linha2.classList.toggle('linha2-active');
linha3.classList.toggle('linha3-active');
menu.classList.toggle('nav-active');

});

// NAV_BURGER

var swiper = new Swiper(".swiper", {
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
    breakpoints: {

        640: {
          slidesPerView: 1,
          spaceBetween: 18
        },

        768: {
          slidesPerView: 2,
          spaceBetween: 18
        },

        1188: {
          slidesPerView: 3,
          spaceBetween: 24
        }
    }
  });