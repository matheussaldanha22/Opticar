var express = require('express');
var router = express.Router();
var gestorInfraController = require('../controllers/gestorInfraController');

router.get('/dados-cpu', function (req, res) {
    gestorInfraController.obterDadosCPU(req, res);
});

module.exports = router;