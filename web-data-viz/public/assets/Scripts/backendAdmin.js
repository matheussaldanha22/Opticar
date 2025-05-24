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
        var fabricaComMaisAlerta = dadosAlerta[0];
        plotarGraficoAlerta(dadosAlerta)
        // kpiTempoMaiorResolucao(fabricaComMaisAlerta)
        infoFabricaPadrão(fabricaComMaisAlerta)
    })
    .catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}

function infoFabricaPadrão(fabricaComMaisAlerta) {
    fetch("/admin/informacaoFabricaPadrao", {
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        fabricaFkServer: fabricaComMaisAlerta.fkFabrica,
        }),
    })
    .then(function (resposta) {
        if (!resposta.ok) {
            console.log(resposta)
            throw new Error(`Erro na resposta: ${resposta.status}`);
        }
        return resposta.json();
    }).then(function (informacoes) {
        kpiTempoMaiorResolucao(fabricaComMaisAlerta, informacoes)
        kpiFabricaCritica(fabricaComMaisAlerta, informacoes)
        var nome = document.querySelector("#pNome");
        var gestor = document.querySelector("#pGestor");
        var telefone = document.querySelector("#pTelefone");
        var status = document.querySelector("#pStatus");
        var qtdAlertasAberto = document.querySelector("#pQtdAlertaAberto");
        var qtdAlertasAndamento = document.querySelector("#pQtdAlertaAndamento");
        var tempoResolucao = document.querySelector("#pTempoResolucao");
        var predicao = document.querySelector("#pPredicao");

        var valorTotal = fabricaComMaisAlerta.qtd_to_do + fabricaComMaisAlerta.qtd_in_progress;

        nome.innerHTML = `Nome: ${informacoes[0].nomeFabrica}`;
        gestor.innerHTML = `Gestor: ${informacoes[0].nome}`;
        telefone.innerHTML = `Telefone: ${informacoes[0].telefone}`;
        if (valorTotal >= informacoes[0].limiteAtencao && valorTotal < informacoes[0].limiteCritico) {
            status.innerHTML += `Status: Atenção`;
        } else if (valorTotal >= informacoes[0].limiteCritico) {
            status.innerHTML = `Status: Crítico`;
        } else {
            status.innerHTML = `Status: Ok`;
        }
        qtdAlertasAberto.innerHTML = `Quantidade de Alertas em aberto: ${fabricaComMaisAlerta.qtd_to_do}`;
        qtdAlertasAndamento.innerHTML = `Quantidade de Alertas em andamento: ${fabricaComMaisAlerta.qtd_in_progress}`;

    }).catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}

function informacaoFabrica(fabricaNome, serieNome, valorAndamento, valorAberto) {
  fetch("/admin/informacaoFabrica", {
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
        var nome = document.querySelector("#pNome");
        var gestor = document.querySelector("#pGestor");
        var telefone = document.querySelector("#pTelefone");
        var status = document.querySelector("#pStatus");
        var qtdAlertasAberto = document.querySelector("#pQtdAlertaAberto");
        var qtdAlertasAndamento = document.querySelector("#pQtdAlertaAndamento");
        var tempoResolucao = document.querySelector("#pTempoResolucao");
        var predicao = document.querySelector("#pPredicao");

        var valorTotal = valorAndamento + valorAberto;

        nome.innerHTML = `Nome: ${informacoes[0].nomeFabrica}`;
        gestor.innerHTML = `Gestor: ${informacoes[0].nome}`;
        telefone.innerHTML = `Telefone: ${informacoes[0].telefone}`;
        if (valorTotal >= informacoes[0].limiteAtencao && valorTotal < informacoes[0].limiteCritico) {
            status.innerHTML += `Status: Atenção`;
        } else if (valorTotal >= informacoes[0].limiteCritico) {
            status.innerHTML = `Status: Crítico`;
        } else {
            status.innerHTML = `Status: Ok`;
        }
        qtdAlertasAberto.innerHTML = `Quantidade de Alertas em aberto: ${valorAberto}`;
        qtdAlertasAndamento.innerHTML = `Quantidade de Alertas em andamento: ${valorAndamento}`;

    }).catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}

function kpiTempoMaiorResolucao(fabricaComMaisAlerta, informacoes) {
    fetch(`/jira/kpiTempoMaiorResolucao`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idFabricaServer: fabricaComMaisAlerta.fkFabrica
        }),
    })
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error(`Erro na resposta: ${resposta.status}`);
        }
        return resposta.json();
    })
    .then(function (dadosTempoResolucao) {
        var tempoMedio = 0;

        mediaAlerta = document.querySelector("#mediaAlerta");
        nomeFabricaTempo = document.querySelector("#nomeFabricaTempo");
        statusFabricaTempo = document.querySelector("#statusFabricaTempo");
        
        if (dadosTempoResolucao.tempoMedioResolucao >= 60) {
            tempoMedio = dadosTempoResolucao.tempoMedioResolucao / 60;
            nomeFabricaTempo.innerHTML = `${tempoMedio.toFixed(1)}(H)`;
        } else if (dadosTempoResolucao.tempoMedioResolucao >= 1440) { 
            tempoMedio = dadosTempoResolucao.tempoMedioResolucao / 1440;
            nomeFabricaTempo.innerHTML = `${tempoMedio.toFixed(1)}(D)`;
        } else {
            tempoMedio = dadosTempoResolucao.tempoMedioResolucao;
            nomeFabricaTempo.innerHTML = `${tempoMedio.toFixed(1)}(M)`;
        }

        mediaAlerta.innerHTML = informacoes[0].nomeFabrica;
    })
    .catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}

function kpiFabricaCritica(fabricaComMaisAlerta, informacoes) {
    var fabricaCriticaKpi = document.querySelector("#fabricaCritica");
    var quantidadeAlertasKpi = document.querySelector("#quantidadeAlertas");
    var statusKpiCriticaKpi = document.querySelector("#statusKpiCritica");

    fabricaCriticaKpi.innerHTML = informacoes[0].nomeFabrica;
    quantidadeAlertasKpi.innerHTML = `Quantidade de alertas em aberto: ${fabricaComMaisAlerta.qtd_to_do + fabricaComMaisAlerta.qtd_in_progress}`
}

var fabricasSelecionadas = [];

function dadoFabricaSelecionada(idFabrica, nomeFabrica) {
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
    var seriesPred = [];
    var categoriesPred = [];
    var coresPred = ['#41C1E0', '#2C3E50', '#04708D', '#01232D', '#FF6F00'];
    var hoje = new Date();
    for (var i = 0; i < 30; i++) {
        var dia = new Date(hoje);
        dia.setDate(hoje.getDate() + i)
        var dataFormatada = dia.toLocaleDateString('pt-BR');
        categoriesPred.push(dataFormatada)
    }

    fabricasSelecionadas.forEach(fabrica => {
        coresPred.push(gerarCorAleatoria())
        var dados = [];
        var totalAlertas = fabrica.quantidadeAlertas;
        console.log(totalAlertas)
        var alertasPorDia = 1440 / fabrica.MTBF;
        console.log(alertasPorDia)
        var alertasResolvidosPorDia = 1440 / fabrica.tempoResolucao;
        console.log(alertasResolvidosPorDia)

        for(var i = 0; i < 30; i++) {
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
}

window.onload = function () {
  dadosGraficoAlerta();
  mostrarFabricas();
  criarBotoesPaginacao();
  inicializarGrafico();
};
