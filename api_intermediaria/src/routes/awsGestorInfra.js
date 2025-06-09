const express = require("express");
const router = express.Router();

var { pegarS3 } = require("../controllers/awsGestorInfraController");


router.get("/pegar/:componente", pegarS3);


module.exports = router;