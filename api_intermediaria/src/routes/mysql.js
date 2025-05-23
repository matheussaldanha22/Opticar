var express = require("express")
var router = express.Router()

var mysqlController = require("../controllers/mysqlController")

router.post("/pedidosCliente", function (req, res) {
  mysqlController.pedidosCliente(req, res)
})

router.post("/dadosCapturados", function (req, res) {
  mysqlController.dadosCapturados(req, res)
})

module.exports = router