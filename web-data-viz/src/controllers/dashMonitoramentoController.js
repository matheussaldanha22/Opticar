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


  if (dados.length > 1) {
    for (let i = 0; i < dados.length; i++) {
      for (let j = i + 1; j < dados.length; j++) {

        var idMaquina = Object.keys(dados)[i][`${j}`];
        var idMaquina2 = Object.keys(dados)[j][`${j}`]

        if (idMaquina === idMaquina2) {
          dados.splice(j, 1)
          j--
        }
      }
    }
    listaDados.push(dados)
  } else {
    listaDados.push(dados)
  }
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



let listaDadosPedido = []

function dadosPedidoCliente(req, res) {
  const dados = req.body;

  try {
    if (dados && dados.length > 0) {
      const primeiroItem = dados[0];
      if (primeiroItem) {
        const chaveComponente = Object.keys(primeiroItem)[0];
        const idFabrica = primeiroItem[chaveComponente]?.idFabrica;
        const idMaquina = primeiroItem[chaveComponente]?.idMaquina;
        
        const indiceExistente = listaDadosPedido.findIndex(entrada => {
          if (entrada && entrada.length > 0) {
            const primeiroItemExistente = entrada[0];
            const chaveComponenteExistente = Object.keys(primeiroItemExistente)[0];
            return (
              primeiroItemExistente[chaveComponenteExistente]?.idMaquina === idMaquina &&
              primeiroItemExistente[chaveComponenteExistente]?.idFabrica === idFabrica
            );
          }
          return false;
        });
        
        if (indiceExistente !== -1) {
          listaDadosPedido[indiceExistente] = dados;
          console.log(`Dados atualizados para a máquina ${idMaquina} na fábrica ${idFabrica}`);
        } else {
          listaDadosPedido.push(dados);
          console.log(`Novos dados adicionados para a máquina ${idMaquina} na fábrica ${idFabrica}`);
        }
      } else {
        listaDadosPedido.push(dados);
      }
    } else {
      listaDadosPedido.push(dados);
    }

    res.status(200).json({ mensagem: "Dados recebidos com sucesso" });
    console.log(`Tamanho atual da lista: ${listaDadosPedido.length}`);
  } catch (erro) {
    console.error("Erro ao processar dados:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}
// Dados enviados pelo código python
// function dadosPedidoCliente(req, res) {
//   const dados = req.body

//   // for (let i = 0; i < dados.length; i++) {
//   //   for (let j = 0; j < dados[i].length; j++) {
//   //     const componente = Object.keys(dados[i][j])[0]
//   //     let idFabrica = dados[i][j][componente].idFabrica
//   //     let idMaquina = dados[i][j][componente].idMaquina

//   //     if (idMaquina == idMaquinaParam && idFabrica == idFabricaParam) {
//   //       listaFiltrada.push(listaDadosPedido[i][j])
//   //     }
//   //   }
//   // }

//   listaDadosPedido.push(dados)

//   //   console.log(`Dados recebidos do Python: ${JSON.stringify(dados)}`)
//   try {
//     res.status(200).json({ mensagem: "Dados recebidos com sucesso" })
//     console.log(listaDadosPedido)
//   } catch (error) {
//     console.error("Erro ao processar dados:", error)
//     res.status(500).json({ mensagem: "Erro interno no servidor" })
//   }
// }
//  Devo filtrar o array principal no próprio post para que a mamória do body.parser estore
// Devo filtrar de acordo com o idFabrica e idMaquina e salvar em um array separado
// Michele brito -- JavaSpring

function dadosPedidoRecebidos(req, res) {
  const idFabricaParam = req.params.idFabrica
  const idMaquinaParam = req.params.idMaquina
  let listaFiltrada = []

  console.log("Lista de dados pedido:", JSON.stringify(listaDadosPedido));

  try {
    for (let i = 0; i < listaDadosPedido.length; i++) {
      for (let j = 0; j < listaDadosPedido[i].length; j++) {
        const componente = Object.keys(listaDadosPedido[i][j])[0]
        let idFabrica = listaDadosPedido[i][j][componente].idFabrica
        let idMaquina = listaDadosPedido[i][j][componente].idMaquina

        if (idMaquina == idMaquinaParam && idFabrica == idFabricaParam) {
          listaFiltrada.push(listaDadosPedido[i][j])
        }
      }
    }
    res.status(200).send(listaFiltrada)
    listaFiltrada = []
  } catch (erro) {
    console.error(`Erro: ${erro}`)
    res.status(500).send("Erro no servidor")
  }
}


function qtdServidoresPorFabrica(req, res) {
  const idFabrica = req.params.idFabrica

  dashMonitoramentoModel
    .qtdServidoresPorFabrica(idFabrica)
    .then((resultado) => {
      res.status(200).send(resultado)
    })
}


function filtroMedida(req, res) {
  const idMaquina = req.params.idMaquina

  dashMonitoramentoModel.filtroMedida(idMaquina)
    .then((resultado) => {
      res.status(200).send(resultado)
    })

}

let listaProcessos = []

function processosPorMaquina(req, res){
    const processos = req.body
    listaProcessos = processos
    res.status(200).send(listaProcessos)
}

function listarProcessos(req, res){
    const idMaquina = req.params.idMaquina

    try{
    res.status(200).send(listaProcessos)

    }catch (erro){
      console.error(`Erro no servidor: ${erro}`)
    }



}

module.exports = {
  obterSemana,
  dadosTempoReal,
  dadosRecebidos,
  qtdServidoresPorFabrica,
  dadosPedidoCliente,
  dadosPedidoRecebidos,
  filtroMedida,
  processosPorMaquina,
  listarProcessos
}
