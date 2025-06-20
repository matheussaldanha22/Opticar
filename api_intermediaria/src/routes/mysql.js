var express = require("express")
var router = express.Router()

var mysqlController = require("../controllers/mysqlController")

router.post("/pedidosCliente", function (req, res) {
  mysqlController.pedidosCliente(req, res)
})

router.get("/cardapio", function (req, res) {
  mysqlController.cardapio(req, res)
})

router.get("/obterServidor/:mac", function (req, res) {
  mysqlController.obterServidor(req, res)
})

router.post("/pedidosObrigatorios", function (req, res) {
  mysqlController.pedidosObrigatorios(req, res)
})

router.post("/cadMaqFrio", function (req, res) {
  mysqlController.cadMaqFrio(req, res)
})

router.post("/cadMaqQuente", function (req, res) {
  mysqlController.cadMaqQuente(req, res)
})

router.post("/dadosCapturados", function (req, res) {
  mysqlController.dadosCapturados(req, res)
})

router.post("/inserirAlerta", function (req, res) {
  mysqlController.inserirAlerta(req, res)
})

router.post("/verificarIP", function (req, res) {
  mysqlController.verificarIP(req, res)
})

router.post("/updateIP", function (req, res) {
  mysqlController.updateIP(req, res)
})

router.post("/updateIPFRIO", function (req, res) {
  mysqlController.updateIPFRIO(req, res)
})

router.get("/processoCliente/:mac_address", function (req, res) {
  mysqlController.processoCliente(req, res)
})

router.delete(`/excluirProcesso/:mac_address/:idProcesso/:pid`, function (req, res) {
  mysqlController.excluirProcesso(req, res)
})

module.exports = router