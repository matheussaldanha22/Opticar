var express = require("express")
var router = express.Router()

var usuarioController = require("../controllers/usuarioController")

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
  usuarioController.cadastrar(req, res)
})

router.post("/autenticar", function (req, res) {
  usuarioController.autenticar(req, res)
})

router.get("/listarPorId/:idUsuario", (req, res) => {
  usuarioController.listarPorId(req, res)
})

router.get("/listarPorEmpresa/:idEmpresa", (req, res) => {
  usuarioController.listarPorEmpresa(req, res)
})

router.get("/listarPorFabrica/:idFabrica", (req, res) => {
  usuarioController.listarPorFabrica(req, res)
})

router.put("/atualizarUsuario", (req, res) => {
  usuarioController.atualizarUsuario(req, res)
})

router.put("/atualizarUsuarioFabrica", (req, res) => {
  usuarioController.atualizarUsuarioFabrica(req, res)
})

module.exports = router
