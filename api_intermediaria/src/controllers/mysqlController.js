var mysqlModel = require("../models/mysqlModel");

function cadMaqFrio(req, res) {
    var so = req.body.so; 
    var ip_publico = req.body.ip_publico;
    var hostname = req.body.hostname;
    var mac = req.body.mac
    var fabrica = req.body.fabrica

    if (!so || !ip_publico || !hostname || !mac || !fabrica) {
        return res.status(400).json({ mensagem: "Dados não fornecidos" });
    }

    mysqlModel.cadMaqFrio(so, ip_publico, hostname, mac, fabrica).then((resultado) => {
        res.status(200).json(resultado);
    }).catch((erro) => {
        console.error("Erro ao cadastrar maquina fria:", erro);
        res.status(500).json({ erro: erro.message});
    });
}

function cardapio(req, res) {
    mysqlModel.cardapio().then((resultado) => {
        res.status(200).json(resultado)
    }).catch((erro) => {
        console.error("Erro ao pegar o cardapio:", erro);
        res.status(500).json({erro: erro.message})
    })
}

function obterServidor(req, res) {
    var mac = req.params.mac

    if (!mac) {
        return res.status(400).json({mensagem: "Bad Request: Dados fornecidos erroneamente"})
    }
    
    mysqlModel.obterServidor(mac).then((resultado) => {
        res.status(200).json(resultado)
    }).catch((erro) => {
        console.error("Erro ao pegar o cardapio:", erro);
        res.status(500).json({erro: erro.message})
    })
}

function pedidosObrigatorios(req, res) {
    var valor = req.body.valor
    var servidor = req.body.mac
    
    mysqlModel.pedidosObrigatorios(valor, servidor).then((resultado) => {
        pedidosObrigatoriosQuente(valor, servidor)
        res.status(200).json(resultado)
    }).catch((erro) => {
        console.error("Erro ao inserir pedidoFrio:", erro);
        res.status(500).json({erro: erro.message})
    })
}

function pedidosObrigatoriosQuente(valor, servidor) {
    mysqlModel.pedidosObrigatoriosQuente(valor, servidor).then((resultado) => {
        console.log(resultado)
    }).catch((erro) => {
        console.error("Erro ao inserir pedidoQuente:", erro)
    })
}

function cadMaqQuente(req, res) {
    var so = req.body.so; 
    var ip_publico = req.body.ip_publico;
    var hostname = req.body.hostname;
    var mac = req.body.mac
    var fabrica = req.body.fabrica

    if (!so || !ip_publico || !hostname || !mac || !fabrica) {
        return res.status(400).json({ mensagem: "Dados não fornecidos" });
    }

    mysqlModel.cadMaqQuente(so, ip_publico, hostname, mac, fabrica).then((resultado) => {
        res.status(200).json(resultado);
    }).catch((erro) => {
        console.error("Erro ao cadastrar maquina quente:", erro);
        res.status(500).json({ erro: erro.message});
    });
}

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
        res.status(500).json({ erro: erro.message});
    });
}

function verificarIP(req, res) {
    var mac_address = req.body.mac_address

    if(!mac_address) {
        return res.status(400).json({mensagem: "mac_address não encontrado"})
    }

    mysqlModel.verificarIP(mac_address).then((resultado) => {
        res.status(200).json(resultado);
    }).catch((erro) => {
        console.error("Erro ao verificar IP:", erro);
        res.status(500).json({erro: erro.message})
    })
}

function updateIP(req, res) {
    var mac_address = req.body.mac_address;
    var ip = req.body.ip;

    if(!mac_address || !ip) {
        return res.status(400).json({mensagem: "Dados não encontrados"})
    }

    mysqlModel.updateIP(mac_address, ip).then((resultado) => {
        res.status(200).json({
            mensagem: "Update realizado com sucesso",
            resultado: resultado
        });
    }).catch((erro) => {
        console.error("Erro ao realizar update:", erro);
        res.status(500).json({ erro: erro.message});
    })
}

function updateIPFRIO(req, res) {
    var mac_address = req.body.mac_address;
    var ip = req.body.ip;

    if(!mac_address || !ip) {
        return res.status(400).json({mensagem: "Dados não encontrados"})
    }

    mysqlModel.updateIPFRIO(mac_address, ip).then((resultado) => {
        res.status(200).json({
            mensagem: "Update realizado com sucesso",
            resultado: resultado
        });
    }).catch((erro) => {
        console.error("Erro ao realizar update:", erro);
        res.status(500).json({ erro: erro.message});
    })
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
        res.status(500).json({ erro: erro.message});
    });
}

function processoCliente(req, res) {
    var mac = req.params.mac_address

    if (mac == null || mac === undefined) {
        return res.status(400).json({mensagem: "Bad Request: Dados fornecidos erroneamente"})
    }
    mysqlModel.processoCliente(mac).then((resultado) => {
        res.status(200).json(resultado)
    }).catch((erro) => {
        console.error("Erro ao pegar os processos:", erro);
        res.status(500).json({erro: erro.message})
    })
}

function excluirProcesso(req, res) {
    var mac = req.params.macAddress;
    var pid = req.params.pid;
    var idProcesso = req.params.idProcesso;

    if (!idProcesso) {
        return res.status(400).json({mensagem: "Bad Request: Dados fornecidos erroneamente"})
    }
    mysqlModel.excluirProcesso(idProcesso, pid, mac).then((resultado) => {
        res.status(200).json({
            mensagem: "Processo excluído com sucesso",
            resultado: resultado
        })
    }).catch((erro) => {
        console.error("Erro ao excluir processo:", erro);
        res.status(500).json({ erro: erro.message })
    })
}

module.exports = {
  pedidosCliente,
  dadosCapturados,
  inserirAlerta,
  verificarIP,
  updateIP,
  updateIPFRIO,
  cadMaqFrio,
  cadMaqQuente,
  cardapio,
  obterServidor,
  pedidosObrigatorios,
  processoCliente,
  excluirProcesso
};
