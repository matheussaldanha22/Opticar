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

module.exports ={
    obterSemana,
    obterComponente
}

