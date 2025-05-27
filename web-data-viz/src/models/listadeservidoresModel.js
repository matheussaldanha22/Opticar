var database = require("../database/config")

function carregarServidores(idFabrica) {
  var sql = `
            SELECT 
                sm.idMaquina,
                sm.ip,
                COUNT(cs.idcomponenteServidor) AS componentes
            FROM servidor_maquina sm
            LEFT JOIN componenteServidor cs ON sm.idMaquina = cs.fkMaquina
            JOIN fabrica f ON sm.fkFabrica = f.idFabrica
            WHERE f.idFabrica = ${idFabrica}
            GROUP BY sm.idMaquina, sm.ip;
  `;
  return database.executarFRIO(sql);
}

function excluirServidor(idMaquina) {
  var sql = `DELETE FROM servidor_maquina WHERE idMaquina = ${idMaquina};`;
  return database.executarFRIO(sql);
}

function excluirServidorFrio(idMaquina) {
  var sql = `DELETE FROM servidor_maquina WHERE idMaquina = ${idMaquina};`;
  return database.executarQUENTE(sql);
}

function cadastrar(limiteA, limiteG) {
    var instrucaoSql = `UPDATE servidor_maquina SET limiteA = ${limiteA}, limiteG = ${limiteG};`;

    return database.executarFRIO(instrucaoSql);
}

function cadastrarFRIO(limiteA, limiteG) {
  var instrucaoSql = `UPDATE servidor_maquina SET limiteA = ${limiteA}, limiteG = ${limiteG};`;

  return database.executarQUENTE(instrucaoSql);
}

function modalUpdate(id) {
  var instrucaoSql = `select * from servidor_maquina where idMaquina = ${id};`

  return database.executarFRIO(instrucaoSql)
}

function updateServidor(limiteA, limiteG, id) {
  var instrucaoSql = `UPDATE servidor_maquina SET limiteA = ${limiteA}, limiteG = ${limiteG} WHERE idMaquina = ${id};`;

  console.log("SQL:", instrucaoSql);
  return database.executarFRIO(instrucaoSql);
  
}

function updateServidorFRIO(limiteA, limiteG, id) {
  var instrucaoSql = `UPDATE servidor_maquina SET limiteA = ${limiteA}, limiteG = ${limiteG} WHERE idMaquina = ${id};`;

  console.log("SQL:", instrucaoSql);
  return database.executarQUENTE(instrucaoSql);
  
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
  