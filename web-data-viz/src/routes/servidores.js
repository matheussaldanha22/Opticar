var express = require("express")
var router = express.Router()

var servidorController = require("../controllers/servidorController")

router.get("/:empresaId", function (req, res) {
  servidorController.buscarServidorPorEmpresa(req, res)
})

module.exports = router
