var express = require("express");
var router = express.Router();

var componenteController = require("../controllers/componenteController");

router.get("/listarTipo", function (req, res) {
    componenteController.listarTipo(req, res);
});

router.post("/listarMedida", function (req, res) {
    componenteController.listarMedida(req, res);
})

router.post("/cadastrar", function (req, res) {
    componenteController.cadastrar(req,res);
})

router.post("/cadastrarFrio", function (req, res) {
    componenteController.cadastrarFrio(req,res);
})

router.post("/modalUpdate", function (req, res) {
    componenteController.modalUpdate(req,res);
})

router.post("/updatePedido", function (req, res) {
    componenteController.updatePedido(req,res);
})

router.post("/updatePedidoQuente", function (req, res) {
    componenteController.updatePedidoQuente(req,res);
})

router.post("/verificar", function (req, res) {
    componenteController.verificar(req,res);
})

router.post("/listarComponentes", function (req, res) {
    componenteController.listarComponentes(req,res);
})

router.post("/excluirComponente", function (req, res) {
    componenteController.excluirComponente(req, res)
})

router.post("/excluirComponenteFrio", function (req, res) {
    componenteController.excluirComponenteFrio(req, res)
})



module.exports = router;