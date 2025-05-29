var express = require("express")
var router = express.Router()

var dashMonitoramentoController = require("../controllers/dashMonitoramentoController")

router.get("/obterParametrosComponente/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterParametrosComponente(req, res)
})

router.post("/dadosTempoReal", (req, res) =>{
    dashMonitoramentoController.dadosTempoReal(req, res)
})


module.exports = router
