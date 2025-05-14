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
function aparecer(element) {

  var info = element;
  var invisivel = element.querySelector('#invisivel');
  var cor = invisivel.querySelector('b');
  var botao = cor.querySelector('#btn');
  console.log(cor)
  var hr = invisivel.querySelector('hr');

  if (invisivel.classList.contains('mostrar')) {
      // Esconder suavemente
      invisivel.style.opacity = "0";
      invisivel.style.transform = "translateY(-10px)";
      element.classList.remove('expandir_desktop')

      // setTimeout(() => {
          invisivel.style.display = "none";
          info.style.backgroundColor = "#FFF";
          info.style.color = "#011F27";
          invisivel.classList.remove('mostrar');
      // }, 500); // Tempo da transição
  } else {
      // Mostrar suavemente
      invisivel.style.display = "flex"; 
      element.classList.add('expandir_desktop')
      // Pequeno delay para permitir a transição
      // setTimeout(() => {
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
        const elementos = document.querySelectorAll('.boxes-infos')
        console.log(elementos)
        elementos.forEach((box)=> {
            if(box != element){
              // info = box;
              if(box.classList.contains('expandir_desktop')){
                console.log('asss')
                aparecer(box)
              }
            }
        })
      // }, 10);
  }
}

function descerParaSegmento(){
  const ele = document.getElementById('segmento');   
  window.scrollTo(ele.offsetLeft,ele.offsetTop);
}

function descerParaContato(){
  const ele = document.getElementById('contato');   
  window.scrollTo(ele.offsetLeft,ele.offsetTop);
}

function descerParaSimular(){
  const ele = document.getElementById('simular');   
  window.scrollTo(ele.offsetLeft,ele.offsetTop);
}


const elementosNow = document.querySelectorAll('.boxes-infos')[0]

aparecer(elementosNow)
