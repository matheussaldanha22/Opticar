var mysqlModel = require("../models/mysqlModel");

function pedidosCliente(req, res) {
    var macAddress = req.body.mac_address;

    if (!macAddress) {  
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
    var dados = req.body.valor; 
    var idcomponenteServidor = req.body.idPedido;

    if (!dados || !idcomponenteServidor) {
        return res.status(400).json({ mensagem: "Dados ou ID do componente não fornecidos" });
    }

    mysqlModel.dadosCapturados(dados, idcomponenteServidor).then((resultado) => {
            res.status(200).json(resultado);
    }).catch((erro) => {
        console.error("Erro ao capturar os dados:", erro);
        res.status(500).json({ erro: erro.message || "Erro desconhecido no servidor" });
    });
}

function inserirAlerta(req, res) {
    var valor = req.body.valor;
    var titulo = req.body.titulo;
    var prioridadeAlerta = req.body.prioridadeAlerta;
    var descricaoAlerta = req.body.descricaoAlerta;
    var statusAlerta = req.body.statusAlerta;
    var tipo_incidente = req.body.tipo_incidente;
    var fkPedido = req.body.fkPedido;
    var componente = req.body.componente;
    var processo = req.body.processo;
    var processoCPU = req.body.processoCPU;
    var processoRAM = req.body.processoRAM;
    var processoDISCO = req.body.processoDISCO;

    if (!valor || !titulo || !fkPedido) {
        return res.status(400).json({ mensagem: "Dados obrigatórios não fornecidos" });
    }

    mysqlModel.inserirAlerta(
        valor, 
        titulo, 
        prioridadeAlerta, 
        descricaoAlerta, 
        statusAlerta, 
        tipo_incidente, 
        fkPedido, 
        componente, 
        processo, 
        processoCPU, 
        processoRAM, 
        processoDISCO
    ).then((resultado) => {
        res.status(200).json({ 
            mensagem: "Alerta inserido com sucesso",
            resultado: resultado 
        });
    }).catch((erro) => {
        console.error("Erro ao inserir alerta:", erro);
        res.status(500).json({ erro: erro.message || "Erro desconhecido no servidor" });
    });
}



module.exports = {
  pedidosCliente,
  dadosCapturados,
  inserirAlerta
};
