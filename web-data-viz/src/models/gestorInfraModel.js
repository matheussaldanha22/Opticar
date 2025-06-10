var database = require("../database/config");

function buscarAlertasCPU() {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(CONVERT_TZ(cd.data, '+00:00', '-03:00'), '%Y-%m-%d') AS dataAlerta, 
            COUNT(*) AS totalAlertas,
            SUM(CASE WHEN a.statusAlerta = 'To Do' THEN 1 ELSE 0 END) AS toDoAlertas,
            SUM(CASE WHEN a.statusAlerta = 'Done' THEN 1 ELSE 0 END) AS DoneAlertas,
            SUM(CASE WHEN a.statusAlerta = 'In Progress' THEN 1 ELSE 0 END) AS InProgressAlertas
        FROM alerta a
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
        JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
        WHERE a.componente = 'CPU'
        AND MONTH(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = MONTH(CURRENT_DATE())
        AND YEAR(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = YEAR(CURRENT_DATE())
        GROUP BY dataAlerta
        ORDER BY dataAlerta;
    `;
    return database.executarQUENTE(instrucaoSql);
}

function buscarAlertasRAM() {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(CONVERT_TZ(cd.data, '+00:00', '-03:00'), '%Y-%m-%d') AS dataAlerta, 
            COUNT(*) AS totalAlertas,
            SUM(CASE WHEN a.statusAlerta = 'To Do' THEN 1 ELSE 0 END) AS toDoAlertas,
            SUM(CASE WHEN a.statusAlerta = 'Done' THEN 1 ELSE 0 END) AS DoneAlertas,
            SUM(CASE WHEN a.statusAlerta = 'In Progress' THEN 1 ELSE 0 END) AS InProgressAlertas
        FROM alerta a
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
        JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
        WHERE a.componente = 'RAM'
        AND MONTH(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = MONTH(CURRENT_DATE())
        AND YEAR(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = YEAR(CURRENT_DATE())
        GROUP BY dataAlerta
        ORDER BY dataAlerta;
    `;
    return database.executarQUENTE(instrucaoSql);
}

function buscarAlertasDISCO() {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(CONVERT_TZ(cd.data, '+00:00', '-03:00'), '%Y-%m-%d') AS dataAlerta, 
            COUNT(*) AS totalAlertas,
            SUM(CASE WHEN a.statusAlerta = 'To Do' THEN 1 ELSE 0 END) AS toDoAlertas,
            SUM(CASE WHEN a.statusAlerta = 'Done' THEN 1 ELSE 0 END) AS DoneAlertas,
            SUM(CASE WHEN a.statusAlerta = 'In Progress' THEN 1 ELSE 0 END) AS InProgressAlertas
        FROM alerta a
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
        JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
        WHERE a.componente = 'DISCO'
        AND MONTH(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = MONTH(CURRENT_DATE())
        AND YEAR(CONVERT_TZ(cd.data, '+00:00', '-03:00')) = YEAR(CURRENT_DATE())
        GROUP BY dataAlerta
        ORDER BY dataAlerta;
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