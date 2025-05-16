var database = require("../database/config")

function dadosGraficoAlerta() {
  var instrucaoSql = `SELECT COUNT(alerta.idAlerta) AS qtd_alertas, alerta.statusAlerta, servidor.fkFabrica FROM alerta 
                        JOIN capturaDados AS captura ON alerta.fkCapturaDados = captura.idCapturaDados
                        JOIN componenteServidor ON captura.fkComponenteServidor = idcomponenteServidor
                        JOIN servidor_maquina AS servidor ON componenteServidor.fkMaquina = servidor.idMaquina
                        JOIN componente ON componenteServidor.fkComponente = idcomponente
                        GROUP BY alerta.statusAlerta, servidor.fkFabrica;`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function dadosFabrica() {
  var instrucaoSql = `select fabrica.idFabrica, fabrica.nome as nomeFabrica, fabrica.limiteAtencao, fabrica.limiteCritico, usuario.nome, usuario.cargo, usuario.fkFabrica
                        from fabrica JOIN usuario on fkFabrica = idfabrica;`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

function informacaoFabrica(nomeFabrica) {
  var instrucaoSql = `select fabrica.idFabrica, fabrica.nome as nomeFabrica, fabrica.limiteAtencao, fabrica.limiteCritico, usuario.nome, usuario.cargo, usuario.fkFabrica
                        from fabrica JOIN usuario on fkFabrica = idfabrica WHERE fabrica.nome = '${nomeFabrica}';`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

module.exports = {
  dadosGraficoAlerta,
  dadosFabrica,
  informacaoFabrica
}
