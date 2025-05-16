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

function informacaoFabrica(fabricaNome, serieNome, valor) {
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

        console.log(informacoes[0].nome)

        nome.innerHTML = `Nome: ${informacoes[0].nomeFabrica}`;
        gestor.innerHTML = `Gestor: ${informacoes[0].nome}`;
        telefone.innerHTML = `Telefone: ${informacoes[0].telefone}`;
        if (valor >= informacoes[0].limiteAtencao && valor < informacoes[0].limiteCritico) {
            status.innerHTML += `Status: Atenção`;
        } else if (valor >= informacoes[0].limiteCritico) {
            status.innerHTML = `Status: Crítico`;
        } else {
            status.innerHTML = `Status: Ok`;
        }
        qtdAlertasAberto.innerHTML = `Quantidade de Alertas em aberto: ${valor}`;
        qtdAlertasAndamento.innerHTML = `Quantidade de Alertas em andamento: ${valor}`;

    }).catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });


}

// .then(function (resposta) {
//         return resposta.json();
//     }).then(function (componentes) {
//         var medidaElement = document.getElementById("sltMedida");
//         medidaElement.innerHTML = "";
//         medidaElement.innerHTML = `<option value="#" selected>Selecione a Medida</option>`;
//         if (componentes.length > 0) {
//             componentes.forEach((tipo) => {
//                 lista_medida.push(tipo);
//                 var option = document.createElement("option");
//                 option.textContent = tipo.medida;
//                 medidaElement.appendChild(option);
//             });

window.onload = function () {
  dadosGraficoAlerta();
  mostrarFabricas();
  criarBotoesPaginacao();
};
