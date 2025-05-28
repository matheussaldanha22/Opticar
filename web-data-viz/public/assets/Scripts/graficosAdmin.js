// const fabricasG = Array.from({ length: 10 }, (_, i) => `Fábrica ${i + 1}`);
// const larguraGrafico = Math.max(fabricasG.length * 105, 400);

//GRÁFICO ALERTAS
var dadosFabricasGrave = [];

function plotarGraficoAlerta(dadosAlerta) {
  fetch("/admin/dadosFabrica", {
    method: "GET",
  })
  .then(function (resposta) {
    if (!resposta.ok) {
      throw new Error(`Erro na resposta: ${resposta.status}`);
    }
    return resposta.json();
  })
  .then(function (dadosFabrica) {

    const idFabrica = [];
    const fabricasG = [];
    const alertasEmAberto = [];
    const alertasEmAndamento = [];

    for (let i = 0; i < dadosFabrica.length; i++) {
      const fabrica = dadosFabrica[i];
      alertasEmAberto.push(0);     
      alertasEmAndamento.push(0);   
      for (let j = 0; j < dadosAlerta.length; j++) {
        const alerta = dadosAlerta[j];
        if (alerta.fkFabrica === fabrica.idFabrica) {
          var quantidade = alerta.qtd_to_do + alerta.qtd_in_progress;
          if (quantidade > dadosFabrica.limiteAtencao) {
            dadosFabricasGrave.push(dadosFabrica[i])
          }
          fabricasG.push(fabrica.nomeFabrica);
          idFabrica.push(fabrica.idFabrica)
          alertasEmAberto[i] = alerta.qtd_to_do;
          alertasEmAndamento[i] = alerta.qtd_in_progress;
        }
      }
    }

    var qtdFabricasCriticas = document.querySelector("#qtdFabricasCriticas");
    qtdFabricasCriticas.innerHTML = `${fabricasG.length}`
    const larguraGrafico = Math.max(fabricasG.length * 300, 400);

    var optionsBar = {
      chart: {
        height: 550,
        width: larguraGrafico,
        type: "bar",
        toolbar: { show: true },
        zoom: { enabled: true },
        stacked: true,
        events: {
          dataPointSelection: function(event, chartContext, config) {
            const serieNome = optionsBar.series[config.seriesIndex].name;
            const fabricaNome = optionsBar.xaxis.categories[config.dataPointIndex];
            const valorAberto = optionsBar.series[0].data[config.dataPointIndex];
            const valorAndamento = optionsBar.series[1].data[config.dataPointIndex];
            informacaoFabrica(fabricaNome, serieNome, valorAberto, valorAndamento, );
          }
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          horizontal: false,
        },
      },
      series: [
        {
          name: "Alertas em Aberto",
          data: alertasEmAberto,
          color: "#22B4D1",
        },
        {
          name: "Alertas em Andamento",
          data: alertasEmAndamento,
          color: "#04708D",
        },
      ],
      xaxis: {
        categories: fabricasG,
      },
      fill: {
        opacity: 1,
      },
    };

    var chartBar = new ApexCharts(
      document.querySelector("#graficoAlertaFabricas"),
      optionsBar
    );

    chartBar.render();
  })
  .catch(function (erro) {
    console.error(`#ERRO: ${erro}`);
  });
}

const bg = document.querySelector(".bg")
const modalPredicao = document.querySelector(".modalPredicao");
const cliqueAqui = document.querySelector("#cliqueAqui");
const fechar = document.querySelector('.fechar');
const ancoraFabrica = document.querySelector('#fabricas')

ancoraFabrica.addEventListener("click", () => {
  window.location.href = "./fabricas.html";
})

cliqueAqui.addEventListener("click", () => {
  modalPredicao.classList.add("ativo");
  bg.classList.add("ativoBg")
});

fechar.addEventListener("click", () => {
  modalPredicao.classList.remove("ativo");
  bg.classList.remove("ativoBg")
});

const fabricasPorPagina = 12;
var paginaAtual = 1;
var fabricas = [];
var contadorSelecionado = 0;

function mostrarFabricas() {
    fetch("/admin/dadosFabricaModal", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
        if (resposta.ok) {
           return resposta.json()
        }
        throw new Error("Não foi possivél pegar os dados")
    }).then(dadosFabrica => {
      return fetch("/admin/dadosGraficoAlerta", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      }).then(resposta => {
        if (resposta.ok) {
          return resposta.json()
        }
        throw new Error("Não foi possível pegar os alertas")
      }).then(dadosAlerta => {
        fabricas.length = 0;
        for(i = 0; i < dadosAlerta.length; i ++) {
          for(j = 0; j < dadosFabrica.length; j++) {
            if (dadosFabrica[j].idFabrica == dadosAlerta[i].fkFabrica) {
              var totalAlertasAgora = dadosAlerta[i].qtd_to_do + dadosAlerta[i].qtd_in_progress;
              var isCritica = false;
              if (dadosFabrica[j].limiteAtencao <= totalAlertasAgora) {
                isCritica = true;
              }
              fabricas.push({
                id: dadosFabrica[j].idFabrica,
                nome: dadosFabrica[j].nomeFabrica,
                critica: isCritica
              })
            }
          }
        }
        renderizarGrade()
      })
    })
    .catch(function (error) {
        console.error("Erro ao realizar fetch:", error);
    });
}


function renderizarGrade() {
    const grade = document.getElementById("grade-fabricas");
    grade.innerHTML = "";

    const inicio = (paginaAtual - 1) * fabricasPorPagina;
    const fim = inicio + fabricasPorPagina;

    for (let i = inicio; i < fim && i < fabricas.length; i++) {
        const fabrica = fabricas[i];

        const divFabrica = document.createElement("div");
        divFabrica.className = "fabrica";
        divFabrica.dataset.id = fabrica.id
        divFabrica.dataset.nome = fabrica.nome;

        if (fabrica.critica) {
            divFabrica.classList.add("fabrica-critica");
        }
        
        const divNome = document.createElement("div");
        divNome.className = "nome-fabrica";
        divNome.textContent = fabrica.nome;
        divFabrica.appendChild(divNome);

        const divId = document.createElement("div");
        divId.className = "id-fabrica";
        divId.textContent = "ID: " + fabrica.id;
        divFabrica.appendChild(divId);

        divFabrica.addEventListener("click", function () {
            if (divFabrica.classList.contains("div-selecionada")) {
                divFabrica.classList.remove("div-selecionada");
                contadorSelecionado--;
            } else if (contadorSelecionado < 5) {
                var idFabrica = divFabrica.getAttribute("data-id")
                var nomeFabrica = divFabrica.getAttribute("data-nome")
                dadoFabricaSelecionada(idFabrica, nomeFabrica)
                divFabrica.classList.add("div-selecionada");
                contadorSelecionado++;
            } else {
                Swal.fire('Erro!', 'Por favor, selecione somente 5 fábricas.', 'error');
            }
        });

        grade.appendChild(divFabrica);
    }
    criarBotoesPaginacao();
}

function criarBotoesPaginacao() {
  const paginacao = document.getElementById("paginacao");
  
  paginacao.innerHTML = "";
  
  const totalPaginas = Math.ceil(fabricas.length / fabricasPorPagina);
  
  const btnAnterior = document.createElement("button");
  btnAnterior.className = "botao-pagina";
  btnAnterior.textContent = "Anterior";
  btnAnterior.disabled = paginaAtual === 1; 
  btnAnterior.addEventListener("click", function() {
    paginaAtual = paginaAtual - 1;
    // mostrarFabricas();
    criarBotoesPaginacao();
  });
  paginacao.appendChild(btnAnterior);
  
  const textoInfo = document.createElement("span");
  textoInfo.style.margin = "0 10px";
  textoInfo.textContent = "Página " + paginaAtual + " de " + totalPaginas;
  paginacao.appendChild(textoInfo);
  
  const btnProximo = document.createElement("button");
  btnProximo.className = "botao-pagina";
  btnProximo.textContent = "Próximo";
  btnProximo.disabled = paginaAtual === totalPaginas; 
  btnProximo.addEventListener("click", function() {
    paginaAtual = paginaAtual + 1;
    // mostrarFabricas();
    criarBotoesPaginacao();
  });
  paginacao.appendChild(btnProximo);
}


