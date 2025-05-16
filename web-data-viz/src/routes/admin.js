var express = require("express")
var router = express.Router()

var adminController = require("../controllers/adminController")

router.get("/dadosGraficoAlerta", function (req, res) {
  adminController.dadosGraficoAlerta(req, res)
})

router.get("/dadosFabrica", function (req, res) {
  adminController.dadosFabrica(req, res)
})

router.post("/informacaoFabrica", function (req, res) {
  adminController.informacaoFabrica(req, res)
})

module.exports = router