var database = require("../database/config")

function obterAlertasMes(idMaquina, componente) {
    var instrucaoSql = `
      SELECT 
    COUNT(a.idAlerta) AS totalAlertas,
    SUM(CASE WHEN a.prioridade = "Crítica" THEN 1 ELSE 0 END) AS alertasCriticos,
    SUM(CASE WHEN a.prioridade = "Média" THEN 1 ELSE 0 END) AS alertasMédios
FROM 
    alerta as a
    JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
    JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
    JOIN componente c ON cs.fkComponente = c.idcomponente
    JOIN servidor_maquina ON idMaquina = fkMaquina
WHERE 
    c.tipo = '${componente}' AND servidor_maquina.idMaquina = ${idMaquina}
    AND YEAR(a.dataHora) = YEAR(CURDATE()) 
    AND MONTH(a.dataHora) = MONTH(CURDATE());

    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarFRIO(instrucaoSql)
}

function obterTempoMtbf(idMaquina, componente) {
    var instrucaoSql = `
SELECT 
    TIMESTAMPDIFF(MINUTE, MIN(cd.data), MAX(cd.data)) AS minutos_operacao,
    (SELECT COUNT(a.idAlerta) 
     FROM alerta a 
     JOIN capturaDados cd2 ON a.fkCapturaDados = cd2.idCapturaDados
     JOIN componenteServidor cs2 ON cd2.fkComponenteServidor = cs2.idcomponenteServidor
     WHERE cs2.fkMaquina = ${idMaquina}
     AND c.tipo = '${componente}'
     AND YEAR(a.dataHora) = YEAR(CURDATE())
     AND MONTH(a.dataHora) = MONTH(CURDATE())) AS qtd_alertas
FROM 
    capturaDados cd
    JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
    JOIN componente c ON cs.fkComponente = c.idcomponente
WHERE 
    c.tipo = '${componente}'
    AND cs.fkMaquina = ${idMaquina}
    AND YEAR(cd.data) = YEAR(CURDATE())
    AND MONTH(cd.data) = MONTH(CURDATE());

    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarFRIO(instrucaoSql)
}


module.exports = {
    obterAlertasMes,
    obterTempoMtbf
}