var componenteModel = require("../models/componenteModel");

function listarComponente(req, res) {
    var fkEmpresa = req.body.fkEmpresa;
    if (fkEmpresa == undefined) {
        res.status(400).send("Algum parametro está undefined!");
      } else {
    plantModel.listarPlant(fkEmpresa).then((resultado) => {
      res.status(200).json(resultado);
    });
    
    console.log('TO NO CONTROLLER');
  }
}

function listarTipo(req, res) {
    componenteModel.listarTipo().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os tipos ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarMedida(req, res) {
    var tipoSelecionado = req.body.tipoSelecionadoServer;
    
    if (tipoSelecionado == undefined) {
      res.status(400).send("undefined! listarMedida");
    } else {
      componenteModel.listarMedida(tipoSelecionado)
        .then(function (resultado) {
          res.json(resultado);
        })
        .catch(function (erro) {
          console.log(erro);
          console.log(
            "\nHouve um erro ao realizar a operação do select!",
            erro.sqlMessage
          );
          res.status(500).json(erro.sqlMessage);
        });
    }
}

function verificar(req, res) {
    var tipo = req.body.tipoServer;
    var medida = req.body.medidaServer;

    if (tipo == undefined || medida == undefined) {
        res.status(400).send("undefined cadastrar");
    } else {
        componenteModel.verificar(tipo, medida).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao realizar a verificação",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
        
    }
}

function cadastrar(req, res) {
    var codigo = req.body.codigoServer;
    var modelo = req.body.modeloServer;
    var limiteA = req.body.limiteAServer;
    var limiteG = req.body.limiteGServer;

    if (modelo == undefined || limiteA == undefined || limiteG == undefined) {
        res.status(400).send("undefined cadastrar");
    } else {
        componenteModel.cadastrar(codigo, modelo, limiteA, limiteG).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao realizar o cadastro",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
        
    }
}

function cadastrarFrio(req, res) {
    var codigo = req.body.codigoServer;
    var modelo = req.body.modeloServer;
    var limiteA = req.body.limiteAServer;
    var limiteG = req.body.limiteGServer;

    if (modelo == undefined || limiteA == undefined || limiteG == undefined) {
        res.status(400).send("undefined cadastrar");
    } else {
        componenteModel.cadastrarFrio(codigo, modelo, limiteA, limiteG).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao realizar o cadastro",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
        
    }
}

function listarComponentes(req, res) {
    componenteModel.listarComponentes()
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("houve um erro ao puxar dados ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function excluirComponente(req, res) {
    var id = req.body.idServer;

    if (id == undefined) {
        res.status(400).send("undefined excluir");
    } else {
        componenteModel.excluirComponente(id).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao excluir",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
        
    }
}

  module.exports = {
    listarComponente,
    listarTipo,
    listarMedida,
    cadastrar,
    cadastrarFrio,
    verificar,
    listarComponentes,
    excluirComponente
  };