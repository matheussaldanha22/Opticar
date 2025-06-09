var dashPeriodoModel = require("../models/dashPeriodoModel")

function obterSemana(req,res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashPeriodoModel.obterSemana(idFabrica, ano, mes).then((resultado) =>{
        res.status(200).send(resultado)
    })
    
}

function obterComponente(req, res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashPeriodoModel.obterComponente(idFabrica, ano, mes).then((resultado) => {
        res.status(200).send(resultado)
    })
}

function obterPeriodo(req,res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashPeriodoModel.obterPeriodo(idFabrica, ano, mes).then((resultado) =>{
        
        res.status(200).send(resultado)
    })
}

function obterDia(req,res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashPeriodoModel.obterDia(idFabrica, ano, mes).then((resultado) => {
        res.status(200).send(resultado)
    })
}

function alertasPeriodo(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;

    dashPeriodoModel.alertasPeriodo(idFabrica, ano, mes).then((resultado) => {
        res.status(200).send(resultado)
    })
}

function tabelaProcesso(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;

    dashPeriodoModel.tabelaProcesso(idFabrica, ano, mes).then((resultado) => {
        res.status(200).send(resultado)
    })
}

function servidorDados(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;
    var idServidor = req.params.idServidor;

    dashPeriodoModel.servidorGrafico(idFabrica, idServidor, ano, mes).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function tabelaServidor(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;
    var idServidor = req.params.idServidor;

    dashPeriodoModel.tabelaServidor(idFabrica, idServidor, ano, mes).then((resultado)=>{
        res.status(200).send(resultado)
    })
}



function diaServidor(req,res) {
     var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;
    var idServidor = req.params.idServidor;

    dashPeriodoModel.diaServidor(idFabrica, idServidor,ano,mes).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function periodoServer(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;
    var idServidor = req.params.idServidor;

    dashPeriodoModel.periodoServer(idFabrica, idServidor,ano,mes).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function componenteServer(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;
    var idServidor = req.params.idServidor;

    dashPeriodoModel.componenteServer(idFabrica, idServidor,ano,mes).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function semanaServer(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var idFabrica = req.params.idFabrica;
    var idServidor = req.params.idServidor;

    dashPeriodoModel.semanaServer(idFabrica, idServidor,ano,mes).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function diaComp(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var dia = req.params.dia
    var idFabrica = req.params.idFabrica;
 
    dashPeriodoModel.diaComp(idFabrica, ano, mes,dia).then((resultado)=>{
        res.status(200).send(resultado)
    })
}


function periodoDia(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var dia = req.params.dia
    var idFabrica = req.params.idFabrica;
 
    dashPeriodoModel.periodoDia(idFabrica, ano, mes,dia).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function diaGrafico(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var dia = req.params.dia
    var idFabrica = req.params.idFabrica;
 
    dashPeriodoModel.diaGrafico(idFabrica, ano, mes,dia).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function diaProcesso(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes;
    var dia = req.params.dia
    var idFabrica = req.params.idFabrica;
 
    dashPeriodoModel.diaProcesso(idFabrica, ano, mes,dia).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function diaServerComp(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes
    var dia = req.params.dia
    var idFabrica = req.params.idFabrica
    var idMaquina = req.params.idServidor

    dashPeriodoModel.diaServerComp(idFabrica, idMaquina, ano, mes,dia).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function diaServerPeriodo(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes
    var dia = req.params.dia
    var idFabrica = req.params.idFabrica
    var idMaquina = req.params.idServidor

    dashPeriodoModel.diaServerPeriodo(idFabrica, idMaquina, ano, mes,dia).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function diaServerGrafico(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes
    var dia = req.params.dia
    var idFabrica = req.params.idFabrica
    var idMaquina = req.params.idServidor

    dashPeriodoModel.diaServerGrafico(idFabrica, idMaquina, ano, mes,dia).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function diaServerProcesso(req,res) {
    var ano = req.params.ano;
    var mes = req.params.mes
    var dia = req.params.dia
    var idFabrica = req.params.idFabrica
    var idMaquina = req.params.idServidor

    dashPeriodoModel.diaServerProcesso(idFabrica, idMaquina, ano, mes,dia).then((resultado)=>{
        res.status(200).send(resultado)
    })
}

function dadosComponentes(req,res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    dashPeriodoModel.dadosComponentes(ano,mes,idFabrica).then((resultado) =>{
        res.status(200).send(resultado)
    })
}


module.exports ={
    obterSemana,
    obterComponente,
    obterPeriodo,
    obterDia,
    tabelaProcesso,
    servidorDados,
    tabelaServidor,
    diaServidor,
    periodoServer,
    componenteServer,
    semanaServer,
    alertasPeriodo,
    diaComp,
    periodoDia,
    diaGrafico,
    diaProcesso,
    diaServerComp,
    diaServerPeriodo,
    diaServerGrafico,
    diaServerProcesso,
    dadosComponentes
    
}

