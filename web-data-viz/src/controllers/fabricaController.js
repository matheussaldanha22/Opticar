var fabricaModel = require("../models/fabricaModel")

function listarFabricasEmpresa(req, res) {
  var idEmpresa = req.params.idEmpresa

  console.log(`Buscando fabricas por empresa`)

  fabricaModel
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

function cadastrarGestorFabrica(req, res) {
  var idFabrica = req.body.idFabrica
  var idGestor = req.params.idGestor

  fabricaModel
    .cadastrarGestorFabrica(idGestor, idFabrica)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao atualizar o gestor.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

module.exports = {
  listarFabricasEmpresa,
  cadastrarGestorFabrica,
}
