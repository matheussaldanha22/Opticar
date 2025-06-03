// const fabricasG = Array.from({ length: 10 }, (_, i) => `Fábrica ${i + 1}`);
// const larguraGrafico = Math.max(fabricasG.length * 105, 400);

//GRÁFICO ALERTAS
var fabricaCriticaLista = []

function plotarGraficoAlerta(dadosAlerta) {
  fabricaCriticaLista = []
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

    var nivelCriticidade;
    var estado;

    for (let i = 0; i < dadosFabrica.length; i++) {
      const fabrica = dadosFabrica[i];
      for (let j = 0; j < dadosAlerta.length; j++) {
        const alerta = dadosAlerta[j];
        if (alerta.fkFabrica === fabrica.idFabrica) {
          var quantidade = alerta.qtd_to_do + alerta.qtd_in_progress;
          if (quantidade >= fabrica.limiteCritico) {
            nivelCriticidade = quantidade - fabrica.limiteCritico;
            estado = "critico"
            fabricaCriticaLista.push({nome: fabrica.nomeFabrica,
                                      id: fabrica.idFabrica,
                                      qtd_to_do: alerta.qtd_to_do,
                                      qtd_in_progress: alerta.qtd_in_progress,
                                      quantidade,
                                      estado,
                                      nivelCriticidade
                                      })
          } else if (quantidade >= fabrica.limiteAtencao) {
            nivelCriticidade = quantidade - fabrica.limiteAtencao;
            estado = "atencao"
            fabricaCriticaLista.push({nome: fabrica.nomeFabrica,
                                      id: fabrica.idFabrica,
                                      qtd_to_do: alerta.qtd_to_do,
                                      qtd_in_progress: alerta.qtd_in_progress,
                                      quantidade,
                                      estado,
                                      nivelCriticidade
                                      })
          } else {
            nivelCriticidade = 0;
            estado = "ok"
            fabricaCriticaLista.push({nome: fabrica.nomeFabrica,
                                      id: fabrica.idFabrica,
                                      qtd_to_do: alerta.qtd_to_do,
                                      qtd_in_progress: alerta.qtd_in_progress,
                                      quantidade,
                                      estado,
                                      nivelCriticidade
                                      })
          }
        }
      }
    }

    fabricaCriticaLista.sort((a, b) => b.nivelCriticidade - a.nivelCriticidade);
    if (fabricaCriticaLista.length > 0) {
      var quantidadeCritico = 0;
      for (i = 0; i< fabricaCriticaLista.length; i++) {
        if(fabricaCriticaLista[i].estado == 'critico') {
          quantidadeCritico++
        }
      }
      var qtdFabricasCriticas = document.querySelector("#qtdFabricasCriticas");
      qtdFabricasCriticas.innerHTML = `${quantidadeCritico} Fábricas`
    } else {
      qtdFabricasCriticas.innerHTML = `Nenhuma Fábrica em estado crítico`
    }
    const larguraGrafico = Math.max(fabricaCriticaLista.length * 300, 400);
    var nomeFabricaCritica = fabricaCriticaLista[0].nome;
    var idFabricaCritica = fabricaCriticaLista[0].id
    var qtdAlertasAberto = fabricaCriticaLista[0].qtd_to_do
    var qtdAlertasProgresso = fabricaCriticaLista[0].qtd_in_progress
    
    var coresBorda = fabricaCriticaLista.map(fabrica => {
      if (fabrica.estado === 'critico') return '#FF0000';
      if (fabrica.estado === 'atencao') return '#FFD700';
      return '#00000000';
    });

    kpiTempoMaiorResolucao(nomeFabricaCritica, idFabricaCritica)
    infoFabricaPadrão(idFabricaCritica, qtdAlertasAberto, qtdAlertasProgresso);

    // KPI FABRICA MAIS CRITICA ####################################################
    var fabricaCriticaKpi = document.querySelector("#fabricaCritica");
    var quantidadeAlertasKpi = document.querySelector("#quantidadeAlertas");
    var statusKpiCriticaKpi = document.querySelector("#statusKpiCritica");
    if (fabricaCriticaLista.length > 0) {
      if (fabricaCriticaLista[0].estado == 'critico') {
        fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaKpi.innerHTML = `Status: Crítico`
        fabricaCriticaKpi.classList.add("cor-critica")
        statusKpiCriticaKpi.classList.add("cor-critica")
      } else if (fabricaCriticaLista[0].estado == 'atencao') {
        fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaKpi.innerHTML = `Status: Atenção`
        fabricaCriticaKpi.classList.add("cor-atencao")
        statusKpiCriticaKpi.classList.add("cor-atencao")
      } else {
        fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaKpi.innerHTML = `Status: Ok`
        fabricaCriticaKpi.classList.add("cor-ok")
        statusKpiCriticaKpi.classList.add("cor-ok")
      }
    } else {
      fabricaCriticaKpi.innerHTML = `Nenhuma fabrica crítica`;
      quantidadeAlertasKpi.innerHTML = `Nenhum alerta encontrado`
      statusKpiCriticaKpi.innerHTML = ``
    }
    // #############################################################################
    

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
            informacaoFabrica(fabricaNome, serieNome, valorAberto, valorAndamento);
          }
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          horizontal: false,
        },
      },
      stroke: {
        width: 2,
        colors: coresBorda
      },
      series: [
        {
          name: "Alertas em Aberto",
          data: fabricaCriticaLista.map(f => f.qtd_to_do),
          color: "#04708D",
        },
        {
          name: "Alertas em Andamento",
          data: fabricaCriticaLista.map(f => f.qtd_in_progress),
          color: "#22B4D1",
        },
      ],
      xaxis: {
        categories: fabricaCriticaLista.map(f => f.nome),
      },
      fill: {
        opacity: 1,
      },
    };

    if (window.chartBar) {
      window.chartBar.destroy();
    }
    window.chartBar = new ApexCharts(
      document.querySelector("#graficoAlertaFabricas"),
      optionsBar
    );
    window.chartBar.render();
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

const fabricasPorPagina = 10;
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
              var isAtencao = false
              if (dadosFabrica[j].limiteCritico <= totalAlertasAgora) {
                isCritica = true;
              } else if (dadosFabrica[j].limiteAtencao <= totalAlertasAgora) {
                isAtencao = true;
              }
              fabricas.push({
                id: dadosFabrica[j].idFabrica,
                nome: dadosFabrica[j].nomeFabrica,
                critica: isCritica,
                atencao: isAtencao
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
        } else if (fabrica.atencao) {
          divFabrica.classList.add("fabrica-atencao");
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


