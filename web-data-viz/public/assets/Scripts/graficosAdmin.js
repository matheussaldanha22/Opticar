// const fabricasG = Array.from({ length: 10 }, (_, i) => `Fábrica ${i + 1}`);
// const larguraGrafico = Math.max(fabricasG.length * 105, 400);

//GRÁFICO ALERTAS
var fabricaCriticaLista = []
var fabricasSelecionadas = [];

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
            var idFabrica = divFabrica.getAttribute("data-id")
            var nomeFabrica = divFabrica.getAttribute("data-nome")
            if (divFabrica.classList.contains("div-selecionada")) {
                for(i = 0; i < fabricasSelecionadas.length; i++) {
                  if(idFabrica == Number(fabricasSelecionadas[i].idFabrica)) {
                    fabricasSelecionadas.splice(i, 1)
                    dadoFabricaSelecionada()
                    break
                  }
                }
                console.log("OLAAAAAAAAAAAAAAAAAAAAAAAAAAA" + fabricasSelecionadas)
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

function infoFabricaPadrão(idFabricaCritica, AlertasAberto, qtdAlertasProgresso) {
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
            console.log(resposta)
            throw new Error(`Erro na resposta: ${resposta.status}`);
        }
        return resposta.json();
    }).then(function (informacoes) {
        console.log(informacoes)
        return fetch(`/jira/listarAlertasPorId/${idFabricaCritica}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        }).then(resposta => {
            if (resposta.ok) {
                console.log(resposta)
                return resposta.json();
            }
            throw new Error("Erro ao buscar tempo de resolução");
        }).then(dadosJira => {
            console.log(dadosJira)
            var nome = document.querySelector("#pNome");
            var gestor = document.querySelector("#pGestor");
            var telefone = document.querySelector("#pTelefone");
            var status = document.querySelector("#pStatus");
            var qtdAlertasAberto = document.querySelector("#pQtdAlertaAberto");
            var qtdAlertasAndamento = document.querySelector("#pQtdAlertaAndamento");
            var tempoResolucao = document.querySelector("#pTempoResolucao");
            var valorTotal = AlertasAberto + qtdAlertasProgresso

            nome.innerHTML = `Nome: ${informacoes[0].nomeFabrica}`;
            gestor.innerHTML = `Gestor: ${informacoes[0].nome}`;
            telefone.innerHTML = `Telefone: ${informacoes[0].telefone}`;
            if (valorTotal >= informacoes[0].limiteAtencao && valorTotal < informacoes[0].limiteCritico) {
                status.innerHTML += `Status: Atenção`;
                status.classList.add("cor-atencao")
            } else if (valorTotal >= informacoes[0].limiteCritico) {
                status.innerHTML = `Status: Crítico`;
                status.classList.add("cor-critica")
            } else {
                status.innerHTML = `Status: Ok`;
                status.classList.add("cor-ok")
            }
            qtdAlertasAberto.innerHTML = `Quantidade de Alertas em aberto: ${AlertasAberto}`;
            qtdAlertasAndamento.innerHTML = `Quantidade de Alertas em andamento: ${qtdAlertasProgresso}`;
            if (dadosJira) {
            if (dadosJira.tempoMedioResolucao >= 60) {
                tempoMedio = dadosJira.tempoMedioResolucao / 60;
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(h)`
            } else if (dadosJira.tempoMedioResolucao >= 1440) { 
                tempoMedio = dadosJira.tempoMedioResolucao / 1440;
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(d)`
            } else {
                tempoMedio = dadosJira.tempoMedioResolucao;
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(m)`
            }
            } else {
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: Não possui dados o suficiente`
            }
        })
    }).catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}



function informacaoFabrica(fabricaNome, serieNome, valorAndamento, valorAberto) {
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
            console.log(resposta)
            throw new Error(`Erro na resposta: ${resposta.status}`);
        }
        return resposta.json();
    }).then(function (informacoes) {
        console.log(informacoes)
        var idFabricaCritica = informacoes[0].idFabrica
        return fetch(`/jira/listarAlertasPorId/${idFabricaCritica}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        }).then(resposta => {
            if (resposta.ok) {
                console.log(resposta)
                return resposta.json();
            }
            throw new Error("Erro ao buscar tempo de resolução");
        }).then(dadosJira => {
            console.log(dadosJira)
            var nome = document.querySelector("#pNome");
            var gestor = document.querySelector("#pGestor");
            var telefone = document.querySelector("#pTelefone");
            var status = document.querySelector("#pStatus");
            var qtdAlertasAberto = document.querySelector("#pQtdAlertaAberto");
            var qtdAlertasAndamento = document.querySelector("#pQtdAlertaAndamento");
            var tempoResolucao = document.querySelector("#pTempoResolucao");
            var valorTotal = valorAndamento + valorAberto

            nome.innerHTML = `Nome: ${informacoes[0].nomeFabrica}`;
            gestor.innerHTML = `Gestor: ${informacoes[0].nome}`;
            telefone.innerHTML = `Telefone: ${informacoes[0].telefone}`;
            if (valorTotal >= informacoes[0].limiteAtencao && valorTotal < informacoes[0].limiteCritico) {
                status.innerHTML += `Status: Atenção`;
                status.classList.add("cor-atencao")
            } else if (valorTotal >= informacoes[0].limiteCritico) {
                status.innerHTML = `Status: Crítico`;
                status.classList.add("cor-critica")
            } else {
                status.innerHTML = `Status: Ok`;
                status.classList.add("cor-ok")
            }
            qtdAlertasAberto.innerHTML = `Quantidade de Alertas em aberto: ${AlertasAberto}`;
            qtdAlertasAndamento.innerHTML = `Quantidade de Alertas em andamento: ${qtdAlertasProgresso}`;
            if (dadosJira) {
            if (dadosJira.tempoMedioResolucao >= 60) {
                tempoMedio = dadosJira.tempoMedioResolucao / 60;
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(h)`
            } else if (dadosJira.tempoMedioResolucao >= 1440) { 
                tempoMedio = dadosJira.tempoMedioResolucao / 1440;
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(d)`
            } else {
                tempoMedio = dadosJira.tempoMedioResolucao;
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: ${tempoMedio.toFixed(0)}:00(m)`
            }
            } else {
                tempoResolucao.innerHTML = `Tempo médio de resolução por alerta: Não possui dados o suficiente`
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
        console.log(resposta)
        return resposta.json();
      }
      throw new Error("Erro ao buscar dados da fábrica");
    })
    .then(dadosFabrica => {
        console.log(dadosFabrica)
        return fetch(`/admin/mtbf/${idFabrica}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(resposta => {
            if (resposta.ok) {
                console.log(resposta)
                return resposta.json();
            }
            throw new Error("Erro ao buscar MTBF");
        })
        .then(dadosMtbf => {
            console.log(dadosMtbf)
            return fetch(`/jira/listarAlertasPorId/${idFabrica}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
            .then(resposta => {
                if (resposta.ok) {
                    console.log(resposta)
                    return resposta.json();
                }
                throw new Error("Erro ao buscar tempo de resolução");
            })
            .then(dadosJira => {
                console.log(dadosJira)
                var mtbf = 0;
                if (dadosMtbf[0].minutos_operacao && dadosMtbf[0].qtd_alertas > 0) {
                    mtbf = dadosMtbf[0].minutos_operacao / dadosMtbf[0].qtd_alertas;
                }
                fabricasSelecionadas.push({
                    "idFabrica": idFabrica,
                    "nome": nomeFabrica,
                    "tempoResolucao": dadosJira.tempoMedioResolucao || 0,
                    "quantidadeAlertas": (dadosFabrica[0].qtd_to_do || 0) + (dadosFabrica[0].qtd_in_progress || 0),
                    "MTBF": mtbf
                });
                console.log("Fábrica adicionada com sucesso:", fabricasSelecionadas);
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
                console.log(resposta)
                return resposta.json();
            }
            throw new Error("Erro ao buscar MTBF");
        }).then((dadosMtbf => {
            var tempoMedio = 0;
            var mtbf = 0;
            if (dadosMtbf[0].minutos_operacao && dadosMtbf[0].qtd_alertas > 0) {
                mtbf = Number((dadosMtbf[0].minutos_operacao / dadosMtbf[0].qtd_alertas).toFixed(0));
            }
            console.log(mtbf)

            mediaAlerta = document.querySelector("#mediaAlerta");
            nomeFabricaTempo = document.querySelector("#nomeFabricaTempo");
            statusFabricaTempo = document.querySelector("#statusFabricaTempo");

            if (dadosTempoResolucao) {
                if (dadosTempoResolucao.tempoMedioResolucao >= 1440) {
                    tempoMedio = dadosTempoResolucao.tempoMedioResolucao;
                    if (tempoMedio > mtbf) {
                        tempoMedio = dadosTempoResolucao.tempoMedioResolucao / 1440;
                        mediaAlerta.innerHTML = `${tempoMedio.toFixed(0)}(d)`
                        mediaAlerta.classList.add("cor-critica")
                        nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
                    } else {
                        tempoMedio = dadosTempoResolucao.tempoMedioResolucao / 1440;
                        mediaAlerta.innerHTML = `${tempoMedio.toFixed(0)}(d)`
                        mediaAlerta.classList.add("cor-ok")
                        nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
                    }
                } else if (dadosTempoResolucao.tempoMedioResolucao >= 60) {
                    tempoMedio = dadosTempoResolucao.tempoMedioResolucao;
                    if (tempoMedio > mtbf) {
                        tempoMedio = dadosTempoResolucao.tempoMedioResolucao / 60;
                        mediaAlerta.innerHTML = `${tempoMedio.toFixed(0)}:00(h)`
                        mediaAlerta.classList.add("cor-critica")
                        nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
                    } else {
                        tempoMedio = dadosTempoResolucao.tempoMedioResolucao / 60;
                        mediaAlerta.innerHTML = `${tempoMedio.toFixed(0)}:00(h)`
                        mediaAlerta.classList.add("cor-ok")
                        nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
                    } 
                } else {
                    tempoMedio = dadosTempoResolucao.tempoMedioResolucao;
                    if (tempoMedio > mtbf) {
                        mediaAlerta.innerHTML = `${tempoMedio.toFixed(0)}:00(m)`
                        mediaAlerta.classList.add("cor-critica")
                        nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
                    } else {
                        mediaAlerta.innerHTML = `${tempoMedio.toFixed(0)}:00(m)`
                        mediaAlerta.classList.add("cor-ok")
                        nomeFabricaTempo.innerHTML = `${nomeFabricaCritica}`;
                    }
                }
            } else {
                mediaAlerta.innerHTML = `Não possui dados o suficiente`
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

    chartPred = new ApexCharts(
    document.querySelector("#graficoPredicao"),
    options
    );
    chartPred.render();
}

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
        var dataFormatada = dia.toLocaleDateString('pt-BR');
        categoriesPred.push(dataFormatada)
    }

    fabricasSelecionadas.forEach(fabrica => {
        var dados = [];
        var totalAlertas = fabrica.quantidadeAlertas;
        console.log(totalAlertas)
        var alertasPorDia = 1440 / fabrica.MTBF;
        console.log(alertasPorDia)
        var alertasResolvidosPorDia = 1440 / fabrica.tempoResolucao;
        console.log(alertasResolvidosPorDia)

        for(var i = 0; i < filtro; i++) {
            totalAlertas += alertasPorDia - alertasResolvidosPorDia;
            if (alertasResolvidosPorDia > alertasPorDia) {
                totalAlertas = 0
            }
            dados.push(Number(totalAlertas.toFixed(0)))
        }

        seriesPred.push({
            name: fabrica.nome,
            data: dados
        })
    })

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

window.onload = function () {
  dadosGraficoAlerta();
  setInterval(() => {
      dadosGraficoAlerta();
  }, 7000);
  mostrarFabricas();
  criarBotoesPaginacao();
  inicializarGrafico();
};

