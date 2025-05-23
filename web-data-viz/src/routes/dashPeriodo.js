var express = require("express")
var router = express.Router()

var dashPeriodoController = require("../controllers/dashPeriodoController")

router.get("/obterSemana/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterSemana(req,res);
})

router.get("/obterComponente/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterComponente(req,res)
})

router.get("/obterPeriodo/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterPeriodo(req,res)
})

router.get("/obterDia/:idFabrica/:ano/:mes", function (req,res) {
    dashPeriodoController.obterDia(req,res)
})

module.exports = router;