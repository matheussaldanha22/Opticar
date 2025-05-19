var express = require("express")
var router = express.Router()

var alertaController = require("../controllers/alertaController")

router.get("/listar", function (req, res) {
  alertaController.listarAlertas(req, res)
})

router.get("/listarMes", function(req,res){
  alertaController.listarMes(req,res)
})

module.exports = router
