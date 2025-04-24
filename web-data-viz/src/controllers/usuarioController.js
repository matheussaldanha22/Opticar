var usuarioModel = require("../models/usuarioModel")
var servidorModel = require("../models/servidorModel")

function autenticar(req, res) {
  var email = req.body.emailServer
  var senha = req.body.senhaServer

  if (email == undefined) {
    res.status(400).send("Seu email está undefined!")
  } else if (senha == undefined) {
    res.status(400).send("Sua senha está indefinida!")
  } else {
    usuarioModel
      .autenticar(email, senha)
      .then(function (resultadoAutenticar) {
        console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`)
        console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`) // transforma JSON em String

        if (resultadoAutenticar.length == 1) {
          console.log(resultadoAutenticar)

          servidorModel
            .buscarServidorPorEmpresa(resultadoAutenticar[0].empresaId)
            .then((resultadoServidores) => {
              if (resultadoServidores.length >= 0) {
                res.json({
                  id: resultadoAutenticar[0].id,
                  email: resultadoAutenticar[0].email,
                  nome: resultadoAutenticar[0].nome,
                  senha: resultadoAutenticar[0].senha,
                  servidores: resultadoServidores,
                  empresaId: resultadoAutenticar[0].empresaId,
                  empresaNome: resultadoAutenticar[0].empresaNome,
                  cargo: resultadoAutenticar[0].cargo,
                  fabricaId: resultadoAutenticar[0].idFabrica,
                  fabricaNome: resultadoAutenticar[0].nomeFabrica,
                })
              } else {
                res.status(204).json({ servidores: [] })
              }
            })
        } else if (resultadoAutenticar.length == 0) {
          res.status(403).send("Email e/ou senha inválido(s)")
        } else {
          res.status(403).send("Mais de um usuário com o mesmo login e senha!")
        }
      })
      .catch(function (erro) {
        console.log(erro)
        console.log(
          "\nHouve um erro ao realizar o login! Erro: ",
          erro.sqlMessage
        )
        res.status(500).json(erro.sqlMessage)
      })
  }
}

function cadastrar(req, res) {
  // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
  var nome = req.body.nome
  var email = req.body.email
  var cpf = req.body.cpf
  var cargo = req.body.cargo
  var senha = req.body.senha
  var fkFabrica = req.body.fkFabrica

  // Faça as validações dos valores
  if (nome == undefined) {
    res.status(400).json({ erro: "Seu nome está undefined!" })
  } else if (email == undefined) {
    res.status(400).json({ erro: "Seu email está undefined!" })
  } else if (senha == undefined) {
    res.status(400).json({ erro: "Sua senha está undefined!" })
  } else if (cpf == undefined) {
    res.status(400).json({ erro: "Seu cpf está undefined!" })
  } else if (cargo == undefined) {
    res.status(400).json({ erro: "Seu cargo está undefined!" })
  } else if (fkFabrica == undefined) {
    res.status(400).json({ erro: "Sua fabrica a vincular está undefined!" })
  } else {
    // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
    usuarioModel
      .cadastrar(nome, email, cpf, cargo, senha, fkFabrica)
      .then(function (resultado) {
        res.json(resultado)
      })
      .catch(function (erro) {
        console.log(erro)
        console.log(
          "\nHouve um erro ao realizar o cadastro! Erro: ",
          erro.sqlMessage
        )
        res.status(500).json(erro.sqlMessage)
      })
  }
}

function listarPorId(req, res) {
  // Recebendo parametro da URL
  var idUsuario = req.params.idUsuario

  if (idUsuario == undefined) {
    res.status(400).send("ID do usuário indefinido")
  } else {
    usuarioModel
      .listarPorId(idUsuario)
      .then(function (resultado) {
        res.status(200).json(resultado)
      })
      .catch(function (erro) {
        console.log(erro)
        console.log(
          "\nHouve um erro ao realizar a listagem do usuário Erro: ",
          erro.sqlMessage
        )
        res.status(500).json(erro.sqlMessage)
      })
  }
}

function listarPorEmpresa(req, res) {
  var idEmpresa = req.params.idEmpresa

  if (idEmpresa == undefined) {
    res.status(400).send("ID da empresa indefinido")
  } else {
    usuarioModel
      .listarPorEmpresa(idEmpresa)
      .then(function (resultado) {
        res.status(200).json(resultado)
      })
      .catch(function (erro) {
        console.log(erro)
        console.log(
          "\nHouve um erro ao realizar a listagem do usuário Erro: ",
          erro.sqlMessage
        )
        res.status(500).json(erro.sqlMessage)
      })
  }
}

function listarPorFabrica(req, res) {
  var idFabrica = req.params.idFabrica

  if (idFabrica == undefined) {
    res.status(400).send("ID da fabrica indefinido")
  } else {
    usuarioModel
      .listarPorFabrica(idFabrica)
      .then(function (resultado) {
        res.status(200).json(resultado)
      })
      .catch(function (erro) {
        console.log(erro)
        console.log(
          "\nHouve um erro ao realizar a listagem do usuário Erro: ",
          erro.sqlMessage
        )
        res.status(500).json(erro.sqlMessage)
      })
  }
}

function atualizarUsuario(req, res) {
  var idUsuario = req.body.idUsuario
  var nome = req.body.nome
  var email = req.body.email
  var cpf = req.body.cpf
  var cargo = req.body.cargo
  var idFabrica = req.body.idFabrica

  if (idUsuario == undefined) {
    res.status(400).send("ID do usuario indefinido")
  } else {
    usuarioModel
      .atualizarUsuario(idUsuario, nome, email, cpf, cargo, idFabrica)
      .then(function (resultado) {
        res.status(200).json(resultado)
      })
      .catch(function (erro) {
        console.log(erro)
        console.log(
          "\nHouve um erro ao atualizar o usuário Erro: ",
          erro.sqlMessage
        )
        res.status(500).json(erro.sqlMessage)
      })
  }
}

module.exports = {
  autenticar,
  cadastrar,
  listarPorId,
  listarPorEmpresa,
  listarPorFabrica,
  atualizarUsuario,
}
