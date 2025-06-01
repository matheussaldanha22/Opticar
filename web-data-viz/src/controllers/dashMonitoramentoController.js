var dashMonitoramentoModel = require("../models/dashMonitoramentoModel")

function obterSemana(req, res) {
  var ano = req.params.ano
  var mes = req.params.mes
  var idFabrica = req.params.idFabrica

  const dados = req.body

  dash

  dashComponenteModel.obterSemana(idFabrica, ano, mes).then((resultado) => {
    res.status(200).send(resultado)
  })
}

let listaDados = []

function dadosTempoReal(req, res) {
  const dados = req.body
  listaDados.push(dados)

  //   console.log(`Dados recebidos do Python: ${JSON.stringify(dados)}`)
  try {
    res.status(200).json({ mensagem: "Dados recebidos com sucesso" })
  } catch (error) {
    console.error("Erro ao processar dados:", error)
    res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

function dadosRecebidos(req, res) {
  if (listaDados.length > 1) {
    listaDados.splice(0, listaDados.length - 1)
  }

  if (listaDados[0].length > 15) {
    listaDados[0] = listaDados[0].slice(-15)
  }

  console.log(`Dados em tempo real python: ${JSON.stringify(listaDados)}`)

  res.status(200).send(listaDados)
}

function qtdServidoresPorFabrica(req, res) {
  const idFabrica = req.params.idFabrica

  dashMonitoramentoModel
    .qtdServidoresPorFabrica(idFabrica)
    .then((resultado) => {
      res.status(200).send(resultado)
    })
}

module.exports = {
  obterSemana,
  dadosTempoReal,
  dadosRecebidos,
}
