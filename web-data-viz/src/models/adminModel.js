var database = require("../database/config")

function dadosGraficoAlerta() {
  var instrucaoSql = `SELECT servidor.fkFabrica,
                      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'aberto' THEN 1 END) AS qtd_to_do,
                      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'em andamento' THEN 1 END) AS qtd_in_progress,
                      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'resolvido' THEN 1 END) AS qtd_done
                      FROM servidor_maquina AS servidor
                      LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
                      LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
                      INNER JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados
                      WHERE MONTH(captura.data) = MONTH(CURDATE()) AND YEAR(captura.data) = YEAR(CURDATE())
                      GROUP BY servidor.fkFabrica
                      ORDER BY qtd_to_do + qtd_in_progress DESC;`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarQUENTE(instrucaoSql)
}

function dadosFabrica() {
  var instrucaoSql = `SELECT 
                          f.idfabrica,
                          f.nome AS nomeFabrica,
                          f.limiteCritico,
                          f.limiteAtencao,
                          f.telefone,
                          u.nome AS nomeGestor
                      FROM fabrica f
                      LEFT JOIN usuario u 
                          ON u.fkFabrica = f.idfabrica AND u.cargo = 'GestorInfra';`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function dadosFabricaModal() {
  var instrucaoSql = `select fabrica.idFabrica, fabrica.nome as nomeFabrica, fabrica.limiteAtencao, fabrica.limiteCritico, usuario.nome, usuario.cargo, usuario.fkFabrica
                        from fabrica JOIN usuario on fkFabrica = idfabrica;`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function informacaoFabrica(nomeFabrica) {
  var instrucaoSql = `select fabrica.idFabrica, fabrica.telefone, fabrica.nome as nomeFabrica, fabrica.limiteAtencao, fabrica.limiteCritico, usuario.nome, usuario.cargo, usuario.fkFabrica
                        from fabrica JOIN usuario on fkFabrica = idfabrica WHERE fabrica.nome = '${nomeFabrica}';`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function informacaoFabricaPadrao(idFabrica) {
  var instrucaoSql = `select fabrica.idFabrica, fabrica.telefone, fabrica.nome as nomeFabrica, fabrica.limiteAtencao, fabrica.limiteCritico, usuario.nome, usuario.cargo, usuario.fkFabrica
                        from fabrica JOIN usuario on fkFabrica = idfabrica WHERE fabrica.idFabrica = '${idFabrica}';`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function dadosFabricaSelecionada(idFabrica) {
  var instrucaoSql = `SELECT servidor.fkFabrica, 
                      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'aberto' THEN 1 END) AS qtd_to_do,
                      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'em andamento' THEN 1 END) AS qtd_in_progress,
                      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'resolvido' THEN 1 END) AS qtd_done
                      FROM servidor_maquina AS servidor
                      LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
                      LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
                      LEFT JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados
                      WHERE servidor.fkFabrica = ${idFabrica}
                        AND MONTH(captura.data) = MONTH(CURDATE()) AND YEAR(captura.data) = YEAR(CURDATE());`

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarQUENTE(instrucaoSql)
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
                          AND MONTH(cd2.data) = MONTH(CURDATE()) AND YEAR(cd2.data) = YEAR(CURDATE())
                      ) AS qtd_alertas
                    FROM capturaDados cd
                    JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
                    JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
                    WHERE sm.fkFabrica = ${idFabrica}
                      AND MONTH(cd.data) = MONTH(CURDATE()) AND YEAR(cd.data) = YEAR(CURDATE()); `

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarQUENTE(instrucaoSql)
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
