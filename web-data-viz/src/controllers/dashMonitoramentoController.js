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
// Dados enviados pelo código python
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
// Dados recebidos obrigatoriamente
function dadosRecebidos(req, res) {
  console.log(`Dados em tempo real python: ${JSON.stringify(listaDados)}`)

  res.status(200).send(listaDados)
  listaDados = []

  // console.log(`Dados recebidos do python Obrigatório: ${listaDados}`)
}

let listaDadosPedido = []
// Dados enviados pelo código python
function dadosPedidoCliente(req, res) {
  const dados = req.body
  listaDadosPedido.push(dados)

  // console.log(`Dados recebidos do Python: ${JSON.stringify(dados)}`)
  try {
    res.status(200).json({ mensagem: "Dados recebidos com sucesso" })
  } catch (error) {
    console.error("Erro ao processar dados:", error)
    res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}
// Dados recebidos de acordo com cada pedido
function dadosPedidoRecebidos(req, res) {
  console.log(`Dados em tempo real python: ${JSON.stringify(listaDadosPedido)}`)

  res.status(200).send(listaDadosPedido)
  listaDadosPedido = []
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
  qtdServidoresPorFabrica,
  dadosPedidoCliente,
  dadosPedidoRecebidos,
}
