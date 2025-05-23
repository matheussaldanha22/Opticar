var adminModel = require("../models/adminModel")

function dadosGraficoAlerta(req, res) {
  adminModel.dadosGraficoAlerta()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado para alertas fabrica admin!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function dadosFabrica(req, res) {
  adminModel.dadosFabrica()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado para dadosFabrica!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function dadosFabricaModal(req, res) {
  adminModel.dadosFabricaModal()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado para dadosFabrica!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function informacaoFabrica(req, res) {
  var nomeFabrica = req.body.fabricaNomeServer;

  if (nomeFabrica == undefined) {
        res.status(400).send("undefined Nome");
  } else {
    adminModel.informacaoFabrica(nomeFabrica)
      .then(function (resultado) {
        if (resultado.length > 0) {
          res.status(200).json(resultado)
        } else {
          res.status(204).send("Nenhum resultado encontrado para informacaoFabrica!")
        }
      })
      .catch(function (erro) {
        console.log(erro)
        console.log("Houve um erro ao buscar as informações.", erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
      })
  }
}

function informacaoFabricaPadrao(req, res) {
  var idFabrica = req.body.fabricaFkServer;

  if (idFabrica == undefined) {
    res.status(400).send("undefined id");
  } else {
    adminModel.informacaoFabricaPadrao(idFabrica)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado para fabrica padrao!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
  }
}

function dadosFabricaSelecionada(req, res) {
  var idFabrica = req.params.idFabrica

  if (idFabrica == undefined) {
    res.status(400).send("undefined id");
  } else {
    adminModel.dadosFabricaSelecionada(idFabrica)
      .then(function (resultado) {
        if (resultado.length > 0) {
          res.status(200).json(resultado)
        } else {
          res.status(204).send("Nenhum resultado encontrado para alertas fabrica admin!")
        }
      })
      .catch(function (erro) {
        console.log(erro)
        console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
      })
    }
}

function mtbf(req, res) {
  var idFabrica = req.params.idFabrica

  if (idFabrica == undefined) {
    res.status(400).send("undefined id");
  } else {
    adminModel.mtbf(idFabrica)
      .then(function (resultado) {
        if (resultado.length > 0) {
          res.status(200).json(resultado)
        } else {
          res.status(204).send("Nenhum resultado encontrado para alertas fabrica admin!")
        }
      })
      .catch(function (erro) {
        console.log(erro)
        console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
      })
    }
}


module.exports = {
  dadosGraficoAlerta,
  dadosFabrica,
  informacaoFabrica,
  informacaoFabricaPadrao,
  dadosFabricaModal,
  dadosFabricaSelecionada,
  mtbf
}
