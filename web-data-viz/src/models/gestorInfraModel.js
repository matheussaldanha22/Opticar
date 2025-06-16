var database = require("../database/config");

function buscarAlertasCPU() {
    var instrucaoSql = `
        SELECT
    DATE_FORMAT(CONVERT_TZ(a.dataHora, '+00:00', '-03:00'), '%Y-%m-%d') AS dataAlerta,
    COUNT(*) AS totalAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'aberto' THEN 1 ELSE 0 END) AS toDoAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'em andamento' THEN 1 ELSE 0 END) AS InProgressAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'resolvido' THEN 1 ELSE 0 END) AS DoneAlertas
FROM
    alerta a
WHERE
    a.componente = 'CPU'
    AND MONTH(CONVERT_TZ(a.dataHora, '+00:00', '-03:00')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
    AND YEAR(CONVERT_TZ(a.dataHora, '+00:00', '-03:00')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
GROUP BY
    dataAlerta
ORDER BY
    dataAlerta;
    `;
    return database.executarQUENTE(instrucaoSql);
}

function buscarAlertasRAM() {
    var instrucaoSql = `
       SELECT
    DATE_FORMAT(CONVERT_TZ(a.dataHora, '+00:00', '-03:00'), '%Y-%m-%d') AS dataAlerta,
    COUNT(*) AS totalAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'aberto' THEN 1 ELSE 0 END) AS toDoAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'em andamento' THEN 1 ELSE 0 END) AS InProgressAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'resolvido' THEN 1 ELSE 0 END) AS DoneAlertas
FROM
    alerta a
WHERE
    a.componente = 'RAM'
    AND MONTH(CONVERT_TZ(a.dataHora, '+00:00', '-03:00')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
    AND YEAR(CONVERT_TZ(a.dataHora, '+00:00', '-03:00')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
GROUP BY
    dataAlerta
ORDER BY
    dataAlerta;
    `;
    return database.executarQUENTE(instrucaoSql);
}

function buscarAlertasDISCO() {
    var instrucaoSql = `
        SELECT
    DATE_FORMAT(CONVERT_TZ(a.dataHora, '+00:00', '-03:00'), '%Y-%m-%d') AS dataAlerta,
    COUNT(*) AS totalAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'aberto' THEN 1 ELSE 0 END) AS toDoAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'em andamento' THEN 1 ELSE 0 END) AS InProgressAlertas,
    SUM(CASE WHEN LOWER(a.statusAlerta) = 'resolvido' THEN 1 ELSE 0 END) AS DoneAlertas
FROM
    alerta a
WHERE
    a.componente = 'DISCO'
    AND MONTH(CONVERT_TZ(a.dataHora, '+00:00', '-03:00')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
    AND YEAR(CONVERT_TZ(a.dataHora, '+00:00', '-03:00')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
GROUP BY
    dataAlerta
ORDER BY
    dataAlerta;
    `;
    return database.executarQUENTE(instrucaoSql);
}


function buscarServidorComMaisCriticosCPU() {
    var instrucaoSql = `
        SELECT sm.idMaquina, COUNT(*) AS totalCriticos
        FROM alerta a 
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
        JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina 
        WHERE a.prioridade = 'Crítica'
        AND a.componente = 'CPU'
        AND MONTH(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = MONTH(CURRENT_DATE())
        AND YEAR(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = YEAR(CURRENT_DATE())
        GROUP BY sm.idMaquina 
        ORDER BY totalCriticos DESC;
    `;
    return database.executarQUENTE(instrucaoSql);
}

function buscarServidorComMaisCriticosRAM() {
    var instrucaoSql = `
        SELECT sm.idMaquina, COUNT(*) AS totalCriticos
        FROM alerta a 
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
        JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina 
        WHERE a.prioridade = 'Crítica'
        AND a.componente = 'CPU'
        AND MONTH(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = MONTH(CURRENT_DATE())
        AND YEAR(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = YEAR(CURRENT_DATE())
        GROUP BY sm.idMaquina 
        ORDER BY totalCriticos DESC;
    `;
    return database.executarQUENTE(instrucaoSql);
}

function buscarServidorComMaisCriticosDISCO() {
    var instrucaoSql = `
        SELECT sm.idMaquina, COUNT(*) AS totalCriticos
        FROM alerta a 
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
        JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina 
        WHERE a.prioridade = 'Crítica'
        AND a.componente = 'DISCO'
        AND MONTH(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = MONTH(CURRENT_DATE())
        AND YEAR(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = YEAR(CURRENT_DATE())
        GROUP BY sm.idMaquina 
        ORDER BY totalCriticos DESC;
    `;
    return database.executarQUENTE(instrucaoSql);
}


module.exports = {
    buscarAlertasCPU,
    buscarAlertasRAM,
    buscarAlertasDISCO,
    buscarServidorComMaisCriticosCPU,
    buscarServidorComMaisCriticosRAM,
    buscarServidorComMaisCriticosDISCO
    
};