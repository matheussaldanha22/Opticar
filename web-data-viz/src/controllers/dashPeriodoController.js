var dashComponenteModel = require("../models/dashPeriodoModel")

function obterSemana(req,res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashComponenteModel.obterSemana(idFabrica, ano, mes).then((resultado) =>{
        res.status(200).send(resultado)
    })
    
}

function obterComponente(req, res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashComponenteModel.obterComponente(idFabrica, ano, mes).then((resultado) => {
        res.status(200).send(resultado)
    })
}

function obterPeriodo(req,res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashComponenteModel.obterPeriodo(idFabrica, ano, mes).then((resultado) =>{
        
        res.status(200).send(resultado)
    })
}

function obterDia(req,res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashComponenteModel.obterDia(idFabrica, ano, mes).then((resultado) => {
        res.status(200).send(resultado)
    })
}

function alertasPeriodo(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;

    dashComponenteModel.alertasPeriodo(idFabrica, ano, mes).then((resultado) => {
        res.status(200).send(resultado)
    })
}

module.exports ={
    obterSemana,
    obterComponente,
    obterPeriodo,
    obterDia,
    alertasPeriodo
    
}

