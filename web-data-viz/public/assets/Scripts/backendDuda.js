
document.addEventListener("DOMContentLoaded", function() {
  const botao = document.getElementById('btnMostrarGrafico');

  const grafico = document.getElementById('graficoConsumoCpuVendas');
  //colocar função de plotar o grafico depois
//   const graficoCriado = false;
  
  botao.addEventListener('click', function() {
    
    if (grafico.style.display === 'none') {
      grafico.style.display = 'block';
      
      botao.innerHTML = 'Ocultar Gráfico';
    
      grafico.scrollIntoView({ behavior: 'smooth' });
      
      if (!graficoCriado) {
        //colocar função de plotar o grafico depois
        graficoCriado = true;
      }
    } 
    else {

      grafico.style.display = 'none';
        botao.innerHTML = '<i class="bx bx-line-chart"></i> Mostrar Correlação';
    }
  });
});


const switchModal = () => {
    const modal = document.querySelector('.modal')
    const actualStyle = modal.style.display
    if(actualStyle == 'block'){
        modal.style.display == 'none'
    }else{
        modal.style.display = 'block'
    }
}

const button = document.querySelector('.iconeFiltro')
button.addEventListener('click', switchModal)

window.onclick = function(event){
    const modal = document.querySelector('.modal')
    if(event.target == modal){
        switchModal()
    }
}




function listarServidores() {
    const servidores = JSON.parse(sessionStorage.SERVIDORES); 
    for (let i = 0; i < servidores.length; i++) {
        const idServidor = servidores[i].idMaquina;
        
        document.getElementById('slt_servidor').innerHTML += `<option value="${idServidor}">SV${idServidor}</option>`
                            
    }
}
listarServidores()


function listarMes(){
    fetch('/alertas/listarMes', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
    }).then((resultado) => {
       resultado.json().then((json) =>{
        alertaMes = json

        for (let i = 0; i < alertaMes.length; i++) {
            const mes = alertaMes[i].mes;
            const ano = alertaMes[i].ano;

            document.getElementById('slt_mes').innerHTML += `<option value="${mes}/${ano}"> ${mes}/${ano}</option>`
            
        }
       })
    })
}

listarMes()

function obterSemana(ano,mes) {
  console.log("to aqui")
  const idFabrica = sessionStorage.FABRICA_ID;
  const d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;

    fetch(`/dashPeriodo/obterSemana/${idFabrica}/${ano}/${mes}`,{
      
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        },
    }).then((resultado)=>{
      console.log("to no fetch")
      resultado.json().then((json)=>{
        semanaAlerta = json
        let maior = 0
        let maisAlerta = null;

        for (let i = 0; i < semanaAlerta.length; i++) {
          semanaAlerta[i].posicaoNoMes = i + 1;
          if (semanaAlerta[i].quantidadeAlertas > maior) {
            maior = semanaAlerta[i].quantidadeAlertas;
            maisAlerta = semanaAlerta[i].posicaoNoMes;
          }

          
          
        }
        console.log("exibir")
        document.getElementById('semanaAlerta').innerHTML = `${maisAlerta}`
        document.getElementById('qtdAlerta').innerHTML = `${maior}`

      })
    })


}

function obterComponente(ano,mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  const d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;

  fetch(`/dashPeriodo/obterComponente/${idFabrica}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
  }).then((resultado)=>{
    resultado.json().then((json)=>{ //coloca .then pq é uma funcao precisa ()
      console.log(json)

      
      document.getElementById('componente').innerHTML = json[0].componente
      document.getElementById('periodo').innerHTML = json[0].periodo
      document.getElementById('qtdAlertaComp').innerHTML = json[0].alerta
    })
  })
}

obterComponente()
obterSemana()

