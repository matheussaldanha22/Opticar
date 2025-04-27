var database = require("../database/config")

function listarAlertas() {
  var instrucaoSql = `select idAlerta, valor, titulo, descricao, prioridade, tipo_incidente, componente, statusAlerta , jira_issue_key AS jira_key, dataHora AS dataAlerta from alerta;`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

module.exports = {
  listarAlertas,
}
