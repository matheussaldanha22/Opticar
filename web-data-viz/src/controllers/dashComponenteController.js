var dashComponenteModel = require("../models/dashComponenteModel")

function obterAlertasMes(req, res) {
    var idMaquina = req.params.idMaquina
    var componente = req.params.componente

  dashComponenteModel
    .obterAlertasMes(idMaquina,componente)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0])
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })

}

function obterTempoMtbf(req, res) {
    var idMaquina = req.params.idMaquina
    var componente = req.params.componente

  dashComponenteModel
    .obterTempoMtbf(idMaquina,componente)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0])
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })

}





module.exports = {
    obterAlertasMes,
    obterTempoMtbf
}