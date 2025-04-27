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
  return database.executar(sql);
}

function excluirServidor(idMaquina) {
  var sql = `DELETE FROM servidor_maquina WHERE idMaquina = ${idMaquina};`;
  return database.executar(sql);
}

function excluirServidorFrio(idMaquina) {
  var sql = `DELETE FROM servidor_maquina WHERE idMaquina = ${idMaquina};`;
  return database.executarFRIO(sql);
}


  
  module.exports = {
    carregarServidores,
    excluirServidor,
    excluirServidorFrio
  };
  