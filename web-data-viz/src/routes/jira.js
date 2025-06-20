var express = require("express")
var router = express.Router()

var jiraController = require("../controllers/jiraController")

router.get("/listarAlertas", function (req, res) {
 jiraController.listarAlertas(req, res)
})

router.get("/listarAlertasPorId/:idFabrica", function (req, res) {
 jiraController.listarAlertasPorId(req, res)
})



module.exports = router