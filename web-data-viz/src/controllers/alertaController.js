var alertaModel = require("../models/alertaModel")

function listarAlertas(req, res) {
  alertaModel.listarAlertas()
    .then((resultado) => {
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

function listarMes(req,res){
    alertaModel.listarMes().then((resultado)=>{
      res.status(200).send(resultado)
    })
}

module.exports = {
  listarAlertas,
  listarMes
}
