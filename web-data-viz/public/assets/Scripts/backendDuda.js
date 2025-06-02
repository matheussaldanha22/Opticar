//  document.addEventListener("DOMContentLoaded", function () {
//   const botao = document.getElementById('btnMostrarGrafico');

//   const grafico = document.getElementById('graficoConsumoCpuVendas');
//   //colocar função de plotar o grafico depois
//   //   const graficoCriado = false;

//   botao.addEventListener('click', function () {

//     if (grafico.style.display === 'none') {
//       grafico.style.display = 'block';

//       botao.innerHTML = 'Ocultar Gráfico';

//       grafico.scrollIntoView({ behavior: 'smooth' });

//       if (!graficoCriado) {
//         //colocar função de plotar o grafico depois
//         graficoCriado = true;
//       }
//     }
//     else {

//       grafico.style.display = 'none';
//       botao.innerHTML = '<i class="bx bx-line-chart"></i> Mostrar Correlação';
//     }
//   });
// });


// const switchModal = () => {
//   const modal = document.querySelector('.modal')
//   const actualStyle = modal.style.display
//   if (actualStyle == 'block') {
//     modal.style.display == 'none'
//   } else {
//     modal.style.display = 'block'
//   }
// }

// const button = document.querySelector('.iconeFiltro')
// button.addEventListener('click', switchModal)

// window.onclick = function (event) {
//   const modal = document.querySelector('.modal')
//   if (event.target == modal) {
//     switchModal()
//   }
// }

function listarServidores() {
  const servidores = JSON.parse(sessionStorage.SERVIDORES);
  for (let i = 0; i < servidores.length; i++) {
    const idServidor = servidores[i].idMaquina;
    document.getElementById('slt_servidor').innerHTML += `<option value="${idServidor}">SV${idServidor}</option>`

  }
}


function listarMes() {
  fetch('/alertas/listarMes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      alertaMes = json

      var d = new Date();
      var anoAtual = d.getFullYear()
      var mesAtual = d.getMonth()


      for (let i = 0; i < alertaMes.length; i++) {
        const mes = alertaMes[i].mes;
        const ano = alertaMes[i].ano;

        if (anoAtual == ano && mesAtual == mes) {
          document.getElementById('slt_mes').innerHTML += `<option selected value="${mesAtual}/${anoAtual}">Mês Atual</option>`
        } else {
          document.getElementById('slt_mes').innerHTML += `<option value="${mes}/${ano}"> ${mes}/${ano}</option>`
        }
      }
    })
  })
}


function obterSemana(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
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

  fetch(`/dashPeriodo/obterPeriodo/${idFabrica}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      document.getElementById('periodoAlerta').innerHTML = json[0].periodo
      document.getElementById('qtdPeriodoAlerta').innerHTML = json[0].total_alertas
    })
  })
}

function obterDia(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;

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

var chart;

function plotarGraficoPerido() {
  var options = {
    series: [],

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
      categories: [],
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
  chart = new ApexCharts(document.getElementById("chart"), options);
  chart.render()
}

function dadosGrafico(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  fetch(`/dashPeriodo/alertasPeriodo/${idFabrica}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {

      var cpu = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var ram = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var disco = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var rede = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      for (let i = 0; i < json.length; i++) {
        var alertaAtual = json[i]
        console.log(alertaAtual.periodo)
        var periodo = alertaAtual.periodo

        if (alertaAtual.componente.toLowerCase() == "cpu") {
          cpu[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "ram") {
          ram[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "disco") {
          disco[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "rede") {
          rede[periodo] += alertaAtual.qtdalertas
        }
      }

      var dataCpu = [];
      var dataRede = [];
      var dataRam = [];
      var dataDisco = [];
      var categoriesChart = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];


      for (let i = 0; i < categoriesChart.length; i++) {
        var periodo = categoriesChart[i];

        dataCpu.push(cpu[periodo]);
        dataRam.push(ram[periodo]);
        dataDisco.push(disco[periodo]);
        dataRede.push(rede[periodo]);
      }


      var seriesChart = [];
      var coresChart = ['#41C1E0', '#2C3E50', '#04708D', '#01232D', '#FF6F00'];

      seriesChart.push({
        name: "CPU",
        data: dataCpu
      }, {
        name: "RAM",
        data: dataRam
      },
        {
          name: "DISCO",
          data: dataDisco
        },
        {
          name: "REDE",
          data: dataRede
        })

      chart.updateOptions({
        series: seriesChart,
        xaxis: { categories: categoriesChart },
        colors: coresChart,
        markers: {
          size: 5,
          colors: coresChart,
          strokeColors: "#FFFFFF",
          strokeWidth: 2,
        }
      });
      console.log("estou em dataCPU" + dataCpu)
    })
  })
}

function tabelaProcesso(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;

  fetch(`/dashPeriodo/tabelaProcesso/${idFabrica}/${ano}/${mes}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      processos = json
      const tabela = document.querySelector(".componentesContainer table");
      tabela.innerHTML = `<thead>
                                <tr>
                                    <td>Data</td>
                                    <td>Processo</td>
                                    <td>Periodo</td>
                                    <td>Prioridade</td>
                                    <td>Quantidade</td>
                                </tr>
                           </thead>`
        ;
      processos.forEach(processo => {
        const linha = document.createElement("tr");
        linha.innerHTML = "";
        linha.innerHTML += `
                <tbody>
                    <td data-label = "Data">${processo.dataP}</td>
                    <td data-label = "Processo">${processo.processo}</td>
                    <td data-label = "Periodo">${processo.periodo}</td>
                   <td data-label = "prioriodade">${processo.prioridade}</td>
                   <td data-label = "quantidae">${processo.alerta}</td>
                </tbody>
            `;
        tabela.appendChild(linha);
      });
    })
  })

}

function selectServidor(ano, mes) {
  var idServidor = Number(slt_servidor.value)
  console.log(idServidor)

  const idFabrica = sessionStorage.FABRICA_ID;
  fetch(`/dashPeriodo/servidorDados/${idFabrica}/${idServidor}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
       if (json.length == 0) {
        Swal.fire({
        title: "Não Possui Alertas no dia de Hoje",
        icon: "warning",
        showClass: {
        popup: `
          animate__animated
         animate__fadeInUp
         animate__faster
        `
       },hideClass: {
        popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
       `}});
      }else{   var cpu = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var ram = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var disco = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var rede = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      for (let i = 0; i < json.length; i++) {
        var alertaAtual = json[i]
        console.log(alertaAtual.periodo)
        var periodo = alertaAtual.periodo

        if (alertaAtual.componente.toLowerCase() == "cpu") {
          cpu[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "ram") {
          ram[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "disco") {
          disco[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "rede") {
          rede[periodo] += alertaAtual.qtdalertas
        }
      }

      var dataCpu = [];
      var dataRede = [];
      var dataRam = [];
      var dataDisco = [];
      var categoriesChart = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];


      for (let i = 0; i < categoriesChart.length; i++) {
        var periodo = categoriesChart[i];

        dataCpu.push(cpu[periodo]);
        dataRam.push(ram[periodo]);
        dataDisco.push(disco[periodo]);
        dataRede.push(rede[periodo]);
      }


      var seriesChart = [];
      var coresChart = ['#41C1E0', '#2C3E50', '#04708D', '#01232D', '#FF6F00'];

      seriesChart.push({
        name: "CPU",
        data: dataCpu
      }, {
        name: "RAM",
        data: dataRam
      },
        {
          name: "DISCO",
          data: dataDisco
        },
        {
          name: "REDE",
          data: dataRede
        })

      chart.updateOptions({
        series: seriesChart,
        xaxis: { categories: categoriesChart },
        colors: coresChart,
        markers: {
          size: 5,
          colors: coresChart,
          strokeColors: "#FFFFFF",
          strokeWidth: 2,
        }
      });
    }
    })
  })
}


function tabelaServidor(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  var idServidor = Number(slt_servidor.value)
  fetch(`/dashPeriodo/tabelaServidor/${idFabrica}/${idServidor}/${ano}/${mes}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      processos = json
      const tabela = document.querySelector(".componentesContainer table");
      tabela.innerHTML = `<thead>
                                <tr>
                                    <td>Data</td>
                                    <td>Processo</td>
                                    <td>Periodo</td>
                                    <td>Prioridade</td>
                                    <td>Quantidade</td>
                                </tr>
                           </thead>`
        ;
      processos.forEach(processo => {
        const linha = document.createElement("tr");
        linha.innerHTML = "";
        linha.innerHTML += `
                <tbody>
                    <td data-label = "Data">${processo.dataP}</td>
                    <td data-label = "Processo">${processo.processo}</td>
                    <td data-label = "Periodo">${processo.periodo}</td>
                   <td data-label = "prioriodade">${processo.prioridade}</td>
                   <td data-label = "quantidae">${processo.alerta}</td>
                </tbody>
            `;
        tabela.appendChild(linha);
      });
    })
  })

}

function diaServidor(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  var idServidor = Number(slt_servidor.value)

  fetch(`/dashPeriodo/diaServidor/${idFabrica}/${idServidor}/${ano}/${mes}`, {
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


function periodoServer(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  var idServidor = Number(slt_servidor.value)

  fetch(`/dashPeriodo/periodoServer/${idFabrica}/${idServidor}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      document.getElementById('periodoAlerta').innerHTML = json[0].periodo
      document.getElementById('qtdPeriodoAlerta').innerHTML = json[0].total_alertas
    })
  })
}

function componenteServer(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  var idServidor = Number(slt_servidor.value)
  fetch(`/dashPeriodo/componenteServer/${idFabrica}/${idServidor}/${ano}/${mes}`, {
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


function semanaServer(ano, mes) {
  const idFabrica = sessionStorage.FABRICA_ID;
  var idServidor = Number(slt_servidor.value)

  fetch(`/dashPeriodo/semanaServer/${idFabrica}/${idServidor}/${ano}/${mes}`, {
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




function diaComp(dataAno, dataMes, dataDia) {
  const idFabrica = sessionStorage.FABRICA_ID;
  fetch(`/dashPeriodo/diaComp/${idFabrica}/${dataAno}/${dataMes}/${dataDia}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => { //coloca .then pq é uma funcao precisa ()
      console.log(json)

      if (json.length != 0) {
        document.getElementById('componente').innerHTML = json[0].componente
        document.getElementById('periodo').innerHTML = json[0].periodo
        document.getElementById('qtdAlertaComp').innerHTML = json[0].alerta
      }else{
        document.getElementById('componente').innerHTML = `Sem alertas`
         document.getElementById('periodo').innerHTML = ""
        document.getElementById('qtdAlertaComp').innerHTML = ""
       
      }
      
    })
  })
}

function periodoDia(dataAno, dataMes, dataDia) {
  const idFabrica = sessionStorage.FABRICA_ID;

  fetch(`/dashPeriodo/periodoDia/${idFabrica}/${dataAno}/${dataMes}/${dataDia}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {

      if (json.length != 0) {
        document.getElementById('periodoAlerta').innerHTML = json[0].periodo
        document.getElementById('qtdPeriodoAlerta').innerHTML = json[0].total_alertas
      }else{
        document.getElementById('periodoAlerta').innerHTML = `Sem alertas`
       document.getElementById('qtdPeriodoAlerta').innerHTML = ``
      }
      
    })
  })
}

function diaGrafico(dataAno, dataMes, dataDia) {

  const idFabrica = sessionStorage.FABRICA_ID;
  fetch(`/dashPeriodo/diaGrafico/${idFabrica}/${dataAno}/${dataMes}/${dataDia}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {

      if (json.length == 0) {
        Swal.fire({
        title: "Não Possui Alertas no dia de Hoje",
        icon: "warning",
        showClass: {
        popup: `
          animate__animated
         animate__fadeInUp
         animate__faster
        `
       },hideClass: {
        popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
       `}});
      }else{   var cpu = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var ram = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var disco = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      var rede = {
        "Manhã": 0,
        "Tarde": 0,
        "Noite": 0,
        "Madrugada": 0
      }

      for (let i = 0; i < json.length; i++) {
        var alertaAtual = json[i]
        console.log(alertaAtual.periodo)
        var periodo = alertaAtual.periodo

        if (alertaAtual.componente.toLowerCase() == "cpu") {
          cpu[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "ram") {
          ram[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "disco") {
          disco[periodo] += alertaAtual.qtdalertas
        }

        if (alertaAtual.componente.toLowerCase() == "rede") {
          rede[periodo] += alertaAtual.qtdalertas
        }
      }

      var dataCpu = [];
      var dataRede = [];
      var dataRam = [];
      var dataDisco = [];
      var categoriesChart = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];


      for (let i = 0; i < categoriesChart.length; i++) {
        var periodo = categoriesChart[i];

        dataCpu.push(cpu[periodo]);
        dataRam.push(ram[periodo]);
        dataDisco.push(disco[periodo]);
        dataRede.push(rede[periodo]);
      }


      var seriesChart = [];
      var coresChart = ['#41C1E0', '#2C3E50', '#04708D', '#01232D', '#FF6F00'];

      seriesChart.push({
        name: "CPU",
        data: dataCpu
      }, {
        name: "RAM",
        data: dataRam
      },
        {
          name: "DISCO",
          data: dataDisco
        },
        {
          name: "REDE",
          data: dataRede
        })

      chart.updateOptions({
        series: seriesChart,
        xaxis: { categories: categoriesChart },
        colors: coresChart,
        markers: {
          size: 5,
          colors: coresChart,
          strokeColors: "#FFFFFF",
          strokeWidth: 2,
        }
      });
    }
    })
  })
}

function diaProcesso(dataAno, dataMes, dataDia) {
  const idFabrica = sessionStorage.FABRICA_ID;

  fetch(`/dashPeriodo/diaProcesso/${idFabrica}/${dataAno}/${dataMes}/${dataDia}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      processos = json
      const tabela = document.querySelector(".componentesContainer table");
      tabela.innerHTML = `<thead>
                                <tr>
                                    <td>Processo</td>
                                    <td>Periodo</td>
                                    <td>Prioridade</td>
                                    <td>Quantidade</td>
                                </tr>
                           </thead>`
        ;
      processos.forEach(processo => {
        const linha = document.createElement("tr");
        linha.innerHTML = "";
        linha.innerHTML += `
                <tbody>
                    <td data-label = "Processo">${processo.processo}</td>
                    <td data-label = "Periodo">${processo.periodo}</td>
                   <td data-label = "prioriodade">${processo.prioridade}</td>
                   <td data-label = "quantidae">${processo.alerta}</td>
                </tbody>
            `;
        tabela.appendChild(linha);
      });
    })
  })

}

var sltServidor = document.getElementById("slt_servidor");
var slt_Mes = document.getElementById("slt_mes")
var inputData = document.getElementById("ipt_data");


function atualizarDados() {
  var sltServidor = document.getElementById("slt_servidor");
  var valorSelect = document.getElementById('slt_mes').value
  var valoresMesAno = valorSelect.split("/")

  var ano = valoresMesAno[1]
  var mes = valoresMesAno[0]

  console.log(ano)
  console.log(mes)


  if (sltServidor.value != "todos") {
    selectServidor(ano, mes) //gerar grafico de servidor especifico
    tabelaServidor(ano, mes) //tabela de processo de um servidor
    diaServidor(ano, mes) //kpi do servidor especifico com dia com mais alerta
    periodoServer(ano, mes) //kpi do servidor especifico com periodo com mais alerta
    componenteServer(ano, mes) //kpi do servidor especifico com componente com mais alerta
    semanaServer(ano, mes) //kpi do servidor especifico com semana com mais alerta
    console.log("azul")

  } else {
    //grafico de todos os servidores
    console.log("rosa")
    obterDia(ano, mes) //kpi dia 
    obterSemana(ano, mes) //kpi semana
    obterComponente(ano, mes) //kpi componente
    obterPeriodo(ano, mes) // kpi periodo
    tabelaProcesso(ano, mes) //tabela processos
    dadosGrafico(ano, mes)
  }
}

function atualizarDadosDia() {
  const data = new Date(inputData.value);
  var dataAno = data.getFullYear()
  var dataMes = data.getMonth() + 1;
  var dataDia = data.getDate()

  if (inputData.value != 0) {
    console.log(dataAno)
    console.log(dataMes)
    console.log(dataDia)
    diaComp(dataAno, dataMes, dataDia)
    periodoDia(dataAno, dataMes, dataDia)
    diaGrafico(dataAno, dataMes, dataDia)
    diaProcesso(dataAno, dataMes, dataDia)
      if (sltServidor.value != "todos") {
        //servidor em especifico

        
      }
  }

}

sltServidor.addEventListener("change", atualizarDados);
slt_mes.addEventListener("change", atualizarDados)

function pegarS3() {
  fetch(`http://localhost:80/aws/pegarS3`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado)=>{
    resultado.json().then((json)=>{
       console.log(json)                       
    })
  })
}


