var express = require("express")
var router = express.Router()

var dashComponenteController = require("../controllers/dashComponenteController")

router.get("/obterAlertasMes/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterAlertasMes(req, res)
})

//KPI DE SOBRECARGA FALTA

router.get("/obterTempoMtbf/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterTempoMtbf(req, res)
})

router.post("/dadosGraficoUsoSemanal/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoUsoSemanal(req, res)
})


module.exports = router
