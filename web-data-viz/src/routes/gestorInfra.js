var express = require('express');
var router = express.Router();
var gestorInfraController = require('../controllers/gestorInfraController');

router.get('/dados-cpu', gestorInfraController.obterDadosCPU);
router.get('/dados-ram', gestorInfraController.obterDadosRAM);
router.get('/dados-disco', gestorInfraController.obterDadosDISCO);
router.get('/servidor-com-mais-criticos/cpu', gestorInfraController.obterServidorComMaisCriticosCPU);
router.get('/servidor-com-mais-criticos/ram', gestorInfraController.obterServidorComMaisCriticosRAM);
router.get('/servidor-com-mais-criticos/disco', gestorInfraController.obterServidorComMaisCriticosDISCO);



module.exports = router;