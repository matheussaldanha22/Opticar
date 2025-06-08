var fabricaCriticaLista = [];
var fabricasSelecionadas = [];
var eixoXAlerta = [];
var eixoYAlerta = [];
var estados = [];

const nomeDias = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
];

const nomeMeses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function openModal(idFabrica) {
  const modalBody = document.getElementById("modal-body");
  
  fetch(`/jira/listarAlertasPorId/${idFabrica}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error(`Erro na resposta: ${resposta.status}`);
      }
      return resposta.json();
    })
    .then(function (dadosTempoResolucao) {
      var tempoMedio = dadosTempoResolucao.tempoMedioResolucao;
      var tempoResolucao;
      
      if (isNaN(tempoMedio)) {
        tempoResolucao = `Dado inválido`;
      } else if (tempoMedio >= 1440) {
        var tempoDias = tempoMedio / 1440;
        tempoResolucao = `${tempoDias.toFixed(0)}(d)`;
      } else if (tempoMedio >= 60) {
        var tempoHoras = tempoMedio / 60;
        tempoResolucao = `${tempoHoras.toFixed(0)}(h)`;
      } else {
        tempoResolucao = `${tempoMedio.toFixed(0)}(min)`;
      }
      
      fabricaCriticaLista.forEach(fabrica => {
        if (fabrica.id == idFabrica) {
          modalBody.innerHTML = `
                <div class="modal-info">
                    <span class="info-label">Nome:</span>
                    <span>${fabrica.nome}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Gestor:</span>
                    <span>${fabrica.gestor}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Telefone:</span>
                    <span>${fabrica.telefone}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Status:</span>
                    <span class="${fabrica.estado}">${fabrica.estado}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Alertas em aberto:</span>
                    <span>${fabrica.qtd_to_do}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Alertas em andamento:</span>
                    <span>${fabrica.qtd_in_progress}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Tempo médio de resolução:</span>
                    <span>${tempoResolucao}</span>
                </div>
            `;
          document.getElementById("modal").style.display = "block";
        }
      });
    })
    .catch(function (erro) {
      console.error(`#ERRO: ${erro}`);
      fabricaCriticaLista.forEach(fabrica => {
        if (fabrica.id == idFabrica) {
          modalBody.innerHTML = `
                <div class="modal-info">
                    <span class="info-label">Nome:</span>
                    <span>${fabrica.nome}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Gestor:</span>
                    <span>${fabrica.gestor}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Telefone:</span>
                    <span>${fabrica.telefone}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Status:</span>
                    <span class="${fabrica.estado}">${fabrica.estado}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Alertas em aberto:</span>
                    <span>${fabrica.qtd_to_do}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Alertas em andamento:</span>
                    <span>${fabrica.qtd_in_progress}</span>
                </div>
                <div class="modal-info">
                    <span class="info-label">Tempo médio de resolução:</span>
                    <span>${fabrica.tempoResolucao}</span>
                </div>
            `;
          document.getElementById("modal").style.display = "block";
        }
      });
    });
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}


function obterData() {
  let dataExibir = new Date();
  return `${nomeDias[dataExibir.getDay()]} - ${dataExibir.toLocaleString(
    "pt-BR",
    { timeZone: "America/Sao_Paulo" }
  )}`;
}

function mostrarData() {
  setInterval(() => {
    document.getElementById("dataInfo").innerHTML = obterData();
  }, 1000);
}

const bobPredicao = document.querySelector(".bobPredicao");
const bobAlerta = document.querySelector(".bobAlerta");

bobAlerta.addEventListener("click", () => {
  Swal.fire({
    html: `
      <div class="modal-bob">
        <div class="containerBob">
          <h3>Relatório de Alertas</h3>
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
        bobAlertaRelatorio();
      } else {
        var relatorioNome = document.getElementById('select_relatorio').value;
        if (relatorioNome) {
          baixarHistorico(relatorioNome);
        }
      }
    }
  });
});


bobPredicao.addEventListener("click", () => {
   Swal.fire({
    html: `
      <div class="modal-bob">
        <div class="containerBob">
          <h3>Relatório de Predição</h3>
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
        bobPredicaoRelatorio();
      } else {
        var relatorioNome = document.getElementById('select_relatorio').value;
        if (relatorioNome) {
          baixarHistorico(relatorioNome);
        }
      }
    }
  });
});

function dadosGraficoAlerta() {
  fetch("/admin/dadosGraficoAlerta", {
    method: "GET",
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error(`Erro na resposta: ${resposta.status}`);
      }
      return resposta.json();
    })
    .then(function (dadosAlerta) {
      plotarGraficoAlerta(dadosAlerta);
    })
    .catch(function (erro) {
      console.error(`#ERRO: ${erro}`);
    });
}

function plotarGraficoAlerta(dadosAlerta) {
  fabricaCriticaLista = [];
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
        var fabrica = dadosFabrica[i];
        for (let j = 0; j < dadosAlerta.length; j++) {
          var alerta = dadosAlerta[j];
          if (alerta.fkFabrica === fabrica.idFabrica) {
            var quantidade = alerta.qtd_to_do + alerta.qtd_in_progress;
            if (quantidade >= fabrica.limiteCritico) {
              nivelCriticidade = quantidade - fabrica.limiteCritico;
              estado = "critico";
              fabricaCriticaLista.push({
                nome: fabrica.nomeFabrica,
                gestor: fabrica.nome,
                atencao: fabrica.limiteAtencao,
                critico: fabrica.limiteCritico,
                telefone: fabrica.telefone,
                id: fabrica.idFabrica,
                qtd_to_do: alerta.qtd_to_do,
                qtd_in_progress: alerta.qtd_in_progress,
                quantidade,
                estado,
                nivelCriticidade,
              });
            } else if (quantidade >= fabrica.limiteAtencao) {
              nivelCriticidade = quantidade - fabrica.limiteAtencao;
              estado = "atencao";
              fabricaCriticaLista.push({
                nome: fabrica.nomeFabrica,
                gestor: fabrica.nome,
                atencao: fabrica.limiteAtencao,
                critico: fabrica.limiteCritico,
                id: fabrica.idFabrica,
                qtd_to_do: alerta.qtd_to_do,
                qtd_in_progress: alerta.qtd_in_progress,
                quantidade,
                estado,
                nivelCriticidade,
              });
            } else {
              nivelCriticidade = 0;
              estado = "ok";
              fabricaCriticaLista.push({
                nome: fabrica.nomeFabrica,
                gestor: fabrica.nome,
                atencao: fabrica.limiteAtencao,
                critico: fabrica.limiteCritico,
                id: fabrica.idFabrica,
                qtd_to_do: alerta.qtd_to_do,
                qtd_in_progress: alerta.qtd_in_progress,
                quantidade,
                estado,
                nivelCriticidade,
              });
            }
          }
        }
      }

      fabricaCriticaLista.sort(
        (a, b) => b.nivelCriticidade - a.nivelCriticidade
      );
      var qtdFabricasCriticas = document.querySelector("#qtdFabricasCriticas");
      if (fabricaCriticaLista.length > 0) {
        var quantidadeCritico = 0;
        for (let i = 0; i < fabricaCriticaLista.length; i++) {
          if (fabricaCriticaLista[i].estado == "critico") {
            quantidadeCritico++;
          }
        }
        qtdFabricasCriticas.innerHTML = `${quantidadeCritico} Fábricas`;

        const larguraGrafico = Math.max(fabricaCriticaLista.length * 200, 400);
        var nomeFabricaCritica = fabricaCriticaLista[0].nome;
        var idFabricaCritica = fabricaCriticaLista[0].id;

        kpiTempoMaiorResolucao(nomeFabricaCritica, idFabricaCritica);

        var fabricaCriticaKpi = document.querySelector("#fabricaCritica");
        var quantidadeAlertasKpi = document.querySelector("#quantidadeAlertas");
        var statusKpiCriticaKpi = document.querySelector("#statusKpiCritica");
        var fabricaCriticaM = document.querySelector("#fabricaCriticaModal");
        var quantidadeAlertasM = document.querySelector("#quantidadeAlertasModal");
        var statusKpiCriticaM = document.querySelector("#statusKpiCriticaModal");

        fabricaCriticaKpi.classList.remove(
          "critico",
          "atencao",
          "ok"
        );
        statusKpiCriticaKpi.classList.remove(
          "critico",
          "atencao",
          "ok"
        );
        fabricaCriticaM.classList.remove(
          "critico",
          "atencao",
          "ok"
        );
        statusKpiCriticaM.classList.remove(
          "critico",
          "atencao",
          "ok"
        );

        if (fabricaCriticaLista[0].estado == "critico") {
          fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
          quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`;
          statusKpiCriticaKpi.innerHTML = `Status: Crítico`;
          fabricaCriticaKpi.classList.add("critico");
          statusKpiCriticaKpi.classList.add("critico");
          fabricaCriticaM.innerHTML = fabricaCriticaLista[0].nome;
          quantidadeAlertasM.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`;
          statusKpiCriticaM.innerHTML = `Status: Crítico`;
          fabricaCriticaM.classList.add("critico");
          statusKpiCriticaM.classList.add("critico");
        } else if (fabricaCriticaLista[0].estado == "atencao") {
          fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
          quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`;
          statusKpiCriticaKpi.innerHTML = `Status: Atenção`;
          fabricaCriticaKpi.classList.add("atencao");
          statusKpiCriticaKpi.classList.add("atencao");
          fabricaCriticaM.innerHTML = fabricaCriticaLista[0].nome;
          quantidadeAlertasM.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`;
          statusKpiCriticaM.innerHTML = `Status: Atenção`;
          fabricaCriticaM.classList.add("atencao");
          statusKpiCriticaM.classList.add("atencao");
        } else {
          fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
          quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`;
          statusKpiCriticaKpi.innerHTML = `Status: Ok`;
          fabricaCriticaKpi.classList.add("ok");
          statusKpiCriticaKpi.classList.add("ok");
          fabricaCriticaM.innerHTML = fabricaCriticaLista[0].nome;
          quantidadeAlertasM.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`;
          statusKpiCriticaM.innerHTML = `Status: Ok`;
          fabricaCriticaM.classList.add("ok");
          statusKpiCriticaM.classList.add("ok");
        }
        var optionsBar = {
          chart: {
            height: 550,
            width: 1000,
            type: "bar",
            toolbar: { show: true },
            zoom: { enabled: true },
            stacked: false,
            events: {
              dataPointSelection: function (event, chartContext, config) {
                const serieNome = optionsBar.series[config.seriesIndex].name;
                const fabricaNome =
                  optionsBar.xaxis.categories[config.dataPointIndex];
                const valorAberto =
                  optionsBar.series[0].data[config.dataPointIndex];
                const valorAndamento =
                  optionsBar.series[1].data[config.dataPointIndex];
                informacaoFabrica(
                  fabricaNome,
                  serieNome,
                  valorAberto,
                  valorAndamento
                );
              },
            },
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
              data: fabricaCriticaLista.slice(0,5).map((f) => f.qtd_to_do),
              color: "#011f4b",
            },
            {
              name: "Alertas em Andamento",
              data: fabricaCriticaLista.slice(0,5).map((f) => f.qtd_in_progress),
              color: "#0077b6",
            },
          ],
          xaxis: {
            categories: fabricaCriticaLista.slice(0,5).map((f) => f.nome),
            color: "#0330fc",
            labels: {
              style: {
                fontSize: '17px', 
                fontWeight: 'bold', 
                colors: '#333'      
              }
            }
          },
          legend: {
            fontSize: '17px',
            fontWeight: 'bold',
            position: 'bottom',
            horizontalAlign: 'center',
            labels: {
              colors: '#333'
            }
          },
          fill: {
            opacity: 1,
          },
        };

        eixoXAlerta = fabricaCriticaLista.slice(0,5).map((f) => f.nome).join(", ");
        eixoYAlerta = `Aberto: [${fabricaCriticaLista.slice(0,5).map((f) => f.qtd_to_do).join(", ")}], Andamento: [${fabricaCriticaLista.slice(0,5)
          .map((f) => f.qtd_in_progress)
          .join(", ")}]`;
        estados = `${fabricaCriticaLista.slice(0,5).map((f) => f.estado)}`;

        cardFabricas()

        if (window.chartBar) {
          window.chartBar.destroy();
        }
        window.chartBar = new ApexCharts(
          document.querySelector("#graficoAlertaFabricas"),
          optionsBar
        );
        window.chartBar.render();
      } else {
        qtdFabricasCriticas.innerHTML = `Nenhuma Fábrica em estado crítico`;
        document.querySelector(
          "#fabricaCritica"
        ).innerHTML = `Nenhuma fabrica crítica`;
        document.querySelector(
          "#quantidadeAlertas"
        ).innerHTML = `Nenhum alerta encontrado`;
        document.querySelector("#statusKpiCritica").innerHTML = ``;
        document.querySelector(
          "#fabricaCriticaModal"
        ).innerHTML = `Nenhuma fabrica crítica`;
        document.querySelector(
          "#quantidadeAlertasModal"
        ).innerHTML = `Nenhum alerta encontrado`;
        document.querySelector("#statusKpiCriticaModal").innerHTML = ``;
        if (window.chartBar) {
          window.chartBar.destroy();
          window.chartBar = new ApexCharts(
            document.querySelector("#graficoAlertaFabricas"),
            {
              chart: { type: "bar", height: 350 },
              series: [],
              xaxis: { categories: [] },
            }
          );
          window.chartBar.render();
        }
      }
    })
    .catch(function (erro) {
      console.error(`#ERRO: ${erro}`);
    });
}

function cardFabricas() {
    var containerCards = document.querySelector(".cards-container");
    
    containerCards.innerHTML = '';

    fabricaCriticaLista.slice(0,5).forEach(fabrica => {
        var divCard = document.createElement("div");
        var divTitulo = document.createElement("div");
        var cardTitulo = document.createElement("div");
        var cardInfo = document.createElement("div");
        var spanTitulo = document.createElement("span");
        var spanStatus = document.createElement("span");
        var divNome = document.createElement("div");
        var divAlertas = document.createElement("div");
        
        divCard.classList.add("card");
        if (fabrica.estado == "critico") {
            divCard.classList.add("card-critico");
        }
        if (fabrica.estado == "atencao") {
            divCard.classList.add("card-atencao");
        }
        if (fabrica.estado == "ok") {
            divCard.classList.add("card-ok");
        }
        
        divTitulo.classList.add("card-header");
        spanTitulo.innerHTML = `<i class='bx bxs-business'></i>`;
        spanStatus.classList.add("status");
        spanStatus.innerHTML = `${fabrica.estado}`;
        
        cardTitulo.classList.add("card-titulo");
        cardTitulo.innerHTML = `${fabrica.nome}`;
        
        cardInfo.classList.add("card-info");
        divNome.innerHTML = `<i class='bx bxs-user'></i>${fabrica.gestor}`;
        divAlertas.innerHTML = `⚠️ ${fabrica.quantidade}`;
        
        cardInfo.appendChild(divNome);
        cardInfo.appendChild(divAlertas);
        
        divTitulo.appendChild(spanTitulo);
        divTitulo.appendChild(spanStatus);
        
        divCard.appendChild(divTitulo);
        divCard.appendChild(cardTitulo);
        divCard.appendChild(cardInfo);
        
        containerCards.appendChild(divCard);
        divCard.addEventListener("click", () => {
            var idFabrica = fabrica.id;
            openModal(idFabrica)
        })
    });
}

const bg = document.querySelector(".bg");
const modalPredicao = document.querySelector(".modalPredicao");
const cliqueAqui = document.querySelector("#cliqueAqui");
const fechar = document.querySelector(".fechar");
const ancoraFabrica = document.querySelector("#fabricas");

ancoraFabrica.addEventListener("click", () => {
  window.location.href = "./fabricas.html";
});

cliqueAqui.addEventListener("click", () => {
  modalPredicao.classList.add("ativo");
  bg.classList.add("ativoBg");
});

fechar.addEventListener("click", () => {
  modalPredicao.classList.remove("ativo");
  bg.classList.remove("ativoBg");
});

const fabricasPorPagina = 10;
var paginaAtual = 1;
var fabricas = [];
var contadorSelecionado = 0;

function mostrarFabricas() {
  fetch("/admin/dadosFabricaModal", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      if (resposta.ok) {
        return resposta.json();
      }
      throw new Error("Não foi possivél pegar os dados");
    })
    .then((dadosFabrica) => {
      return fetch("/admin/dadosGraficoAlerta", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((resposta) => {
          if (resposta.ok) {
            return resposta.json();
          }
          throw new Error("Não foi possível pegar os alertas");
        })
        .then((dadosAlerta) => {
          fabricas.length = 0;
          for (let i = 0; i < dadosAlerta.length; i++) {
            for (let j = 0; j < dadosFabrica.length; j++) {
              if (dadosFabrica[j].idFabrica == dadosAlerta[i].fkFabrica) {
                var totalAlertasAgora = dadosAlerta[i].qtd_to_do + dadosAlerta[i].qtd_in_progress;
                var isCritica = false;
                var isAtencao = false;
                if (dadosFabrica[j].limiteCritico <= totalAlertasAgora) {
                  isCritica = true;
                } else if (dadosFabrica[j].limiteAtencao <= totalAlertasAgora) {
                  isAtencao = true;
                }
                fabricas.push({
                  id: dadosFabrica[j].idFabrica,
                  nome: dadosFabrica[j].nomeFabrica,
                  critica: isCritica,
                  atencao: isAtencao,
                });
              }
            }
          }
          renderizarGrade();
        });
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
    divFabrica.dataset.id = fabrica.id;
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
      var idFabrica = divFabrica.getAttribute("data-id");
      var nomeFabrica = divFabrica.getAttribute("data-nome");
      if (divFabrica.classList.contains("div-selecionada")) {
        for (let k = 0; k < fabricasSelecionadas.length; k++) {
          if (idFabrica == Number(fabricasSelecionadas[k].idFabrica)) {
            fabricasSelecionadas.splice(k, 1);
            dadoFabricaSelecionada();
            break;
          }
        }
        divFabrica.classList.remove("div-selecionada");
        contadorSelecionado--;
      } else if (contadorSelecionado < 5) {
        dadoFabricaSelecionada(idFabrica, nomeFabrica);
        divFabrica.classList.add("div-selecionada");
        contadorSelecionado++;
      } else {
        Swal.fire("Erro!", "Por favor, selecione somente 5 fábricas.", "error");
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
  btnAnterior.addEventListener("click", function () {
    paginaAtual = paginaAtual - 1;
    renderizarGrade();
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
  btnProximo.addEventListener("click", function () {
    paginaAtual = paginaAtual + 1;
    renderizarGrade();
    criarBotoesPaginacao();
  });
  paginacao.appendChild(btnProximo);
}

function dadoFabricaSelecionada(idFabrica, nomeFabrica) {
  if (idFabrica == undefined && nomeFabrica == undefined) {
    predicao();
    return;
  }
  fetch(`/admin/dadosFabricaSelecionada/${idFabrica}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((resposta) => {
      if (resposta.ok) {
        return resposta.json();
      }
      throw new Error("Erro ao buscar dados da fábrica");
    })
    .then((dadosFabrica) => {
      return fetch(`/admin/mtbf/${idFabrica}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((resposta) => {
          if (resposta.ok) {
            return resposta.json();
          }
          throw new Error("Erro ao buscar MTBF");
        })
        .then((dadosMtbf) => {
          return fetch(`/jira/listarAlertasPorId/${idFabrica}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((resposta) => {
              if (resposta.ok) {
                return resposta.json();
              }
              throw new Error("Erro ao buscar tempo de resolução");
            })
            .then((dadosJira) => {
              var mtbf = 0;
              if (dadosMtbf[0] && dadosMtbf[0].minutos_operacao && dadosMtbf[0].qtd_alertas > 0) {
                mtbf = dadosMtbf[0].minutos_operacao / dadosMtbf[0].qtd_alertas;
              }
              fabricasSelecionadas.push({
                idFabrica: idFabrica,
                nome: nomeFabrica,
                tempoResolucao: parseInt(dadosJira.tempoMedioResolucao),
                quantidadeAlertas:
                  (dadosFabrica[0].qtd_to_do || 0) +
                  (dadosFabrica[0].qtd_in_progress || 0),
                MTBF: mtbf,
              });
              console.log(fabricasSelecionadas);
              predicao();
            });
        });
    })
    .catch((error) => {
      console.error("Erro ao processar dados da fábrica:", error);
    });
}

function kpiTempoMaiorResolucao(nomeFabricaCritica, idFabricaCritica) {
  fetch(`/jira/listarAlertasPorId/${idFabricaCritica}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error(`Erro na resposta: ${resposta.status}`);
      }
      return resposta.json();
    })
    .then(function (dadosTempoResolucao) {
      return fetch(`/admin/mtbf/${idFabricaCritica}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((resposta) => {
          if (resposta.ok) {
            return resposta.json();
          }
          throw new Error("Erro ao buscar MTBF");
        })
        .then((dadosMtbf) => {
          var tempoMedio = 0;
          var mtbf = 0;
          if (dadosMtbf[0] && dadosMtbf[0].minutos_operacao && dadosMtbf[0].qtd_alertas > 0) {
            mtbf = Number((dadosMtbf[0].minutos_operacao / dadosMtbf[0].qtd_alertas).toFixed(0));
          }

          let mediaAlerta = document.querySelector("#mediaAlerta");
          let nomeFabricaTempo = document.querySelector("#nomeFabricaTempo");
          let loader = document.querySelector("#tempo");
          loader.classList.remove("loader")
          

          mediaAlerta.classList.remove("critico", "ok", "atencao");

          if (
            dadosTempoResolucao &&
            dadosTempoResolucao.tempoMedioResolucao !== null &&
            dadosTempoResolucao.tempoMedioResolucao !== undefined
          ) {
            tempoMedio = parseInt(dadosTempoResolucao.tempoMedioResolucao);
            var tempoResolucao;

            if (isNaN(tempoMedio)) {
              mediaAlerta.innerHTML = `Dado inválido`;
              nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
              return;
            }

            if (tempoMedio >= 1440) {
              tempoResolucao = (tempoMedio / 1440).toFixed(0);
              mediaAlerta.innerHTML = `${tempoResolucao}(d)`;
            } else if (tempoMedio >= 60) {
              tempoResolucao = (tempoMedio / 60).toFixed(0);
              mediaAlerta.innerHTML = `${tempoResolucao}(h)`;
            } else {
              tempoResolucao = tempoMedio.toFixed(0);
              mediaAlerta.innerHTML = `${tempoResolucao}(min)`;
            }

            if (mtbf > 0 && tempoMedio < mtbf) {
              mediaAlerta.classList.add("critico");
            } else {
              mediaAlerta.classList.add("ok");
            }
            nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
          } else {
            mediaAlerta.innerHTML = `Não possui dados o suficiente`;
            nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
          }
        });
    })
    .catch(function (erro) {
      console.error(`#ERRO: ${erro}`);
    });
}

var chartPred;

function inicializarGrafico() {
  var options = {
    chart: {
      type: "line",
      height: 350,
      width: 1300,
      toolbar: {
        show: true,
      },
      background: "#FFFFF",
    },
    series: [],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#4ecdc4", "#6c8ebf"],
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: "#555555",
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#555555",
          fontSize: "14px",
        },
      },
    },
    grid: {
      borderColor: "#e0e0e0",
      strokeDashArray: 4,
    },
    markers: {
      size: 5,
      colors: ["#4ecdc4", "#6c8ebf"],
      strokeColors: "#FFFFFF",
      strokeWidth: 2,
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "12px",
        colors: ["#555555"],
      },
      background: {
        enabled: true,
        foreColor: "#555555",
        borderRadius: 2,
        padding: 4,
        opacity: 0.9,
        borderWidth: 1,
        borderColor: "#e0e0e0",
      },
    },
    tooltip: {
      theme: "light",
      marker: {
        show: true,
      },
    },
    theme: {
      mode: "light",
    },
  };

  if (chartPred) {
    chartPred.destroy();
  }
  chartPred = new ApexCharts(
    document.querySelector("#graficoPredicao"),
    options
  );
  chartPred.render();
}
var nomeFabricaPred = [];
var dataYPredicao = [];
var eixoXPredicao = [];

function predicao() {
  var filtro = Number(filtroPredicao.value);
  if (fabricasSelecionadas.length > 0) {
    var seriesPred = [];
    var categoriesPred = [];
    var coresPred = ["#41C1E0", "#2C3E50", "#04708D", "#01232D", "#FF6F00"];
    var hoje = new Date();

    for (var i = 0; i < filtro; i++) {
      var dia = new Date(hoje);
      dia.setDate(hoje.getDate() + i);
      var dataFormatada = dia.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      categoriesPred.push(dataFormatada);
    }

    fabricasSelecionadas.forEach((fabrica) => {
      var dados = [];
      var totalAlertas = fabrica.quantidadeAlertas;

      var mtbf = fabrica.MTBF;
      if (fabrica.MTBF > 0 && fabrica.MTBF < 1) {
        mtbf = 1;
      }

      var alertasPorDia = 0;
      if (mtbf > 0) {
        alertasPorDia = 1440 / mtbf;
      }

      var alertasResolvidosPorDia = 0;
      if (fabrica.tempoResolucao > 0) {
        alertasResolvidosPorDia = 1440 / fabrica.tempoResolucao;
      }

      for (var k = 0; k < filtro; k++) {
        totalAlertas += alertasPorDia - alertasResolvidosPorDia;

        if (totalAlertas < 0) {
          totalAlertas = 0;
        }

        if (alertasResolvidosPorDia > alertasPorDia) {
          totalAlertas = 0;
        }

        dados.push(Number(totalAlertas.toFixed(0)));
      }

      seriesPred.push({
        name: fabrica.nome,
        data: dados,
      });
    });
    nomeFabricaPred = seriesPred.map((s) => s.name).join(", ");
    dataYPredicao = seriesPred.map((s) => {
        return `${s.name}: ${s.data.join(", ")}`;
      }).join("\n");
    eixoXPredicao = categoriesPred;

    chartPred.updateOptions({
      series: seriesPred,
      xaxis: { categories: categoriesPred },
      colors: coresPred,
      markers: {
        size: 5,
        colors: coresPred,
        strokeColors: "#FFFFFF",
        strokeWidth: 2,
      },
    });
  } else {
    inicializarGrafico();
  }
}

var respostas;

async function bobAlertaRelatorio() {
  document.getElementById('bobA').classList.add('loader');
  var agora = new Date();
  var ano = agora.getFullYear();
  var mes = String(agora.getMonth() + 1).padStart(2, '0');
  var dia = String(agora.getDate()).padStart(2, '0');
  var hora = String(agora.getHours()).padStart(2, '0');
  var minuto = String(agora.getMinutes()).padStart(2, '0');
  var tipo = `Alerta_${ano}-${mes}-${dia}_${hora}-${minuto}.pdf`;
  try {
    var perguntas = `Faça essa resposta para a persona administrador, quero um relatório colorido, utilize cores, a respeito do gráfico de alertas que possuo, ele me fala os alertas de cada fábrica, os em andamento e os em aberto, quero saber que ações eu devia tomar para essas fábricas irei te passar aqui os dados do gráfico, aqui estão os nomes das fábricas o eixo X do gráfico ${eixoXAlerta} e respectivamente os alertas delas, o eixo Y do gráfico ${eixoYAlerta} junto com o estado de cada fábrica ${estados}, quero um relatório mais descritivo e visualmente fácil de entender e após analisar, faça um resumo sobre a situação, junto com o que você acha da situação, faça um relatório com cores, colca enfaze nas cores, quero cores, colorido`;
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
    pdf(respostas, tipo);
  } catch (erro) {
    console.error(`Erro: ${erro}`);
    Swal.fire('Erro!', 'Erro ao tentar formular relatório', 'error')
  } finally {
    document.getElementById('bobA').classList.remove('loader');
  }
}

async function bobPredicaoRelatorio() {
  document.getElementById('bobP').classList.add('loader');
  var agora = new Date();
  var ano = agora.getFullYear();
  var mes = String(agora.getMonth() + 1).padStart(2, '0');
  var dia = String(agora.getDate()).padStart(2, '0');
  var hora = String(agora.getHours()).padStart(2, '0');
  var minuto = String(agora.getMinutes()).padStart(2, '0');
  var tipo = `Predição_${ano}-${mes}-${dia}_${hora}-${minuto}.pdf`;
  try {
    var series = chartPred.w.config.series;
    var datas = chartPred.w.config.xaxis.categories;
    if (!chartPred || !series || !datas) {
      Swal.fire("Erro", "Não possui dados da predição", "error");
      return;
    }

    var perguntas = `Esse é um relatório para a persona Administrador. Quero um relatório do gráfico abaixo que mostra uma previsão da quantidade de alertas acumulados ao longo dos dias para cada fábrica selecionada. A previsão considera dois fatores principais: MTBF (Mean Time Between Failures): representa o tempo médio entre falhas em minutos.
    Tempo médio de resolução de alertas: também em minutos.
    Gostaria que no relatório fosse explicado a conta por trás da predição.
    A ideia é estimar, para os próximos dias, quantos alertas irão surgir (com base no MTBF) e quantos serão resolvidos (com base no tempo médio de resolução). Com isso, calculamos o acúmulo previsto de alertas para cada dia.
    O eixo X representa as datas futuras (dias consecutivos), e o eixo Y mostra a quantidade acumulada de alertas prevista para cada uma dessas datas. Cada linha no gráfico representa uma fábrica diferente.
    Aqui estão os dados do gráfico: essas são as fábricas ${nomeFabricaPred} o eixo X ${eixoXPredicao} e aqui o eixo Y ${dataYPredicao}, quero saber que ações eu devia tomar para essas fábricas, quero um relatório que caiba em 1 página e sem gráfico somente os dados e as ações que você acha que eu deveria tomar`;

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
    pdf(respostas, tipo);
  } catch (erro) {
    console.error(`Erro: ${erro}`);
    Swal.fire('Erro!', 'Erro ao tentar formular relatório', 'error');
  } finally {
    document.getElementById('bobP').classList.remove('loader');
  }
}

async function pdf(respostas, tipo) {
  try {
    const resposta = await fetch("http://localhost:5000/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        respostaBOB: respostas,
        nomeArquivo: tipo,
      }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao gerar PDF: " + resposta.status);
    }

    const blob = await resposta.blob();
    console.log(blob);
    relatorioClient(blob, tipo)

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

async function relatorioClient(blob, tipo) {
  const formData = new FormData();
  formData.append("relatorioCliente", blob, "relatorio.pdf")
  formData.append("tipo", tipo);

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
  try {
    const resposta = await fetch("http://localhost:5000/aws/visualizarHistorico", {
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
  try {
    const resposta = await fetch(`http://localhost:5000/aws/baixarHistorico/${relatorioNome}`, {
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

window.onload = function () {
  mostrarData();
  dadosGraficoAlerta();
  mostrarFabricas();
  criarBotoesPaginacao();
  inicializarGrafico();
};
