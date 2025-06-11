var express = require("express")
var router = express.Router()

var dashMonitoramentoController = require("../controllers/dashMonitoramentoController")

router.get(
  "/obterParametrosComponente/:idMaquina/:componente",
  function (req, res) {
    dashComponenteController.obterParametrosComponente(req, res)
  }
)

router.post("/dadosTempoReal", (req, res) => {
  dashMonitoramentoController.dadosTempoReal(req, res)
})

router.get("/dadosRecebidos/:idFabrica", (req, res) => {
  dashMonitoramentoController.dadosRecebidos(req, res)
})

router.get("/qtdServidoresPorFabrica/:idFabrica", (req, res) => {
  dashMonitoramentoController.qtdServidoresPorFabrica(req, res)
})

router.post("/dadosPedidoCliente", (req, res) => {
  dashMonitoramentoController.dadosPedidoCliente(req, res)
})

router.get("/dadosPedidoRecebidos/:idFabrica/:idMaquina", (req, res) => {
  dashMonitoramentoController.dadosPedidoRecebidos(req, res)
})


router.post("/processosPorMaquina", (req, res) =>{
  dashMonitoramentoController.processosPorMaquina(req, res)
})

router.get("/listarProcessos/:idMaquina", (req, res) =>{
  dashMonitoramentoController.listarProcessos(req, res)
})

router.get("/filtroMedida/:idMaquina", (req, res) =>{
  dashMonitoramentoController.filtroMedida(req, res)
})

router.post("/inserirProcesso", (req,res) =>{
  dashMonitoramentoController.inserirProcesso(req, res)
})

module.exports = router
