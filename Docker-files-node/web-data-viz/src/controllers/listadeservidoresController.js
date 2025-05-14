var listadeservidoresModel = require('../models/listadeservidoresModel');


function carregarServidores(req, res) {
    var idFabrica = req.body.idFabricaServer;
    listadeservidoresModel.carregarServidores(idFabrica)
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


function excluirServidor(req, res) {
    var idMaquina = req.params.id;

    listadeservidoresModel.excluirServidor(idMaquina)
        .then(() => {
            res.status(200).send("Servidor excluído com sucesso");
        })
        .catch(erro => {
            console.error("Erro ao excluir servidor:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function excluirServidorFrio(req, res) {
    var idMaquina = req.params.id;

    listadeservidoresModel.excluirServidorFrio(idMaquina)
        .then(() => {
            res.status(200).send("Servidor excluído com sucesso");
        })
        .catch(erro => {
            console.error("Erro ao excluir servidor:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {
    var limiteA = req.body.limiteAServer;
    var limiteG = req.body.limiteGServer;

    if (limiteA == undefined || limiteG == undefined) {
        res.status(400).send("undefined cadastrar servidores");
    } else {
        listadeservidoresModel.cadastrar(limiteA, limiteG).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao realizar o cadastro do Parâmetro do servidor",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
        
    }
}

function cadastrarFRIO(req, res) {
    var limiteA = req.body.limiteAServer;
    var limiteG = req.body.limiteGServer;

    if (limiteA == undefined || limiteG == undefined) {
        res.status(400).send("undefined cadastrar servidoresFRIO");
    } else {
        listadeservidoresModel.cadastrarFRIO(limiteA, limiteG).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao realizar o cadastro do Parâmetro do servidorFRIO",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
        
    }
}

function modalUpdate(req, res) {
  var id = req.body.idServer
  listadeservidoresModel.modalUpdate(id)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os servidores.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function updateServidor(req, res) {
  var id = req.body.idServer
  var limiteA = req.body.limiteAServer;
  var limiteG = req.body.limiteGServer;

  if (limiteA == undefined || limiteG == undefined || id == undefined) {
      res.status(400).send("undefined update");
  } else {
    listadeservidoresModel.updateServidor(limiteA, limiteG, id).then(
          function (resultado) {
              res.json(resultado);
          }
      ).catch(function (erro) {
          console.log(erro);
          console.log(
              "\nHouve um erro ao realizar o cadastro do servidor",
              erro.sqlMessage
          );
          res.status(500).json(erro.sqlMessage);
      });
      
  }
}

function updateServidorFRIO(req, res) {
    var id = req.body.idServer
    var limiteA = req.body.limiteAServer;
    var limiteG = req.body.limiteGServer;
  
    if (limiteA == undefined || limiteG == undefined || id == undefined) {
        res.status(400).send("undefined update");
    } else {
      listadeservidoresModel.updateServidorFRIO(limiteA, limiteG, id).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao realizar o cadastro do servidorFRIO",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
        
    }
  }
  
  module.exports = {
    carregarServidores,
    excluirServidor,
    excluirServidorFrio,
    cadastrar,
    cadastrarFRIO,
    modalUpdate,
    updateServidor,
    updateServidorFRIO
  };