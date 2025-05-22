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
            mediaAlerta.innerHTML = `${tempoMedio.toFixed(2)}(Horas)`;
        } else if (dadosTempoResolucao.tempoMedioResolucao >= 1440) { 
            tempoMedio = dadosTempoResolucao.tempoMedioResolucao / 1440;
            mediaAlerta.innerHTML = `${tempoMedio.toFixed(2)}(Dias)`;
        } else {
            tempoMedio = dadosTempoResolucao.tempoMedioResolucao;
            mediaAlerta.innerHTML = `${tempoMedio.toFixed(2)}(Minutos)`;
        }

        nomeFabricaTempo.innerHTML = informacoes[0].nomeFabrica
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



window.onload = function () {
  dadosGraficoAlerta();
  mostrarFabricas();
  criarBotoesPaginacao();
};
