var mysqlModel = require("../models/mysqlModel");

function pedidosCliente(req, res) {
    var macAddress = req.body.mac_address;

    if (!macAddress) {  // Aqui verificamos se o campo NÃO existe ou está vazio
        return res.status(400).json({ mensagem: "macAddress não encontrado" });
    }

    mysqlModel.pedidosCliente(macAddress).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Não foi encontrado nenhum pedido");
        }
    }).catch((erro) => {
        console.error(erro);
        console.log("Houve um erro ao buscar os pedidos.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function dadosCapturados(req, res) {
    // Validando os dados recebidos
    var dados = req.body.valor; 
    var idcomponenteServidor = req.body.idPedido;

    if (!dados || !idcomponenteServidor) {
        return res.status(400).json({ mensagem: "Dados ou ID do componente não fornecidos" });
    }

    mysqlModel.dadosCapturados(dados, idcomponenteServidor).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(404).json({ mensagem: "Nenhum dado encontrado para o componente informado" });
        }
    }).catch((erro) => {
        console.error("Erro ao capturar os dados:", erro);
        res.status(500).json({ erro: erro.message || "Erro desconhecido no servidor" });
    });
}

module.exports = {
  pedidosCliente,
  dadosCapturados
};
