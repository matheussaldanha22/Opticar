var express = require("express");
var router = express.Router();

var componenteController = require("../controllers/componenteController");

router.post("/listarComponente", function (req, res) {
    componenteController.listar(req, res);
})

router.get("/listarTipo", function (req, res) {
    componenteController.listarTipo(req, res);
});

router.post("/listarMedida", function (req, res) {
    componenteController.listarMedida(req, res);
})

router.post("/cadastrar", function (req, res) {
    componenteController.cadastrar(req,res);
})

router.post("/verificar", function (req, res) {
    componenteController.verificar(req,res);
})

router.get("/listarComponentes", function (req, res) {
    componenteController.listarComponentes(req,res);
})

router.post("/excluirComponente", function (req, res) {
    componenteController.excluirComponente(req, res)
})



module.exports = router;