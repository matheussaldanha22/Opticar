var mysql = require("mysql2")

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfigFRIO = {
  host: process.env.DB_HOST_FRIO,
  database: process.env.DB_DATABASE_FRIO,
  user: process.env.DB_USER_FRIO,
  password: process.env.DB_PASSWORD_FRIO,
  port: process.env.DB_PORT_FRIO,
}

var mySqlConfigQUENTE = {
  host: process.env.DB_HOST_QUENTE,
  database: process.env.DB_DATABASE_QUENTE,
  user: process.env.DB_USER_QUENTE,
  password: process.env.DB_PASSWORD_QUENTE,
  port: process.env.DB_PORT_QUENTE,
}

function executarFRIO(instrucao) {
  if (
    process.env.AMBIENTE_PROCESSO !== "producao" &&
    process.env.AMBIENTE_PROCESSO !== "desenvolvimento"
  ) {
    console.log(
      "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n"
    )
    return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env")
  }

  return new Promise(function (resolve, reject) {
    var conexao = mysql.createConnection(mySqlConfigFRIO)
    conexao.connect()
    conexao.query(instrucao, function (erro, resultados) {
      conexao.end()
      if (erro) {
        reject(erro)
      }
      console.log(resultados)
      resolve(resultados)
    })
    conexao.on("error", function (erro) {
      return "ERRO NO MySQL SERVER: ", erro.sqlMessage
    })
  })
}

function executarQUENTE(instrucao) {
  if (
    process.env.AMBIENTE_PROCESSO !== "producao" &&
    process.env.AMBIENTE_PROCESSO !== "desenvolvimento"
  ) {
    console.log(
      "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n"
    )
    return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env")
  }

  return new Promise(function (resolve, reject) {
    var conexao = mysql.createConnection(mySqlConfigQUENTE)
    conexao.connect()
    conexao.query(instrucao, function (erro, resultados) {
      conexao.end()
      if (erro) {
        reject(erro)
      }
      console.log(resultados)
      resolve(resultados)
    })
    conexao.on("error", function (erro) {
      return "ERRO NO MySQL SERVER: ", erro.sqlMessage
    })
  })
}

module.exports = {
  executarFRIO,
  executarQUENTE,
}
