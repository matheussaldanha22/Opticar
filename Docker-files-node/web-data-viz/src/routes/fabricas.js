var express = require("express")
var router = express.Router()

var fabricaController = require("../controllers/fabricaController")

router.get("/listarFabricasEmpresa/:idEmpresa", function (req, res) {
  fabricaController.listarFabricasEmpresa(req, res)
})

router.post("/cadastrar", function (req, res) {
  fabricaController.cadastrar(req, res)
})

router.get("/verificaAlertas", function (req, res) {
  fabricaController.verificaAlertas(req, res)
})

router.post("/listarFabricas", function (req, res) {
  fabricaController.listarFabricas(req, res)
})

router.post("/excluirFabrica", function (req, res) {
  fabricaController.excluirFabrica(req, res)
})

router.post("/excluirFabricaFrio", function (req, res) {
  fabricaController.excluirFabricaFrio(req, res)
})

router.post("/modalUpdate", function (req, res) {
  fabricaController.modalUpdate(req, res)
})

router.post("/updateFabrica", function (req, res) {
  fabricaController.updateFabrica(req, res)
})

module.exports = router
