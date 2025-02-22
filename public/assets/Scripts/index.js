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
// SLIDER
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
// SLIDER
// IMPACTO SHOW
function aparecer() {

  var info = document.getElementById('box-info');
  var invisivel = document.getElementById('invisivel');
  var cor = document.getElementById('cor');
  var botao = document.getElementById('btn');
  var hr = document.getElementById('linha');

  if (invisivel.classList.contains('mostrar')) {
      // Esconder suavemente
      invisivel.style.opacity = "0";
      invisivel.style.transform = "translateY(-10px)";
      
      setTimeout(() => {
          invisivel.style.display = "none";
          info.style.backgroundColor = "#FFF";
          info.style.color = "#011F27";
          invisivel.classList.remove('mostrar');
      }, 500); // Tempo da transição
  } else {
      // Mostrar suavemente
      invisivel.style.display = "flex"; 
      
      // Pequeno delay para permitir a transição
      setTimeout(() => {
          invisivel.classList.add('mostrar');
          invisivel.style.opacity = "1";
          invisivel.style.transform = "translateY(0)";

          // Aplicando os estilos dentro do mesmo bloco
          invisivel.style.backgroundColor = "#011F27";
          cor.style.color = "#FFF";
          botao.style.color = "#FFF";
          botao.style.border = "#FFF 2px solid";
          hr.style.backgroundColor = "#FFF";
          info.style.backgroundColor = "#011F27";
          info.style.color = "#FFF";
      }, 10);
  }
}


