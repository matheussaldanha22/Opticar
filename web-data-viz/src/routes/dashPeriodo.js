var express = require("express")
var router = express.Router()

var dashPeriodoController = require("../controllers/dashPeriodoController")

router.get("/obterSemana/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterSemana(req,res);
})

module.exports = router;