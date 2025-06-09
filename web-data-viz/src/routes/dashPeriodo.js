var express = require("express")
var router = express.Router()

var dashPeriodoController = require("../controllers/dashPeriodoController")

router.get("/obterSemana/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterSemana(req,res);
})

router.get("/obterComponente/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterComponente(req,res)
})

router.get("/obterPeriodo/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterPeriodo(req,res)
})

router.get("/obterDia/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterDia(req,res)
})

router.get("/tabelaProcesso/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.tabelaProcesso(req,res)
})

router.get("/alertasPeriodo/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.alertasPeriodo(req,res)
})

router.get("/servidorDados/:idFabrica/:idServidor/:ano/:mes", function (req,res) {
    dashPeriodoController.servidorDados(req,res)
})

router.get("/tabelaServidor/:idFabrica/:idServidor/:ano/:mes", function (req, res) {
    dashPeriodoController.tabelaServidor(req,res)
})

router.get("/alertaServidor/:idFabrica/:idServidor/:ano/:mes", function (req, res) {
    dashPeriodoController.alertaServidor(req,res)
})

router.get("/diaServidor/:idFabrica/:idServidor/:ano/:mes", function (req, res) {
    dashPeriodoController.diaServidor(req,res)
})

router.get("/periodoServer/:idFabrica/:idServidor/:ano/:mes", function (req, res) {
    dashPeriodoController.periodoServer(req,res)
})

router.get("/componenteServer/:idFabrica/:idServidor/:ano/:mes", function (req, res) {
    dashPeriodoController.componenteServer(req,res)
})

router.get("/semanaServer/:idFabrica/:idServidor/:ano/:mes", function (req, res) {
    dashPeriodoController.semanaServer(req,res)
})

router.get("/diaComp/:idFabrica/:ano/:mes/:dia", function (req,res) {
    dashPeriodoController.diaComp(req,res)
})

router.get("/periodoDia/:idFabrica/:ano/:mes/:dia", function (req,res) {
    dashPeriodoController.periodoDia(req,res)
})

router.get("/diaGrafico/:idFabrica/:ano/:mes/:dia", function (req,res) {
    dashPeriodoController.diaGrafico(req,res)
})

router.get("/diaProcesso/:idFabrica/:ano/:mes/:dia", function (req,res) {
    dashPeriodoController.diaProcesso(req,res)
})

router.get("/diaServerComp/:idFabrica/:idServidor/:ano/:mes/:dia", function (req,res) {
    dashPeriodoController.diaServerComp(req,res)
})

router.get("/diaServerPeriodo/:idFabrica/:idServidor/:ano/:mes/:dia", function (req,res) {
    dashPeriodoController.diaServerPeriodo(req,res)
})

router.get("/diaServerGrafico/:idFabrica/:idServidor/:ano/:mes/:dia", function (req,res) {
    dashPeriodoController.diaServerGrafico(req,res)
})
    
router.get("/diaServerProcesso/:idFabrica/:idServidor/:ano/:mes/:dia", function (req,res) {
    dashPeriodoController.diaServerProcesso(req,res)
})
    
router.get("/dadosComponentes/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.dadosComponentes(req,res)
})

module.exports = router;