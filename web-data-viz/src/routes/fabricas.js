var express = require("express")
var router = express.Router()

var fabricaController = require("../controllers/fabricaController")

router.get("/listarFabricasEmpresa/:idEmpresa", function (req, res) {
  fabricaController.listarFabricasEmpresa(req, res)
})

module.exports = router
