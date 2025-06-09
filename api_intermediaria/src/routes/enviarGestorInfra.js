const express = require("express");
const multer = require("multer");
var router = express.Router();

var upload = multer(); // processa arquivos multipart
var enviarGestorInfraController = require("../controllers/enviarGestorInfraController");

// POST /upload/enviar
router.post("/enviar", upload.single("arquivo"), enviarGestorInfraController.enviarParaS3);

module.exports = router;