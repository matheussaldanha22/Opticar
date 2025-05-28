var gestorInfraModel = require("../models/gestorInfraModel");

async function obterDadosCPU(req, res) {
    try {
        var dados = await gestorInfraModel.buscarAlertasCPU();

        // Extrai as categorias (datas) e os dados já agregados
        var categorias = dados.map(item => item.dataAlerta.toISOString().slice(0, 10));
        var totais = dados.map(item => item.totalAlertas);
        var toDos = dados.map(item => item.toDoAlertas);

        res.json({
            categorias,
            totais,
            toDos
        });
    } catch (erro) {
        console.error("Erro ao obter dados CPU:", erro);
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    obterDadosCPU
};