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

router.get("/obterMediaUso/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterMediaUso(req, res)
})

router.get("/obterTempoMtbf/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterTempoMtbf(req, res)
})

router.get("/obterTempoMtbf/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterTempoMtbf(req, res)
})

//----------GRAFICO DE USO
router.post("/dadosGraficoUsoSemanal/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoUsoSemanal(req, res)
})

router.post("/dadosGraficoUsoMensal/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoUsoMensal(req, res)
})

//---------------GRAFICO ALERTAS
router.post("/dadosGraficoAlertaMensal/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoAlertaMensal(req, res)
})

router.get("/dadosGraficoAlertaAnual/:idMaquina/:componente", function (req, res) {
  dashComponenteController.dadosGraficoAlertaAnual(req, res)
})



module.exports = router
