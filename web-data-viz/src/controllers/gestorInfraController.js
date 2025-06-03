var gestorInfraModel = require("../models/gestorInfraModel");


async function obterDadosComponente(req, res, tipo) {
    try {
        var dados;

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
        var Done = dados.map(item => item.DoneAlertas);
        var InProgress = dados.map(item => item.InProgressAlertas)


        res.json({ categorias, totais, toDos,Done,InProgress});
    } catch (erro) {
        console.error(`Erro ao obter dados de ${tipo}:`, erro);
        res.status(500).json({ erro: erro.message });
    }
}

async function obterServidorComMaisCriticos(req, res, tipo) {
    try {
        var servidor;

        switch (tipo) {
            case 'CPU':
                servidor = await gestorInfraModel.buscarServidorComMaisCriticosCPU();
                break;
            case 'RAM':
                servidor = await gestorInfraModel.buscarServidorComMaisCriticosRAM();
                break;
            case 'DISCO':
                servidor = await gestorInfraModel.buscarServidorComMaisCriticosDISCO();
                break;
            default:
                return res.status(400).json({ erro: 'Componente inválido' });
        }

        if (servidor.length > 0) {
            var idMaquina = servidor[0].idMaquina;
            var mensagem = `SV${idMaquina} com ${servidor[0].totalCriticos} alertas críticos (${tipo}).`;
            res.json({ mensagem });
        } else {
            res.json({ mensagem: `Nenhum servidor encontrado com alertas críticos (${tipo}).` });
        }
    } catch (erro) {
        console.error(`Erro ao obter servidor com mais alertas críticos (${tipo}):`, erro);
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    obterDadosCPU: (req, res) => obterDadosComponente(req, res, 'CPU'),
    obterDadosRAM: (req, res) => obterDadosComponente(req, res, 'RAM'),
    obterDadosDISCO: (req, res) => obterDadosComponente(req, res, 'DISCO'),
    obterServidorComMaisCriticosCPU: (req, res) => obterServidorComMaisCriticos(req, res, 'CPU'),
    obterServidorComMaisCriticosRAM: (req, res) => obterServidorComMaisCriticos(req, res, 'RAM'),
    obterServidorComMaisCriticosDISCO: (req, res) => obterServidorComMaisCriticos(req, res, 'DISCO')
};


