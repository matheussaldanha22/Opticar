var database = require("../database/config")

function pedidosCliente(macAddress) {
  var instrucaoSql = `SELECT * FROM opticar.componenteServidor 
                        JOIN opticar.servidor_maquina ON opticar.componenteServidor.fkMaquina = opticar.servidor_maquina.idMaquina
                        JOIN opticar.componente ON opticar.componenteServidor.fkComponente = opticar.componente.idcomponente
                        WHERE opticar.servidor_maquina.Mac_Address = ${macAddress};`

  return database.executarFrio(instrucaoSql)
}

function dadosCapturados(dados, idcomponenteServidor) {
  var instrucaoSql = `INSERT INTO opticarFrio.capturaDados (fkComponenteServidor, valor, data)
                        VALUES (${idcomponenteServidor}, ${dados}, NOW());`;

  return database.executarQuente(instrucaoSql);
  
}

module.exports = {
    pedidosCliente,
    dadosCapturados
}