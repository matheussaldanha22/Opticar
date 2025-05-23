var express = require("express")
var router = express.Router()

var adminController = require("../controllers/adminController")

router.get("/dadosGraficoAlerta", function (req, res) {
  adminController.dadosGraficoAlerta(req, res)
})

router.get("/dadosFabrica", function (req, res) {
  adminController.dadosFabrica(req, res)
})

router.get("/dadosFabricaModal", function (req, res) {
  adminController.dadosFabricaModal(req, res)
})

router.post("/informacaoFabrica", function (req, res) {
  adminController.informacaoFabrica(req, res)
})

router.post("/informacaoFabricaPadrao", function (req, res) {
  adminController.informacaoFabricaPadrao(req, res)
})

router.get("/dadosFabricaSelecionada/:idFabrica", function (req, res) {
  adminController.dadosFabricaSelecionada(req, res)
})

router.get("/mtbf/:idFabrica", function (req, res) {
  adminController.mtbf(req, res)
})

module.exports = router