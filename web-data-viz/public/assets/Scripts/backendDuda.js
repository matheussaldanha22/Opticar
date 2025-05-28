
document.addEventListener("DOMContentLoaded", function () {
  const botao = document.getElementById('btnMostrarGrafico');

  const grafico = document.getElementById('graficoConsumoCpuVendas');
  //colocar função de plotar o grafico depois
  //   const graficoCriado = false;

  botao.addEventListener('click', function () {

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
  if (actualStyle == 'block') {
    modal.style.display == 'none'
  } else {
    modal.style.display = 'block'
  }
}

const button = document.querySelector('.iconeFiltro')
button.addEventListener('click', switchModal)

window.onclick = function (event) {
  const modal = document.querySelector('.modal')
  if (event.target == modal) {
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


function listarMes() {
  fetch('/alertas/listarMes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
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

function obterSemana(ano, mes) {
  console.log("to aqui")
  const idFabrica = sessionStorage.FABRICA_ID;
  const d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;

  fetch(`/dashPeriodo/obterSemana/${idFabrica}/${ano}/${mes}`, {

    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    console.log("to no fetch")
    resultado.json().then((json) => {
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

function obterComponente(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  const d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;

  fetch(`/dashPeriodo/obterComponente/${idFabrica}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => { //coloca .then pq é uma funcao precisa ()
      console.log(json)


      document.getElementById('componente').innerHTML = json[0].componente
      document.getElementById('periodo').innerHTML = json[0].periodo
      document.getElementById('qtdAlertaComp').innerHTML = json[0].alerta
    })
  })
}

function obterPeriodo(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  const d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;

  fetch(`/dashPeriodo/obterPeriodo/${idFabrica}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      console.log("ESTOU NO OBTER PERIODOOOOOOOOOOOOOOO PORRA" + json)
      document.getElementById('periodoAlerta').innerHTML = json[0].periodo
      document.getElementById('qtdPeriodoAlerta').innerHTML = json[0].total_alertas
    })
  })
}

function obterDia(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  const d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;

  console.log(idFabrica)
  console.log(ano)
  console.log(mes)



  fetch(`/dashPeriodo/obterDia/${idFabrica}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {

      document.getElementById('DiaAlerta').innerHTML = json[0].dia
      document.getElementById('qtdDiaAlerta').innerHTML = json[0].qtdalerta
    })
  }
  )

}
obterComponente()
obterSemana()
obterPeriodo()
obterDia()

function graficoPeriodo() {

}

graficoPeriodo()

var bomba;

function dadosGrafico(ano, mes) {
  const idFabrica = 1;
  const d = new Date();
  var ano = d.getFullYear();
  var mes = d.getMonth() + 1;


  fetch(`/dashPeriodo/alertasPeriodo/${idFabrica}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      // console.log(json)
      var cpu = []
      var ram = []
      var disco = []
      var rede = []

      // console.log(cpu)
      // // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      // console.log(ram)

    

      for (let i = 0; i < json.length; i++) {
        var alertaAtual = json[i]
        console.log(alertaAtual.periodo)
        var periodo = alertaAtual.periodo

        if (alertaAtual.componente.toLowerCase() == "cpu") {
            cpu.push({ [periodo]: alertaAtual.qtdalertas })
          }
          

        if (alertaAtual.componente.toLowerCase() == "ram") {
            ram.push({ [periodo]: alertaAtual.qtdalertas })
        }

        if (alertaAtual.componente.toLowerCase() == "disco") {
            disco.push({ [periodo]: alertaAtual.qtdalertas })
        }

        if (alertaAtual.componente.toLowerCase() == "rede") {
            rede.push({ [periodo]: alertaAtual.qtdalertas })
        }
      }

      var dataCpu = [];
      var dataRede = [];
      var dataRam = [];
      var dataDisco = [];

      cpu.forEach(item => {
        if (item["Manhã"]) {
          dataCpu.push(item["Manhã"]);
        } else if (item["Tarde"]) {
          dataCpu.push(item["Tarde"]);
        } else if (item["Noite"]) {
          dataCpu.push(item["Noite"]);
        } else if (item["Madrugada"]) {
          dataCpu.push(item["Madrugada"]);
        }
      });

        ram.forEach(item => {
        if (item["Manhã"]) {
          dataRam.push(item["Manhã"]);
        } else if (item["Tarde"]) {
          dataRam.push(item["Tarde"]);
        } else if (item["Noite"]) {
          dataRam.push(item["Noite"]);
        } else if (item["Madrugada"]) {
          dataRam.push(item["Madrugada"]);
        }
      });

      
      rede.forEach(item => {
        if (item["Manhã"]) {
          dataRede.push(item["Manhã"]);
        } else if (item["Tarde"]) {
          dataRede.push(item["Tarde"]);
        } else if (item["Noite"]) {
          dataRede.push(item["Noite"]);
        } else if (item["Madrugada"]) {
          dataRede.push(item["Madrugada"]);
        }
      });
      
        disco.forEach(item => {
        if (item["Manhã"]) {
          dataDisco.push(item["Manhã"]);
        } else if (item["Tarde"]) {
          dataDisco.push(item["Tarde"]);
        } else if (item["Noite"]) {
          dataDisco.push(item["Noite"]);
        } else if (item["Madrugada"]) {
          dataDisco.push(item["Madrugada"]);
        }
      });

      plotarGraficoPerido(dataCpu,dataRam, dataDisco, dataRede)

      console.log("estou em dataCPU" + dataCpu)
   })
  })
}

dadosGrafico()
function plotarGraficoPerido(dataCpu, dataRam, dataDisco, dataRede) {
  var options = {
        series: [{
          name: 'CPU',
          data: dataCpu
        }, {
          name: 'RAM',
          data: dataRam
        },
        {
          name: 'Disco',
          data: dataDisco
        },
        {
          name: 'Rede',
          data: dataRede
        }],

        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%',
            borderRadius: 5,
            borderRadiusApplication: 'end',


          },
        },
        dataLabels: {
          enabled: false,

        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Manhã', 'Tarde', 'Noite', 'Madrugada'],
        },
        yaxis: {
          title: {
            text: 'Quantidade Alerta'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands"
            }
          }
        }
      };

      var chart = new ApexCharts(document.getElementById("chart"), options);

      chart.render()

}