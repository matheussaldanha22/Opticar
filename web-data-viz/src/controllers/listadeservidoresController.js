var listadeservidoresModel = require('../models/listadeservidoresModel');


function carregarServidores(req, res) {
    listadeservidoresModel.carregarServidores()
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
  
  module.exports = {
    carregarServidores,
    excluirServidor
  };