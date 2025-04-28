var database = require("../database/config")

function listarFabricasEmpresa(idEmpresa) {
  var instrucaoSql = `
      SELECT * FROM fabrica where fkEmpresa = ${idEmpresa}

    `

  // SELECT fabrica.idfabrica, fabrica.nome AS nomeFabrica, usuario.nome AS nomeUsuario FROM fabrica
  // JOIN usuario ON usuario.fkFabrica = fabrica.idfabrica
  // where fkEmpresa = ${idEmpresa} AND usuario.cargo = 'GestorFabrica';

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

function cadastrarGestorFabrica(idGestor, idFabrica) {
  var instrucaoSql = `
  UPDATE fabrica SET fkGestorFabrica = ${idGestor} WHERE idfabrica = ${idFabrica}
  `

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

module.exports = {
  listarFabricasEmpresa,
  cadastrarGestorFabrica,
}
