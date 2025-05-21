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


module.exports = {
    obterAlertasMes
}