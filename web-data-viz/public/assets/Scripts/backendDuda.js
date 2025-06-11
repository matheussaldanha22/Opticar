var correlacaoRelatorio = [];
var kpiCorrelacao = [];
var kpiImpacto = [];
var kpiIncremento = [];
var componenteRelatorio = [];
var calRegressao = [];
const bobCorrelacao = document.querySelector(".bobCorrelacao");

bobCorrelacao.addEventListener("click", () => {
  Swal.fire({
    html: `
      <div class="modal-bob">
        <div class="containerBob">
          <h3>Relatório de Correlação</h3>
          <div style="margin: 20px 0;">
            <label><input type="radio" id="novo" name="opcao" value="novo" checked> Gerar novo</label><br>
            <label><input type="radio" id="antigo" name="opcao" value="antigo"> Baixar anterior</label>
          </div>
          <select id="select_relatorio" style="width: 100%; padding: 8px; margin-top: 10px;">
            <option value="">Selecione...</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Baixar",
    confirmButtonColor: "#2C3E50",
    background: "#fff",
    customClass: "addModal",
    didOpen: () => {
      visualizarHistorico();
    }
  }).then((result) => {
    if (result.isConfirmed) {
      if (document.getElementById('novo').checked) {
        bobCorrelacaoRelatorio();
      } else {
        var relatorioNome = document.getElementById('select_relatorio').value;
        if (relatorioNome) {
          baixarHistorico(relatorioNome);
        }
      }
    }
  });
});

function esconder() {
  var grafico = document.getElementById('graficoConsumoPix');
  var texto = document.getElementById('button-cor');

  if (grafico.style.display === 'flex') {
    grafico.style.display = 'none';
    texto.innerHTML = 'Mostrar Correlação';
    
  } else {
    grafico.style.display = 'flex';
    texto.innerHTML = 'Ocultar';
    grafico.scrollIntoView({ behavior: 'smooth' });
  
  }
}

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
      var mesAtual = d.getMonth()+1


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
      document.getElementById('semanaAlerta').innerHTML = `${maisAlerta}° semana`
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
      if (json.length == 0) {
        chart.updateOptions({
          series: 0,
        });

        Swal.fire({
          title: "Não Possui Alertas",
          icon: "warning",
          showClass: {
            popup: `
          animate__animated
         animate__fadeInUp
         animate__faster
        `
          }, hideClass: {
            popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
       `}
        });

      }
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
     var coresChart = ['#41C1E0', '#2C3E50', '#04708D', '#00BFA6', '#FF6F00'];


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
      const tabela = document.getElementById("tabela-alertas");
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
                
                    <td data-label = "Data">${processo.dataP}</td>
                    <td data-label = "Processo">${processo.processo}</td>
                    <td data-label = "Periodo">${processo.periodo}</td>
                   <td data-label = "prioriodade">${processo.prioridade}</td>
                   <td data-label = "quantidae">${processo.alerta}</td>
  
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

        chart.updateOptions({
          series: 0,
        });


        Swal.fire({
          title: "Não Possui Alertas",
          icon: "warning",
          showClass: {
            popup: `
          animate__animated
         animate__fadeInUp
         animate__faster
        `
          }, hideClass: {
            popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
       `}
        });

      } else {
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
      if (json.length == 0) {
        document.getElementById('DiaAlerta').innerHTML = "Sem Alertas"
        document.getElementById('qtdDiaAlerta').innerHTML = ""
      } else {
        document.getElementById('DiaAlerta').innerHTML = json[0].dia
        document.getElementById('qtdDiaAlerta').innerHTML = json[0].qtdalerta
      }

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

      if (json.length == 0) {
        document.getElementById('periodoAlerta').innerHTML = "Sem alertas"
        document.getElementById('qtdPeriodoAlerta').innerHTML = ""
      } else {
        document.getElementById('periodoAlerta').innerHTML = json[0].periodo
        document.getElementById('qtdPeriodoAlerta').innerHTML = json[0].total_alertas
      }

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

      if (json.length != 0) {
        document.getElementById('componente').innerHTML = json[0].componente
        document.getElementById('periodo').innerHTML = json[0].periodo
        document.getElementById('qtdAlertaComp').innerHTML = json[0].alerta
      } else {
        document.getElementById('componente').innerHTML = `Sem alertas`
        document.getElementById('periodo').innerHTML = ""
        document.getElementById('qtdAlertaComp').innerHTML = ""

      }

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

      if (semanaAlerta.length == 0) {
        document.getElementById('semanaAlerta').innerHTML = "Sem alertas"
        document.getElementById('qtdAlerta').innerHTML = ""
      } else {

        for (let i = 0; i < semanaAlerta.length; i++) {
          semanaAlerta[i].posicaoNoMes = i + 1;
          if (semanaAlerta[i].quantidadeAlertas > maior) {
            maior = semanaAlerta[i].quantidadeAlertas;
            maisAlerta = semanaAlerta[i].posicaoNoMes;
          }
        }
        console.log("exibir")
        document.getElementById('semanaAlerta').innerHTML = `${maisAlerta}° semana`
        document.getElementById('qtdAlerta').innerHTML = `${maior}`
      }

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
      } else {
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
      } else {
        document.getElementById('periodoAlerta').innerHTML = "Sem alertas"
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
      if (json.length == null) {

        chart.updateOptions({
          series: 0,
        });

        Swal.fire({
          title: "Não Possui Alertas no dia de Hoje",
          icon: "warning",
          showClass: {
            popup: `
          animate__animated
         animate__fadeInUp
         animate__faster
        `
          }, hideClass: {
            popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
       `}
        });
      } else {
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

function diaServerComp(dataAno, dataMes, dataDia) {
  const idFabrica = sessionStorage.FABRICA_ID;
  var idServidor = Number(slt_servidor.value)

  fetch(`/dashPeriodo/diaServerComp/${idFabrica}/${idServidor}/${dataAno}/${dataMes}/${dataDia}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => { //coloca .then pq é uma funcao precisa ()
      console.log(json)

      if (json.length != null) {
        document.getElementById('componente').innerHTML = json[0].componente
        document.getElementById('periodo').innerHTML = json[0].periodo
        document.getElementById('qtdAlertaComp').innerHTML = json[0].alerta
      } else {
        document.getElementById('componente').innerHTML = `Sem alertas`
        document.getElementById('periodo').innerHTML = ""
        document.getElementById('qtdAlertaComp').innerHTML = ""

      }

    })
  })
}

function diaServerPeriodo(dataAno, dataMes, dataDia) {
  const idFabrica = sessionStorage.FABRICA_ID;
  var idServidor = Number(slt_servidor.value)

  fetch(`/dashPeriodo/diaServerPeriodo/${idFabrica}/${idServidor}/${dataAno}/${dataMes}/${dataDia}`, {
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

function diaServerGrafico(dataAno, dataMes, dataDia) {
  var idServidor = Number(slt_servidor.value)
  console.log(idServidor)

  const idFabrica = sessionStorage.FABRICA_ID;
  fetch(`/dashPeriodo/diaServerGrafico/${idFabrica}/${idServidor}/${dataAno}/${dataMes}/${dataDia}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((resultado) => {
    resultado.json().then((json) => {
      if (json.length == 0) {
        chart.updateOptions({
          series: 0,
        });

        Swal.fire({
          title: "Não Possui Alertas",
          icon: "warning",
          showClass: {
            popup: `
          animate__animated
         animate__fadeInUp
         animate__faster
        `
          }, hideClass: {
            popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
       `}
        });
      }
      else {
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
      }
    })
  })
}

function diaServerProcesso(dataAno, dataMes, dataDia) {
  const idFabrica = sessionStorage.FABRICA_ID;
  var idServidor = Number(slt_servidor.value)

  fetch(`/dashPeriodo/diaServerProcesso/${idFabrica}/${idServidor}/${dataAno}/${dataMes}/${dataDia}`, {
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
  var idMes = document.getElementById("id_mes")
  var valoresMesAno = valorSelect.split("/")

  var ano = valoresMesAno[1]
  var mes = valoresMesAno[0]

  const nomeMeses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];


  console.log(ano)
  console.log(mes)

  var kpiSemana = document.getElementById("kpi_semana")
  var kpiDia = document.getElementById("kpi_dia")
  var cor = document.getElementById('div-pix')

  kpiSemana.style.display = 'flex';
  kpiDia.style.display = 'flex';
  cor.style.display = 'inline';
  if (sltServidor.value != "todos") {
    idMes.innerHTML = `do mês de ${nomeMeses[mes - 1]}`
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
    idMes.innerHTML = `do mês de ${nomeMeses[mes - 1]}`
    obterDia(ano, mes) //kpi dia 
    obterSemana(ano, mes) //kpi semana
    obterComponente(ano, mes) //kpi componente
    obterPeriodo(ano, mes) // kpi periodo
    tabelaProcesso(ano, mes) //tabela processos
    dadosGrafico(ano, mes)
    pegarS3(ano, mes)

  }
}

function atualizarDadosDia() {
  const data = new Date(inputData.value);
  var dataAno = data.getFullYear()
  var dataMes = data.getMonth() + 1;
  var dataDia = data.getDate() + 1;
  var idMes = document.getElementById("id_mes")
  var kpiSemana = document.getElementById("kpi_semana")
  var kpiDia = document.getElementById("kpi_dia")
  var cor = document.getElementById('div-pix')

  cor.style.display = 'none';

  kpiSemana.style.display = 'none';
  kpiDia.style.display = 'none';

  if (inputData.value != 0) {
    idMes.innerHTML = `do Dia ${dataDia}`
    console.log(dataAno)
    console.log(dataMes)
    console.log(dataDia)
    diaComp(dataAno, dataMes, dataDia)
    periodoDia(dataAno, dataMes, dataDia)
    diaGrafico(dataAno, dataMes, dataDia)
    diaProcesso(dataAno, dataMes, dataDia)
    if (sltServidor.value != "todos") {
      idMes.innerHTML = `do Dia ${dataDia}`
      diaServerComp(dataAno, dataMes, dataDia)
      diaServerPeriodo(dataAno, dataMes, dataDia)
      diaServerGrafico(dataAno, dataMes, dataDia)
      diaServerProcesso(dataAno, dataMes, dataDia)

    }
  }

}

sltServidor.addEventListener("change", atualizarDados);
slt_mes.addEventListener("change", atualizarDados)

async function pegarS3(ano, mes) {
  const bucket = await fetch(`http://${process.env.IP_INSTANCIA}:5000/aws/pegarS3/${ano}/${mes}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const jsonBucket = await bucket.json()
  console.log(jsonBucket)

  var dataPix = [];

  for (let i = 0; i < jsonBucket.length; i++) {
    const jsonAtual = jsonBucket[i];
    var dadoQtd = jsonAtual.quantidade

    dataPix.push(dadoQtd);
  }

  console.log(dataPix.sort((a, b) => a - b))

  const idFabrica = sessionStorage.FABRICA_ID;
  const dadosComponente = await fetch(`/dashPeriodo/dadosComponentes/${idFabrica}/${ano}/${mes}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const jsonComponente = await dadosComponente.json()

  console.log(jsonComponente)


  var dadosCpu = [];
  var dadosRam = [];
  var dadosDisco = [];
  var dadosRede = [];

  for (let i = 0; i < jsonComponente.length; i++) {
    var atual = jsonComponente[i];
    var componenteAtual = atual.componente
    const dadoValor = atual.valor

    if (componenteAtual.toLowerCase() == "cpu") {
      dadosCpu.push(dadoValor)
    }

    if (componenteAtual.toLowerCase() == "ram") {
      dadosRam.push(dadoValor)
    }

    if (componenteAtual.toLowerCase() == "disco") {
      dadosDisco.push(dadoValor)
    }

    if (componenteAtual.toLowerCase() == "rede") {
      dadosRede.push(dadoValor)
    }

  }
  plotarGraficoPix(dadosCpu, dadosRam, dadosDisco, dadosRede, dataPix)
}


const ctx = document.getElementById('chartPix');

const dadosDispersao = {
  datasets: [{
    label: 'Volume Pix x Uso de Componentes',
    data: { x: 0, y: 0 },
    backgroundColor: 'rgba(54, 162, 235, 0.6)',
    trendlineLinear: {
      style: "rgba(255,99,132,1)",
      lineStyle: "solid",
      width: 2
    }
  }]
};

var chartPix = new Chart(ctx, {
  type: 'scatter',
  data: dadosDispersao,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Volume do Pix'
        }
      },
      y: {
        title: {
          display: true,
          text: '% Uso dos Componentes'
        },
        min: 60,
        max: 100
      }
    }
  }

});

function plotarGraficoPix(dadosCpu, dadosRam, dadosDisco, dadosRede, dataPix) {

  correlacaoRelatorio = [];
  kpiCorrelacao = [];
  kpiImpacto = [];
  kpiIncremento = [];
  componenteRelatorio = [];
  calRegressao = [];

  var componente = document.getElementById('slt_componente').value

  var arrayUsado;

  if (componente == "cpu") {
    arrayUsado = dadosCpu;
  }
  else if (componente == "ram") {
    arrayUsado = dadosRam;
  } else if (componente == "disco") {
    arrayUsado = dadosDisco;
  } else {
    arrayUsado = dadosRede;
  }

  console.log(dataPix)

  var maior;
  var menor;

  if (dataPix.length > arrayUsado.length) {
    maior = dataPix
    menor = arrayUsado

    arrayUsado = menor.map((menor, i) => ({ x: maior[i], y: menor }))
    maior = maior.slice(0, menor.length)

  } else {
    menor = dataPix
    maior = arrayUsado

    arrayUsado = menor.map((menor, i) => ({ x: menor, y: maior[i] }))

    maior = maior.slice(0, menor.length)
  }

  correlacaoRelatorio = arrayUsado;
  if (chartPix) {
    chartPix.data.datasets[0].data = arrayUsado
    chartPix.update()
  }

  const dadosRegressao = arrayUsado.map(p => [p.x, p.y]);
  const regressao = ss.linearRegression(dadosRegressao);
  const correlacao = ss.sampleCorrelation(maior, menor);
  const incremento = 100000;
  const impacto = (regressao.m * incremento).toFixed(2);


  const txtKPICor = document.getElementById('correlacaoDado');
  txtKPICor.innerHTML = '';
  const valorCor = document.getElementById('valorCor');
  valorCor.innerHTML = '';
  const txtCor = document.getElementById('txtCor');
  txtCor.innerHTML = '';

  correlacaoRelatorio.push(arrayUsado);
  kpiCorrelacao.push(correlacao);
  kpiImpacto.push(impacto);
  kpiIncremento.push(incremento);
  componenteRelatorio.push(componente)
  calRegressao.push(regressao)

  if (correlacao > 0.7) {
    txtKPICor.innerHTML = `Correlação positiva forte entre Volume de PIX e consumo no SCADA. `;
    valorCor.innerHTML = `(R = ${correlacao.toFixed(2)})`
    txtCor.innerHTML = `A cada ${incremento.toLocaleString()} PIX a mais, os alertas podem aumentar em média ${impacto}`;
  } else if (correlacao < 0.3) {
    txtKPICor.innerHTML += `Correlação fraca (R = ${correlacao.toFixed(2)}): sem relação clara.`;
  } else {
    txtKPICor.innerHTML += `Correlação moderada (R = ${correlacao.toFixed(2)}) entre Volume de PIX e Alertas.`;
  }

};


slt_componente.addEventListener("change", atualizarDados)

var respostas;

async function bobCorrelacaoRelatorio() {
  document.getElementById('bobC').classList.add('loader');
  var agora = new Date();
  var ano = agora.getFullYear();
  var mes = String(agora.getMonth() + 1).padStart(2, '0');
  var dia = String(agora.getDate()).padStart(2, '0');
  var hora = String(agora.getHours()).padStart(2, '0');
  var minuto = String(agora.getMinutes()).padStart(2, '0');
  var tipo = `Correlação_${ano}-${mes}-${dia}_${hora}-${minuto}.pdf`;
  var pasta = "RelatorioCorrelação";
  try {
    var perguntas = `Você é analista de dados da empresa OptiCars, especializada em monitoramento de hardware SCADA em fábricas automotivas. Gere um relatório técnico e visual, com análise e recomendações, sobre o impacto do volume de transações via PIX no consumo do componente ${componenteRelatorio}. Use os dados da dashboard analítica para apoiar a tomada de decisão.
Seção 1 – Análise de Correlação e Cálculo de Impacto
Analise a relação entre o volume de PIX e o consumo do componente ${componenteRelatorio}, com base no cálculo de correlação entre essas variáveis. A regressão linear utilizada foi:
Fórmula: ${calRegressao}
Correlação obtida: ${kpiCorrelacao}
Explique o que essa correlação indica (positiva/negativa, forte/moderada/fraca), e se há padrão entre o consumo do componente e o volume de transações via PIX. Destaque também a simulação de impacto:
Variação simulada no PIX: ${kpiIncremento}
Impacto estimado no consumo do ${componenteRelatorio}: ${kpiImpacto}
A partir desses valores, interprete o comportamento do componente e avalie se há risco para os servidores monitorados.
Seção 2 – Análise Gráfica e Tendência
Com base no gráfico de regressão linear da dashboard, que relaciona consumo do ${componenteRelatorio} e volume de PIX ao longo do tempo, descreva:
A tendência observada (aumento, queda ou estabilidade)
Se o padrão identificado representa um cenário preocupante ou aceitável
Como esse padrão pode impactar o desempenho e a confiabilidade dos sistemas
Objetivo
Apresente as informações de forma clara, com destaque visual (cores, ícones, estrutura), interpretando os dados com base em evidências estatísticas. A análise deve ser acessível a gestores e técnicos, com recomendações práticas para suporte à decisão.`;

    const response = await fetch("http://localhost:5000/perguntar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        perguntaServer: perguntas,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.status);
    }
    respostas = await response.text();
    console.log(respostas);
    pdf(respostas, tipo, pasta);
  } catch (erro) {
    console.error(`Erro: ${erro}`);
    Swal.fire('Erro!', 'Erro ao tentar formular relatório', 'error')
  } finally {
    document.getElementById('bobC').classList.remove('loader');
  }
}

async function pdf(respostas, tipo, pasta) {
  try {
    const resposta = await fetch("http://localhost:5000/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        respostaBOB: respostas,
        nomeArquivo: tipo,
        pasta: pasta,
      }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao gerar PDF: " + resposta.status);
    }

    const blob = await resposta.blob();
    console.log(blob);
    relatorioClient(blob, tipo, pasta)

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${tipo}`;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (erro) {
    console.error("Erro ao baixar PDF:", erro);
    Swal.fire('Erro!', 'Erro ao baixar PDF', 'error')
  }
}

async function relatorioClient(blob, tipo, pasta) {
  const formData = new FormData();
  formData.append("relatorioCliente", blob, "relatorio.pdf")
  formData.append("tipo", tipo);
  formData.append("pasta", pasta);

  try {
    const resposta = await fetch("http://localhost:5000/aws/relatorioClient", {
      method: "POST",
      body: formData
    }); 

    if (!resposta.ok) {
      throw new Error("Erro ao enviar relatório para a aws" + resposta.status)
    }
  } catch (erro) {
    console.error("Erro ao enviar relatório:", erro);
    Swal.fire('Erro!', 'Erro ao enviar relatório', 'error')
  }
}

async function visualizarHistorico() {
  var pasta = "RelatorioCorrelação";
  try {
    const resposta = await fetch(`http://localhost:5000/aws/visualizarHistorico/${pasta}`, {
      method: "GET",
      headers: { "Content-Type": "application/json"}
    });

    if (!resposta.ok) {
      throw new Error("Erro ao visualizar histórico")
    }

    var dados = await resposta.json()

    const slt = document.getElementById('select_relatorio');
    dados.forEach((options) => {
      var option = document.createElement("option");
      option.value = options;
      option.textContent = options;
      slt.appendChild(option)
    })
    
    console.log("estou no visualizarHistorico")
    console.log(resposta)
  } catch (erro) {
    console.error(erro)
  }
}

async function baixarHistorico(relatorioNome) {
  var pasta = "RelatorioPredição";
  try {
    const resposta = await fetch(`http://localhost:5000/aws/baixarHistorico/${relatorioNome}/${pasta}`, {
      method: "GET",
      headers: {"Content-Type": "application/pdf"}
    });

    if (!resposta.ok) {
      throw new Error("Erro ao baixar histórico")
    }
    console.log("Estou no baixar histórico")
    console.log(resposta)

    const blob = await resposta.blob()

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${relatorioNome}`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (erro) {
    console.error(erro)
  }
}

