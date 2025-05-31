var dashMonitoramentoModel = require("../models/dashMonitoramentoModel")

function obterSemana(req,res) {
    var ano = req.params.ano
    var mes = req.params.mes
    var idFabrica = req.params.idFabrica

    const dados = req.body

    dash

    dashComponenteModel.obterSemana(idFabrica, ano, mes).then((resultado) =>{
        res.status(200).send(resultado)
    })
    
}

let listaDados = []

function dadosTempoReal(req, res) {
    const dados = req.body
    listaDados.push(dados)

    console.log(`Dados recebidos do Python: ${JSON.stringify(dados)}`)
    try{
    res.status(200).json({ mensagem: "Dados recebidos com sucesso" });

    }catch(error){
        console.error("Erro ao processar dados:", error);
        res.status(500).json({ mensagem: "Erro interno no servidor" });
    }

}

function dadosRecebidos(req, res){
    res.status(200).send(listaDados)

}

module.exports ={
    obterSemana,
    dadosTempoReal,
    dadosRecebidos
    
}

