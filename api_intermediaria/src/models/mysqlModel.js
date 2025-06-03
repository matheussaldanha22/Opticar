var database = require("../database/config")

function cadMaqFrio(so, ip_publico, hostname, mac, fabrica) {
  const instrucaoSql = `INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname)
                        VALUES ('${so}', '${ip_publico}', ${fabrica}, ${mac}, '${hostname}');`

  return database.executarFrio(instrucaoSql)
}

function cadMaqQuente(so, ip_publico, hostname, mac, fabrica) {
  const instrucaoSql = `INSERT INTO servidor_maquina (sistema_operacional, ip, fkFabrica, Mac_Address, hostname)
                        VALUES ('${so}', '${ip_publico}', ${fabrica}, ${mac}, '${hostname}');`

  return database.executarQuente(instrucaoSql)
}

function cardapio() {
  const instrucaoSql = `SELECT * FROM componente;`

  return database.executarFrio(instrucaoSql)
}

function obterServidor(mac) {
  const instrucaoSql = `SELECT idMaquina from servidor_maquina WHERE Mac_Address = ${mac}`

  return database.executarQuente(instrucaoSql)
}

function pedidosObrigatorios(valor, servidor) {
  const instrucaoSql = `INSERT INTO componenteServidor VALUES (DEFAULT, ${valor}, ${servidor}, 'PADRÃO', '90', '80')`

  return database.executarFrio(instrucaoSql)
}

function pedidosObrigatoriosQuente(valor, servidor) {
  const instrucaoSql = `INSERT INTO componenteServidor VALUES (DEFAULT, ${valor}, ${servidor}, 'PADRÃO', '90', '80')`

  return database.executarQuente(instrucaoSql)
}

function pedidosCliente(macAddress) {
  var instrucaoSql = `SELECT * FROM componenteServidor 
                        JOIN servidor_maquina ON componenteServidor.fkMaquina = servidor_maquina.idMaquina
                        JOIN componente ON componenteServidor.fkComponente = componente.idcomponente
                        WHERE servidor_maquina.Mac_Address = ${macAddress};`

  return database.executarFrio(instrucaoSql)
}

function dadosCapturados(dados, idcomponenteServidor) {
  var instrucaoSql = `INSERT INTO capturaDados (fkComponenteServidor, valor, data)
                        VALUES (${idcomponenteServidor}, ${dados}, NOW());`;

  return database.executarQuente(instrucaoSql);
  
}

function inserirAlerta(valor, titulo, prioridadeAlerta, descricaoAlerta, statusAlerta, tipo_incidente, fkPedido, componente, processo, processoCPU, processoRAM, processoDISCO) {
  const instrucaoSql = `
    INSERT INTO alerta 
    (dataHora, valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta, fkCapturaDados, processo, processoCPU, processoRAM, processoDISCO)
    VALUES 
    (NOW(), ${valor}, '${titulo}', '${descricaoAlerta}', '${prioridadeAlerta}', '${tipo_incidente}', '${componente}', '${statusAlerta}', ${fkPedido}, '${processo}', ${processoCPU}, ${processoRAM}, ${processoDISCO});
  `;
  return database.executarQuente(instrucaoSql);
}

function verificarIP(mac_address) {
  const instrucaoSql = `SELECT ip FROM servidor_maquina WHERE Mac_Address = ${mac_address};`

  return database.executarQuente(instrucaoSql);
}

function updateIP(mac_address, ip) {
  const instrucaoSql = `UPDATE servidor_maquina SET ip = '${ip}' WHERE Mac_address = ${mac_address};`

  return database.executarQuente(instrucaoSql);
}

function updateIPFRIO(mac_address, ip) {
  const instrucaoSql = `UPDATE servidor_maquina SET ip = '${ip}' WHERE Mac_address = ${mac_address};`

  return database.executarFrio(instrucaoSql);
}


module.exports = {
    pedidosCliente,
    dadosCapturados,
    inserirAlerta,
    verificarIP,
    updateIP,
    updateIPFRIO,
    cadMaqFrio,
    cadMaqQuente,
    cardapio,
    obterServidor,
    pedidosObrigatorios,
    pedidosObrigatoriosQuente
}