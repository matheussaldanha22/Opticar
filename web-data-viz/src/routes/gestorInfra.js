var express = require('express');
var router = express.Router();
var gestorInfraController = require('../controllers/gestorInfraController');

router.get('/dados-cpu', gestorInfraController.obterDadosCPU);
router.get('/dados-ram', gestorInfraController.obterDadosRAM);
router.get('/dados-disco', gestorInfraController.obterDadosDISCO);


module.exports = router;