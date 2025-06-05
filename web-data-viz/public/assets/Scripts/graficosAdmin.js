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
  "Sábado"
]

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

function obterData() {
  let dataExibir = new Date;
  return `${nomeDias[dataExibir.getDay()]} - ${dataExibir.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

function mostrarData() {
  setInterval(() => {
    document.getElementById("dataInfo").innerHTML = obterData()
  }, 1000);
}

const bobPredicao = document.querySelector('.bobPredicao')
const bobAlerta = document.querySelector('.bobAlerta')

bobAlerta.addEventListener('click', () => {
  Swal.fire({
      html: `
            <div class="modal-bob">
                <div class="containerBob">
                    <h3>Gostaria de um relatório em pdf da sua dashboard de alertas?</h3>
                </div>
            </div>
      `,
      showCancelButton: true,
      cancelButtonText: "Não",
      background: '#fff',
      confirmButtonColor: '#2C3E50',
      confirmButtonText: "Sim",
      customClass: 'addModal'
    }).then((result) => {
      if (result.isConfirmed) {
        bobAlertaRelatorio()
      }
    });
})

bobPredicao.addEventListener('click', () => {
  Swal.fire({
      html: `
            <div class="modal-bob">
                <div class="containerBob">
                    <h3>Gostaria de um relatório em pdf da sua dashboard de alertas?</h3>
                </div>
            </div>
      `,
      showCancelButton: true,
      cancelButtonText: "Não",
      background: '#fff',
      confirmButtonColor: '#2C3E50',
      confirmButtonText: "Sim",
      customClass: 'addModal'
    }).then((result) => {
      if (result.isConfirmed) {
        bobPredicaoRelatorio()
      }
    });
})

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
    var qtdFabricasCriticas = document.querySelector("#qtdFabricasCriticas");
    if (fabricaCriticaLista.length > 0) {
      var quantidadeCritico = 0;
      for (let i = 0; i< fabricaCriticaLista.length; i++) {
        if(fabricaCriticaLista[i].estado == 'critico') {
          quantidadeCritico++
        }
      }
      qtdFabricasCriticas.innerHTML = `${quantidadeCritico} Fábricas`
      
      const larguraGrafico = Math.max(fabricaCriticaLista.length * 300, 400);
      var nomeFabricaCritica = fabricaCriticaLista[0].nome;
      var idFabricaCritica = fabricaCriticaLista[0].id
      var qtdAlertasAberto = fabricaCriticaLista[0].qtd_to_do
      var qtdAlertasProgresso = fabricaCriticaLista[0].qtd_in_progress
      
      kpiTempoMaiorResolucao(nomeFabricaCritica, idFabricaCritica)
      infoFabricaPadrão(idFabricaCritica, qtdAlertasAberto, qtdAlertasProgresso);

      var fabricaCriticaKpi = document.querySelector("#fabricaCritica");
      var quantidadeAlertasKpi = document.querySelector("#quantidadeAlertas");
      var statusKpiCriticaKpi = document.querySelector("#statusKpiCritica");
      var fabricaCriticaM = document.querySelector("#fabricaCriticaModal");
      var quantidadeAlertasM = document.querySelector("#quantidadeAlertasModal");
      var statusKpiCriticaM = document.querySelector("#statusKpiCriticaModal");
      
      fabricaCriticaKpi.classList.remove("cor-critica", "cor-atencao", "cor-ok");
      statusKpiCriticaKpi.classList.remove("cor-critica", "cor-atencao", "cor-ok");
      fabricaCriticaM.classList.remove("cor-critica", "cor-atencao", "cor-ok");
      statusKpiCriticaM.classList.remove("cor-critica", "cor-atencao", "cor-ok");

      if (fabricaCriticaLista[0].estado == 'critico') {
        fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaKpi.innerHTML = `Status: Crítico`
        fabricaCriticaKpi.classList.add("cor-critica")
        statusKpiCriticaKpi.classList.add("cor-critica")
        fabricaCriticaM.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasM.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaM.innerHTML = `Status: Crítico`
        fabricaCriticaM.classList.add("cor-critica")
        statusKpiCriticaM.classList.add("cor-critica")
      } else if (fabricaCriticaLista[0].estado == 'atencao') {
        fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaKpi.innerHTML = `Status: Atenção`
        fabricaCriticaKpi.classList.add("cor-atencao")
        statusKpiCriticaKpi.classList.add("cor-atencao")
        fabricaCriticaM.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasM.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaM.innerHTML = `Status: Atenção`
        fabricaCriticaM.classList.add("cor-atencao")
        statusKpiCriticaM.classList.add("cor-atencao")
      } else {
        fabricaCriticaKpi.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasKpi.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaKpi.innerHTML = `Status: Ok`
        fabricaCriticaKpi.classList.add("cor-ok")
        statusKpiCriticaKpi.classList.add("cor-ok")
        fabricaCriticaM.innerHTML = fabricaCriticaLista[0].nome;
        quantidadeAlertasM.innerHTML = `${fabricaCriticaLista[0].quantidade} Alertas em aberto`
        statusKpiCriticaM.innerHTML = `Status: Ok`
        fabricaCriticaM.classList.add("cor-ok")
        statusKpiCriticaM.classList.add("cor-ok")
      }
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
        series: [
          {
            name: "Alertas em Aberto",
            data: fabricaCriticaLista.map(f => f.qtd_to_do),
            color: "#011f4b",
          },
          {
            name: "Alertas em Andamento",
            data: fabricaCriticaLista.map(f => f.qtd_in_progress),
            color: "#0077b6",
          },
        ],
        xaxis: {
          categories: fabricaCriticaLista.map(f => f.nome),
          color: "#0330fc",
        },
        fill: {
          opacity: 1,
        },
      };

      eixoXAlerta = fabricaCriticaLista.map(f => f.nome).join(", ");
      eixoYAlerta = `Aberto: [${fabricaCriticaLista.map(f => f.qtd_to_do).join(", ")}], Andamento: [${fabricaCriticaLista.map(f => f.qtd_in_progress).join(", ")}]`;
      estados = `${fabricaCriticaLista.map(f => f.estado)}`

      if (window.chartBar) {
        window.chartBar.destroy();
      }
      window.chartBar = new ApexCharts(
        document.querySelector("#graficoAlertaFabricas"),
        optionsBar
      );
      window.chartBar.render();

    } else {
      qtdFabricasCriticas.innerHTML = `Nenhuma Fábrica em estado crítico`
      document.querySelector("#fabricaCritica").innerHTML = `Nenhuma fabrica crítica`;
      document.querySelector("#quantidadeAlertas").innerHTML = `Nenhum alerta encontrado`
      document.querySelector("#statusKpiCritica").innerHTML = ``
      document.querySelector("#fabricaCriticaModal").innerHTML = `Nenhuma fabrica crítica`;
      document.querySelector("#quantidadeAlertasModal").innerHTML = `Nenhum alerta encontrado`
      document.querySelector("#statusKpiCriticaModal").innerHTML = ``
        if (window.chartBar) {
            window.chartBar.destroy();
             window.chartBar = new ApexCharts(document.querySelector("#graficoAlertaFabricas"), {chart: {type: 'bar', height:350}, series: [], xaxis: {categories: []}});
             window.chartBar.render();
        }
    }
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
        for(let i = 0; i < dadosAlerta.length; i ++) {
          for(let j = 0; j < dadosFabrica.length; j++) {
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
            var idFabrica = divFabrica.getAttribute("data-id")
            var nomeFabrica = divFabrica.getAttribute("data-nome")
            if (divFabrica.classList.contains("div-selecionada")) {
                for(let k = 0; k < fabricasSelecionadas.length; k++) {
                    if(idFabrica == Number(fabricasSelecionadas[k].idFabrica)) {
                        fabricasSelecionadas.splice(k, 1)
                        dadoFabricaSelecionada()
                        break
                    }
                }
                divFabrica.classList.remove("div-selecionada");
                contadorSelecionado--;
            } else if (contadorSelecionado < 5) {
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
  btnProximo.addEventListener("click", function() {
    paginaAtual = paginaAtual + 1;
    renderizarGrade();
    criarBotoesPaginacao();
  });
  paginacao.appendChild(btnProximo);
}

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
        plotarGraficoAlerta(dadosAlerta)
    })
    .catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}

function infoFabricaPadrão(idFabricaCritica, qtdAlertasAbertoParam, qtdAlertasProgressoParam) {
    fetch(`/admin/informacaoFabricaPadrao`, {
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        fabricaFkServer: idFabricaCritica,
        }),
    })
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error(`Erro na resposta: ${resposta.status}`);
        }
        return resposta.json();
    }).then(function (informacoes) {
        return fetch(`/jira/listarAlertasPorId/${idFabricaCritica}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        }).then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            }
            throw new Error("Erro ao buscar tempo de resolução");
        }).then(dadosJira => {
            var nome = document.querySelector("#pNome");
            var gestor = document.querySelector("#pGestor");
            var telefone = document.querySelector("#pTelefone");
            var status = document.querySelector("#pStatus");
            var pQtdAlertasAberto = document.querySelector("#pQtdAlertaAberto");
            var pQtdAlertasAndamento = document.querySelector("#pQtdAlertaAndamento");
            var tempoResolucao = document.querySelector("#pTempoResolucao");
            var valorTotal = qtdAlertasAbertoParam + qtdAlertasProgressoParam;
            var tempoMedio = 0;

            nome.innerHTML = `Nome: ${informacoes[0].nomeFabrica}`;
            gestor.innerHTML = `Gestor: ${informacoes[0].nome}`;
            telefone.innerHTML = `Telefone: ${informacoes[0].telefone}`;
            
            status.classList.remove("cor-ok", "cor-atencao", "cor-critica");
            if (valorTotal >= informacoes[0].limiteCritico) {
                status.innerHTML = `Status: Crítico`;
                status.classList.add("cor-critica")
            } else if (valorTotal >= informacoes[0].limiteAtencao) {
                status.innerHTML = `Status: Atenção`;
                status.classList.add("cor-atencao")
            } else {
                status.innerHTML = `Status: Ok`;
                status.classList.add("cor-ok")
            }
            pQtdAlertasAberto.innerHTML = `Quantidade de Alertas em aberto: ${qtdAlertasAbertoParam}`;
            pQtdAlertasAndamento.innerHTML = `Quantidade de Alertas em andamento: ${qtdAlertasProgressoParam}`;
            
            if (dadosJira && dadosJira.tempoMedioResolucao !== null && dadosJira.tempoMedioResolucao !== undefined) {
                tempoMedio = parseFloat(dadosJira.tempoMedioResolucao);
                if (isNaN(tempoMedio)) {
                    tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: Dado inválido`;
                } else if (tempoMedio >= 1440) { 
                    tempoMedio = tempoMedio / 1440;
                    tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}(d)`;
                } else if (tempoMedio >= 60) {
                    tempoMedio = tempoMedio / 60;
                    tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(h)`;
                } else {
                    tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(m)`;
                }
            } else {
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: Não possui dados o suficiente`;
            }
        })
    }).catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}

function informacaoFabrica(fabricaNome, serieNome, valAberto, valAndamento) {
  fetch(`/admin/informacaoFabrica`, {
      method: "POST",
       headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      fabricaNomeServer: fabricaNome,
      }),
  })
  .then(function (resposta) {
      if (!resposta.ok) {
          throw new Error(`Erro na resposta: ${resposta.status}`);
      }
      return resposta.json();
  }).then(function (informacoes) {
      var idFabricaCritica = informacoes[0].idFabrica
      return fetch(`/jira/listarAlertasPorId/${idFabricaCritica}`, {
          method: "GET",
          headers: {"Content-Type": "application/json"}
      }).then(resposta => {
          if (resposta.ok) {
              return resposta.json();
          }
          throw new Error("Erro ao buscar tempo de resolução");
      }).then(dadosJira => {
          var nome = document.querySelector("#pNome");
          var gestor = document.querySelector("#pGestor");
          var telefone = document.querySelector("#pTelefone");
          var pQtdAlertasAberto = document.querySelector("#pQtdAlertaAberto");
          var pQtdAlertasAndamento = document.querySelector("#pQtdAlertaAndamento");
          
          nome.innerHTML = `Nome: ${informacoes[0].nomeFabrica}`;
          gestor.innerHTML = `Gestor: ${informacoes[0].nome}`;
          telefone.innerHTML = `Telefone: ${informacoes[0].telefone}`;

          var status = document.querySelector("#pStatus");
          var valorTotal = valAberto + valAndamento;
          status.classList.remove("cor-ok", "cor-atencao", "cor-critica");
          
          if (valorTotal >= informacoes[0].limiteCritico) {
              status.innerHTML = `Status: Crítico`;
              status.classList.add("cor-critica");
          } else if (valorTotal >= informacoes[0].limiteAtencao) {
              status.innerHTML = `Status: Atenção`;
              status.classList.add("cor-atencao");
          } else { 
              status.innerHTML = `Status: Ok`;
              status.classList.add("cor-ok");
          }
          pQtdAlertasAberto.innerHTML = `Quantidade de Alertas em aberto: ${valAberto}`;
          pQtdAlertasAndamento.innerHTML = `Quantidade de Alertas em andamento: ${valAndamento}`;
          var tempoResolucao = document.querySelector("#pTempoResolucao");
          var tempoMedio;

          if (dadosJira && dadosJira.tempoMedioResolucao !== undefined && dadosJira.tempoMedioResolucao !== null) {
              let tempoEmMinutos = parseFloat(dadosJira.tempoMedioResolucao); 

              if (isNaN(tempoEmMinutos)) {
                  tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: Dado inválido`;
              } else if (tempoEmMinutos >= 1440) { 
                  tempoMedio = tempoEmMinutos / 1440;
                  tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}(d)`;
              } else if (tempoEmMinutos >= 60) { 
                  tempoMedio = tempoEmMinutos / 60;
                  tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(h)`;
              } else {
                  tempoMedio = tempoEmMinutos;
                  tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(m)`;
              }
          } else {
              tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: Não possui dados o suficiente`;
          }
      })
  }).catch(function (erro) {
      console.error(`#ERRO: ${erro}`);
  });
}

function dadoFabricaSelecionada(idFabrica, nomeFabrica) {
  if (idFabrica == undefined && nomeFabrica == undefined) {
    predicao()
    return
  }
    fetch(`/admin/dadosFabricaSelecionada/${idFabrica}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    })
    .then(resposta => {
      if (resposta.ok) {
        return resposta.json();
      }
      throw new Error("Erro ao buscar dados da fábrica");
    })
    .then(dadosFabrica => {
        return fetch(`/admin/mtbf/${idFabrica}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            }
            throw new Error("Erro ao buscar MTBF");
        })
        .then(dadosMtbf => {
            return fetch(`/jira/listarAlertasPorId/${idFabrica}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
            .then(resposta => {
                if (resposta.ok) {
                    return resposta.json();
                }
                throw new Error("Erro ao buscar tempo de resolução");
            })
            .then(dadosJira => {
                var mtbf = 0;
                if (dadosMtbf[0] && dadosMtbf[0].minutos_operacao && dadosMtbf[0].qtd_alertas > 0) {
                    mtbf = dadosMtbf[0].minutos_operacao / dadosMtbf[0].qtd_alertas;
                }
                fabricasSelecionadas.push({
                    "idFabrica": idFabrica,
                    "nome": nomeFabrica,
                    "tempoResolucao": parseFloat(dadosJira.tempoMedioResolucao),
                    "quantidadeAlertas": ((dadosFabrica[0].qtd_to_do || 0) + (dadosFabrica[0].qtd_in_progress || 0)),
                    "MTBF": mtbf
                });
                console.log("OLA BRASIL AQUI É DA DASHHHH")
                console.log(fabricasSelecionadas)
                predicao()
            });
        });
    })
    .catch(error => {
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
            headers: {"Content-Type": "application/json"}
        }).then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            }
            throw new Error("Erro ao buscar MTBF");
        }).then((dadosMtbf => {
            var tempoMedio = 0;
            var mtbf = 0;
            if (dadosMtbf[0] && dadosMtbf[0].minutos_operacao && dadosMtbf[0].qtd_alertas > 0) {
                mtbf = Number((dadosMtbf[0].minutos_operacao / dadosMtbf[0].qtd_alertas).toFixed(0));
            }

            let mediaAlerta = document.querySelector("#mediaAlerta");
            let nomeFabricaTempo = document.querySelector("#nomeFabricaTempo");
            
            mediaAlerta.classList.remove("cor-critica", "cor-ok", "cor-atencao");

            if (dadosTempoResolucao && dadosTempoResolucao.tempoMedioResolucao !== null && dadosTempoResolucao.tempoMedioResolucao !== undefined) {
                tempoMedio = parseFloat(dadosTempoResolucao.tempoMedioResolucao);
                let displayTempo;
                let unit;

                if (isNaN(tempoMedio)){
                    mediaAlerta.innerHTML = `Dado inválido`;
                    nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
                    return;
                }

                if (tempoMedio >= 1440) {
                    displayTempo = (tempoMedio / 1440).toFixed(0);
                    unit = "(d)";
                    mediaAlerta.innerHTML = `${displayTempo}${unit}`;
                } else if (tempoMedio >= 60) {
                    displayTempo = (tempoMedio / 60).toFixed(0);
                    unit = ":00(h)";
                    mediaAlerta.innerHTML = `${displayTempo}${unit}`;
                } else {
                    displayTempo = tempoMedio.toFixed(0);
                    unit = ":00(m)";
                    mediaAlerta.innerHTML = `${displayTempo}${unit}`;
                }
                
                if (mtbf > 0 && tempoMedio > mtbf) {
                    mediaAlerta.classList.add("cor-critica");
                } else {
                    mediaAlerta.classList.add("cor-ok");
                }
                nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
            } else {
                mediaAlerta.innerHTML = `Não possui dados o suficiente`;
                nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
            }
        }))
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
    }
    };

    if(chartPred) {
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
  var filtro = Number(filtroPredicao.value)
  if (fabricasSelecionadas.length > 0) {
    var seriesPred = [];
    var categoriesPred = [];
    var coresPred = ['#41C1E0', '#2C3E50', '#04708D', '#01232D', '#FF6F00'];
    var hoje = new Date();
    
    for (var i = 0; i < filtro; i++) {
        var dia = new Date(hoje);
        dia.setDate(hoje.getDate() + i)
        var dataFormatada = dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); 
        categoriesPred.push(dataFormatada)
    }

    fabricasSelecionadas.forEach(fabrica => {
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

        for(var k = 0; k < filtro; k++) {
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
            data: dados
        })
    })
    nomeFabricaPred = seriesPred.map(s => s.name).join(", ");
    dataYPredicao = seriesPred.map(s => {
                      return `${s.name}: ${s.data.join(", ")}`;
                    }).join("\n");
    eixoXPredicao = categoriesPred

    chartPred.updateOptions({
        series: seriesPred,
        xaxis: { categories: categoriesPred },
        colors: coresPred,
        markers: {
            size: 5,
            colors: coresPred,  
            strokeColors: "#FFFFFF",  
            strokeWidth: 2,
        }
    });
  } else {
    inicializarGrafico()
  }
}

var respostas;

async function bobAlertaRelatorio() {
    try {
        var perguntas = `Faça essa resposta para a persona administrador, quero um relatório a respeito do gráfico de alertas que possuo, ele me fala os alertas de cada fábrica, os em andamento e os em aberto, quero saber que ações eu devia tomar para essas fábricas irei te passar aqui os dados do gráfico, aqui estão os nomes das fábricas o eixo X do gráfico ${eixoXAlerta} e respectivamente os alertas delas, o eixo Y do gráfico ${eixoYAlerta} junto com o estado de cada fábrica ${estados}`;
        
        const response = await fetch("http://localhost:5000/perguntar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                perguntaServer: perguntas
            }),
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }
        respostas = await response.text();
        console.log(respostas);
        pdf(respostas)
        
    } catch (erro) {
        console.error(`Erro: ${erro}`);
    }
}

async function bobPredicaoRelatorio() {
    try {
        var series = chartPred.w.config.series;
        var datas = chartPred.w.config.xaxis.categories;
        if (!chartPred || !series || !datas) {
            Swal.fire('Erro', 'Componente não foi excluído com sucesso', 'error');
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
                perguntaServer: perguntas
            }),
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }
        respostas = await response.text();
        console.log(respostas);
        pdf(respostas)
        
    } catch (erro) {
        console.error(`Erro: ${erro}`);
    }
}

async function pdf(respostas) {
    try {
        const response = await fetch("http://localhost:5000/pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                resposta: respostas
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar PDF: ' + response.status);
        }

        const blob = await response.blob();
        console.log(blob);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'relatórioAdmin.pdf';
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (erro) {
        console.error("Erro ao baixar PDF:", erro);
        alert("Erro ao gerar PDF. Tente novamente.");
    }
}



window.onload = function () {
  mostrarData();
  dadosGraficoAlerta();
  mostrarFabricas();
  criarBotoesPaginacao();
  inicializarGrafico();
};