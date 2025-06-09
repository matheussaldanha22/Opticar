var database = require("../database/config")

function listarAlertas() {
  var instrucaoSql = `
  SELECT alerta.idAlerta, alerta.dataHora AS dataAlerta, alerta.valor, alerta.titulo, alerta.descricao, alerta.prioridade,
  alerta.tipo_incidente AS tipo, alerta.statusAlerta, alerta.jira_issue_key AS jira_key, 
  servidor.hostname, servidor.ip, servidor.Mac_Address, servidor.idMaquina, componenteServidor.modelo, componente.tipo AS tipoComponente, componente.medida AS medidaComponente 
  FROM alerta JOIN capturaDados AS captura ON alerta.fkCapturaDados = captura.idCapturaDados
  JOIN componenteServidor ON captura.fkComponenteServidor = idcomponenteServidor
  JOIN servidor_maquina AS servidor ON componenteServidor.fkMaquina = servidor.idMaquina
  JOIN componente ON componenteServidor.fkComponente = idcomponente;
  `

  // select idAlerta, valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta , jira_issue_key AS jira_key, dataHora AS dataAlerta from alerta;

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarQUENTE(instrucaoSql)
}

function listarMes() {
  var instrucaoSql = `select extract(month from dataHora) as mes,
  extract(year from dataHora) as ano
  from alerta group by mes, ano
  order by ano, mes asc;`

  return database.executarQUENTE(instrucaoSql)
}

module.exports = {
  listarAlertas,
  listarMes
}
