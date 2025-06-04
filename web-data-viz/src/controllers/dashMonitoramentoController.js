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


  if(dados.length > 1){
    for(let i = 0; i < dados.length; i++){
      for(let j = i+1; j < dados.length; j++) {

        var idMaquina = Object.keys(dados)[i][`${j}`];
        var idMaquina2 = Object.keys(dados)[j][`${j}`]

        if(idMaquina === idMaquina2){
          dados.splice(j,1)
          j--
        }

      }
    }
    listaDados.push(dados)
  }else{
    listaDados.push(dados)
  }

  //   console.log(`Dados recebidos do Python: ${JSON.stringify(dados)}`)
  try {
    res.status(200).json({ mensagem: "Dados recebidos com sucesso" })
  } catch (error) {
    console.error("Erro ao processar dados:", error)
    res.status(500).json({ mensagem: "Erro interno no servidor" })
  }
}

function dadosRecebidos(req, res) {
  const idFabrica = req.params.idFabrica

  // Filtra os dados que correspondem ao idFabrica
  const dadosFiltrados = listaDados.filter(
    dados => dados[0] && dados[0].CPU && dados[0].CPU.idFabrica == idFabrica
  )

  if (dadosFiltrados.length > 0) {
    res.status(200).send(dadosFiltrados)
    console.log(`Dados em tempo real python: ${JSON.stringify(dadosFiltrados)}`)
    // Se quiser limpar só os enviados:
    listaDados = listaDados.filter(
      dados => !(dados[0] && dados[0].CPU && dados[0].CPU.idFabrica == idFabrica)
    )
  } else {
    res.status(200).json([])
  }
}


// Dados recebidos obrigatoriamente
// function dadosRecebidos(req, res) {
//   const idFabrica = req.params.idFabrica

//   listaDados.forEach((dados, index)=>{
//     let fabrica = dados[0].CPU.idFabrica
//     if(idFabrica == fabrica){
//       res.status(200).send(listaDados)
//       console.log(`Dados em tempo real python: ${JSON.stringify(listaDados)}`)
//       listaDados = []
//     }else{
//       res.status(500)
//     }
//   })
//   // console.log(`Dados recebidos do python Obrigatório: ${listaDados}`)
// }

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
