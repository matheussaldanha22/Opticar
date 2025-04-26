var database = require("../database/config")

function carregarServidores() {
  var sql = `
    SELECT 
      sm.idMaquina,
      sm.ip,
      COUNT(cs.idcomponenteServidor) AS componentes
    FROM servidor_maquina sm
    LEFT JOIN componenteServidor cs ON sm.idMaquina = cs.fkMaquina
    GROUP BY sm.idMaquina, sm.ip;
  `;
  return database.executar(sql);
}

function excluirServidor(idMaquina) {
  var sql = `DELETE FROM servidor_maquina WHERE idMaquina = ${idMaquina};`;
  return database.executar(sql);
}


  
  module.exports = {
    carregarServidores,
    excluirServidor
  };
  