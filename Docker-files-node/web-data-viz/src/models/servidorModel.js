var database = require("../database/config")

// function buscarAquariosPorEmpresa(empresaId) {
//   var instrucaoSql = `SELECT * FROM aquario a WHERE fk_empresa = ${empresaId}`

//   console.log("Executando a instrução SQL: \n" + instrucaoSql)
//   return database.executar(instrucaoSql)
// }

function buscarServidorPorEmpresa(empresaId) {
  var instrucaoSql = `SELECT 
    servidor_maquina.idMaquina,
    servidor_maquina.sistema_operacional,
    servidor_maquina.ip,
    servidor_maquina.Mac_Address,
    servidor_maquina.hostname,
    empresa.idempresa AS empresaId
FROM 
    servidor_maquina
JOIN 
    fabrica ON servidor_maquina.fkFabrica = fabrica.idfabrica
JOIN 
    empresa ON fabrica.fkEmpresa = empresa.idempresa
WHERE 
    empresa.idempresa = ${empresaId};`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

function cadastrar(empresaId, descricao) {
  var instrucaoSql = `INSERT INTO (descricao, fk_empresa) aquario VALUES (${descricao}, ${empresaId})`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

module.exports = {
  buscarServidorPorEmpresa,
  cadastrar,
}
