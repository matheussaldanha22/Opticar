var dashComponenteModel = require("../models/dashComponenteModel")

function obterParametrosComponente(req, res) {
  var idMaquina = req.params.idMaquina
  var componente = req.params.componente

  dashComponenteModel
    .obterParametrosComponente(idMaquina, componente)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0])
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os parametros.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}

function obterAnosDisponiveis(req, res) {
  var idMaquina = req.params.idMaquina;
  var componente = req.params.componente;

  dashComponenteModel
    .obterAnosDisponiveis(idMaquina, componente)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar os anos.", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function obterMesesDisponiveis(req, res) {
  var idMaquina = req.params.idMaquina
  var componente = req.params.componente
  var ano = req.params.ano

  dashComponenteModel
    .obterMesesDisponiveis(idMaquina, componente, ano)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado)
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os meses.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })
}



function obterAlertasMes(req, res) {
  var idMaquina = req.params.idMaquina
  var componente = req.params.componente

  dashComponenteModel
    .obterAlertasMes(idMaquina, componente)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0])
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar os alertas.", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })

}

function obterTempoMtbf(req, res) {
  var idMaquina = req.params.idMaquina
  var componente = req.params.componente

  dashComponenteModel
    .obterTempoMtbf(idMaquina, componente)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0])
      } else {
        res.status(204).send("Nenhum resultado encontrado!")
      }
    })
    .catch(function (erro) {
      console.log(erro)
      console.log("Houve um erro ao buscar o mtbf", erro.sqlMessage)
      res.status(500).json(erro.sqlMessage)
    })

}

function dadosGraficoUsoSemanal(req, res) {
  var idMaquina = req.params.idMaquina
  var componente = req.params.componente
  var anoEscolhido = req.body.anoEscolhido;
  var mesEscolhido = req.body.mesEscolhido;

  if (anoEscolhido == undefined || mesEscolhido == undefined) {
    res.status(400).send("undefined");
  } else {
    dashComponenteModel.dadosGraficoUsoSemanal(idMaquina,componente,anoEscolhido,mesEscolhido)
      .then(function (resultado) {
        if (resultado.length > 0) {
          res.status(200).json(resultado)
        } else {
          res.status(204).send("Sem resultados para grafico semanal")
        }
      })
      .catch(function (erro) {
        console.log(erro)
        console.log("Houve um erro ao buscar as informações semanal.", erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
      })
  }
}

function dadosGraficoUsoAnual(req, res) {
  var idMaquina = req.params.idMaquina
  var componente = req.params.componente
  var anoEscolhido = req.body.anoEscolhido;

  if (anoEscolhido == undefined) {
    res.status(400).send("undefined ano");
  } else {
    dashComponenteModel.dadosGraficoUsoAnual(idMaquina,componente,anoEscolhido)
      .then(function (resultado) {
        if (resultado.length > 0) {
          res.status(200).json(resultado)
        } else {
          res.status(204).send("Sem resultados para grafico semanal")
        }
      })
      .catch(function (erro) {
        console.log(erro)
        console.log("Houve um erro ao buscar as informações anual.", erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
      })
  }
}





module.exports = {
  obterParametrosComponente,
  obterAnosDisponiveis,
  obterMesesDisponiveis,
  obterAlertasMes,
  obterTempoMtbf,
  dadosGraficoUsoSemanal,
  dadosGraficoUsoAnual
}