var express = require("express");
var router = express.Router();

var listadeservidoresController = require("../controllers/listadeservidoresController");

// GET - listar todos os servidores
router.post("/carregarServidores", function (req, res) {
  listadeservidoresController.carregarServidores(req, res);
});

router.delete("/excluirServidor/:id", function (req, res) {
  listadeservidoresController.excluirServidor(req, res);
});

router.delete("/excluirServidorFrio/:id", function (req, res) {
  listadeservidoresController.excluirServidorFrio(req, res);
});

router.post("/cadastrar", function (req, res) {
  listadeservidoresController.cadastrar(req, res)
})

router.post("/cadastrarFRIO", function (req, res) {
  listadeservidoresController.cadastrarFRIO(req, res)
})

router.post("/modalUpdate", function (req, res) {
  listadeservidoresController.modalUpdate(req, res)
})

router.post("/updateServidor", function (req, res) {
  listadeservidoresController.updateServidor(req, res)
})

router.post("/updateServidorFRIO", function (req, res) {
  listadeservidoresController.updateServidorFRIO(req, res)
})

module.exports = router;