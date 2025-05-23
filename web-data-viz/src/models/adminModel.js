var database = require("../database/config")

function dadosGraficoAlerta() {
  var instrucaoSql = `SELECT servidor.fkFabrica, 
                      COUNT(CASE WHEN alerta.statusAlerta = 'To Do' THEN 1 END) AS qtd_to_do,
                      COUNT(CASE WHEN alerta.statusAlerta = 'In Progress' THEN 1 END) AS qtd_in_progress,
                      COUNT(CASE WHEN alerta.statusAlerta = 'Done' THEN 1 END) AS qtd_done
                      FROM servidor_maquina AS servidor
                      LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
                      LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
                      LEFT JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados
                      GROUP BY servidor.fkFabrica
                      ORDER BY qtd_to_do + qtd_in_progress DESC;`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function dadosFabrica() {
  var instrucaoSql = `select fabrica.idFabrica, fabrica.nome as nomeFabrica, fabrica.limiteAtencao, fabrica.limiteCritico, usuario.nome, usuario.cargo, usuario.fkFabrica
                        from fabrica JOIN usuario on fkFabrica = idfabrica;`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

function dadosFabricaModal() {
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

function informacaoFabricaPadrao(idFabrica) {
  var instrucaoSql = `select fabrica.idFabrica, fabrica.nome as nomeFabrica, fabrica.limiteAtencao, fabrica.limiteCritico, usuario.nome, usuario.cargo, usuario.fkFabrica
                        from fabrica JOIN usuario on fkFabrica = idfabrica WHERE fabrica.idFabrica = '${idFabrica}';`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

function dadosFabricaSelecionada(idFabrica) {
  var instrucaoSql = `SELECT servidor.fkFabrica, 
                      COUNT(CASE WHEN alerta.statusAlerta = 'To Do' THEN 1 END) AS qtd_to_do,
                      COUNT(CASE WHEN alerta.statusAlerta = 'In Progress' THEN 1 END) AS qtd_in_progress,
                      COUNT(CASE WHEN alerta.statusAlerta = 'Done' THEN 1 END) AS qtd_done
                      FROM servidor_maquina AS servidor
                      LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
                      LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
                      LEFT JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados WHERE fkFabrica = ${idFabrica};`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function mtbf(idFabrica) {
  var instrucaoSql = `SELECT 
                            TIMESTAMPDIFF(MINUTE, MIN(cd.data), MAX(cd.data)) AS minutos_operacao,
                            (
                                SELECT COUNT(a.idAlerta) 
                                FROM alerta a 
                                JOIN capturaDados cd2 ON a.fkCapturaDados = cd2.idCapturaDados
                                JOIN componenteServidor cs2 ON cd2.fkComponenteServidor = cs2.idcomponenteServidor
                                JOIN servidor_maquina sm2 ON cs2.fkMaquina = sm2.idMaquina
                                WHERE sm2.fkFabrica = ${idFabrica}
                                  AND YEAR(a.dataHora) = YEAR(CURDATE())
                                  AND MONTH(a.dataHora) = MONTH(CURDATE())
                            ) AS qtd_alertas
                        FROM 
                            capturaDados cd
                            JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
                            JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
                        WHERE 
                            sm.fkFabrica = ${idFabrica}
                            AND YEAR(cd.data) = YEAR(CURDATE())
                            AND MONTH(cd.data) = MONTH(CURDATE());`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

module.exports = {
  dadosGraficoAlerta,
  dadosFabrica,
  informacaoFabrica,
  informacaoFabricaPadrao,
  dadosFabricaModal,
  dadosFabricaSelecionada,
  mtbf
}
