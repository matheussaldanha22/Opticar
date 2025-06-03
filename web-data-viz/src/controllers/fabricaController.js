var fabricaModel = require("../models/fabricaModel")

function listarFabricasEmpresa(req, res) {
  var idEmpresa = req.params.idEmpresa

  console.log(`Buscando fabricas por empresa`)

  fabricaModel
    .listarFabricasEmpresa(idEmpresa)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar as fabricas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function infoFabrica(req, res) {
  var idFabrica = req.params.idVar

  console.log(`Buscando fabricas por empresa`)

  fabricaModel
    .infoFabrica(idFabrica)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar as fabricas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function verificarAlertasPorId(req, res) {
  var idFabrica = req.params.idVar

  console.log(`Buscando fabricas por empresa`)

  fabricaModel
    .verificarAlertasPorId(idFabrica)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar as fabricas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}



function modalUpdate(req, res) {
  var id = req.body.idServer
  fabricaModel
    .modalUpdate(id)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar as fabricas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function updateFabrica(req, res) {
  var id = req.body.idServer
  var nome = req.body.nomeServer;
  var funcao = req.body.funcaoServer;
  var limiteA = req.body.limiteAServer;
  var limiteG = req.body.limiteGServer;

  if (nome == undefined || limiteA == undefined || limiteG == undefined || funcao == undefined || id == undefined) {
      res.status(400).send("undefined update");
  } else {
      fabricaModel.updateFabrica(id, nome, funcao, limiteA, limiteG).then(
          function (resultado) {
              res.json(resultado);
          }
      ).catch(function (erro) {
          console.log(erro);
          console.log(
              "\nHouve um erro ao realizar o cadastro da Fabrica",
              erro.sqlMessage
          );
          res.status(500).json(erro.sqlMessage);
      });
      
  }
}

function cadastrarGestorFabrica(req, res) {
  var idFabrica = req.body.idFabrica
  var idGestor = req.params.idGestor

  fabricaModel
    .cadastrarGestorFabrica(idGestor, idFabrica)
    .then(function (resultado) {
        res.status(200).json(resultado)
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao atualizar o gestor.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var funcao = req.body.funcaoServer;
    var limiteA = req.body.limiteAServer;
    var limiteG = req.body.limiteGServer;

    if (nome == undefined || limiteA == undefined || limiteG == undefined || funcao == undefined) {
        res.status(400).send("undefined cadastrar");
    } else {
        fabricaModel.cadastrar(nome, funcao, limiteA, limiteG).then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao realizar o cadastro da Fabrica",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
        
    }
}

function verificaAlertas(req, res) {
  fabricaModel.verificaAlertas()
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

function listarFabricas(req, res) {
    fabricaModel.listarFabricas()
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

function excluirFabrica(req, res) {
    var id = req.body.idServer;

    if (id == undefined) {
        res.status(400).send("undefined excluir");
    } else {
        fabricaModel.excluirFabrica(id).then(
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

function excluirFabricaFrio(req, res) {
  var id = req.body.idServer;

  if (id == undefined) {
      res.status(400).send("undefined excluir");
  } else {
      fabricaModel.excluirFabricaFrio(id).then(
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
  listarFabricasEmpresa,
  cadastrarGestorFabrica,
  cadastrar,
  verificaAlertas,
  listarFabricas,
  excluirFabrica,
  excluirFabricaFrio,
  modalUpdate,
  updateFabrica,
  infoFabrica,
  verificarAlertasPorId
}
