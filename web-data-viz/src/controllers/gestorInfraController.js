var gestorInfraModel = require("../models/gestorInfraModel");

async function obterDadosComponente(req, res, tipo) {
    try {
        let dados;

        switch (tipo) {
            case 'CPU':
                dados = await gestorInfraModel.buscarAlertasCPU();
                break;
            case 'RAM':
                dados = await gestorInfraModel.buscarAlertasRAM();
                break;
            case 'DISCO':
                dados = await gestorInfraModel.buscarAlertasDISCO();
                break;
            default:
                return res.status(400).json({ erro: 'Componente inválido' });
        }

        var categorias = dados.map(item => {
        var [ano, mes, dia] = item.dataAlerta.split("-");
    return `${dia}/${mes}`;
            });
            
        var totais = dados.map(item => item.totalAlertas);
        var toDos = dados.map(item => item.toDoAlertas);

        res.json({ categorias, totais, toDos });

    } catch (erro) {
        console.error(`Erro ao obter dados de ${tipo}:`, erro);
        res.status(500).json({ erro: erro.message });
    }
}

// puxando separado
module.exports = {
    obterDadosCPU: (req, res) => obterDadosComponente(req, res, 'CPU'),
    obterDadosRAM: (req, res) => obterDadosComponente(req, res, 'RAM'),
    obterDadosDISCO: (req, res) => obterDadosComponente(req, res, 'DISCO'),
    obterDadosREDE: (req, res) => obterDadosComponente(req, res, 'REDE')
};