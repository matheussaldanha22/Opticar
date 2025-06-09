var express = require("express")
var router = express.Router()
const multer = require('multer');
const upload = multer();

var awsController = require("../controllers/awsController")

router.post("/dadosS3", function (req, res) {
  awsController.dadosBucket(req, res)
});

router.get("/pegarS3/:ano/:mes", function (req,res) {
  awsController.pegarS3(req,res)
});

router.post("/relatorioClient", upload.single('relatorioCliente'), function (req, res) {
  awsController.relatorioClient(req, res);
});

router.get("/visualizarHistorico/:pasta", function(req, res) {
  awsController.visualizarHistorico(req,res)
});

router.get("/baixarHistorico/:relatorioNome/:pasta", function(req, res) {
  awsController.baixarHistorico(req, res)
});

module.exports = router