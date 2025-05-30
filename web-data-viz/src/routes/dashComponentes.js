var express = require("express")
var router = express.Router()

var dashComponenteController = require("../controllers/dashComponenteController")

//----------parametro do componente selecionado
router.get("/obterParametrosComponente/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterParametrosComponente(req, res)
})

//--------------POPULAR SELECTS
router.get("/obterAnosDisponiveis/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterAnosDisponiveis(req, res)
})

router.get("/obterMesesDisponiveis/:idMaquina/:componente/:ano", function (req, res) {
  dashComponenteController.obterMesesDisponiveis(req, res)
})

//------------KPIS
router.get("/obterAlertasMes/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterAlertasMes(req, res)
})

//KPI DE SOBRECARGA FALTA

router.get("/obterTempoMtbf/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterTempoMtbf(req, res)
})

//----------grafico de uso
router.post("/dadosGraficoUsoSemanal/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoUsoSemanal(req, res)
})

router.post("/dadosGraficoUsoAnual/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoUsoAnual(req, res)
})

//---------------grafico alertas
router.post("/dadosGraficoAlertaAnual/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoAlertaAnual(req, res)
})

router.get("/dadosGraficoAlertaGeral/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoAlertaGeral(req, res)
})


module.exports = router
