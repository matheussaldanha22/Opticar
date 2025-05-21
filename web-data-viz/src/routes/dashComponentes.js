var express = require("express")
var router = express.Router()

var dashComponenteController = require("../controllers/dashComponenteController")

router.get("/obterAlertasMes/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterAlertasMes(req, res)
})

router.get("/obterTempoMtbf/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterTempoMtbf(req, res)
})


module.exports = router
