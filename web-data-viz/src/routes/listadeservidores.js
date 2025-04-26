var express = require("express");
var router = express.Router();

var listadeservidoresController = require("../controllers/listadeservidoresController");

// GET - listar todos os servidores
router.get("/carregarServidores", function (req, res) {
  listadeservidoresController.carregarServidores(req, res);
});

router.delete("/excluirServidor/:id", function (req, res) {
  listadeservidoresController.excluirServidor(req, res);
});

module.exports = router;