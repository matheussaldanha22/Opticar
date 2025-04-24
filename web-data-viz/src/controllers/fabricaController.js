var medidaModel = require("../models/fabricaModel")

function buscarMedidasEmTempoReal(req, res) {
  var idAquario = req.params.idAquario

  console.log(`Recuperando medidas em tempo real`)

  medidaModel
    .buscarMedidasEmTempoReal(idAquario)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log(
        "Houve um erro ao buscar as ultimas medidas.",
        erro.sqlMessage
      )
      res.status(500).json(erro.sqlMessage)
    })
}

function listarFabricasEmpresa(req, res) {
  var idEmpresa = req.params.idEmpresa

  console.log(`Buscando fabricas por empresa`)

  medidaModel
    .listarFabricasEmpresa(idEmpresa)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar as fabricas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

module.exports = {
  listarFabricasEmpresa,
}
