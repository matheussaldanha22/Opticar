var dashComponenteModel = require("../models/dashComponenteModel")

function obterAlertasMes(req, res) {
    var idMaquina = req.params.idMaquina
    var componente = req.params.componente

    console.log(`Buscando fabricas por empresa`)

  dashComponenteModel
    .obterAlertasMes(idMaquina,componente)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
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
    obterAlertasMes
}