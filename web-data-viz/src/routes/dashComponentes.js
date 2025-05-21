var express = require("express")
var router = express.Router()

var dashComponenteController = require("../controllers/dashComponenteController")

router.get("/obterAlertasMes/:idMaquina/:componente", function (req, res) {
  dashComponenteController.obterAlertasMes(req, res)
})


module.exports = router
