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
  var nome = req.body.nomeServer
  var email = req.body.emailServer
  var senha = req.body.senhaServer
  var fkEmpresa = req.body.idEmpresaVincularServer

  // Faça as validações dos valores
  if (nome == undefined) {
    res.status(400).send("Seu nome está undefined!")
  } else if (email == undefined) {
    res.status(400).send("Seu email está undefined!")
  } else if (senha == undefined) {
    res.status(400).send("Sua senha está undefined!")
  } else if (fkEmpresa == undefined) {
    res.status(400).send("Sua empresa a vincular está undefined!")
  } else {
    // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
    usuarioModel
      .cadastrar(nome, email, senha, fkEmpresa)
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

module.exports = {
  autenticar,
  cadastrar,
  listarPorId,
}
