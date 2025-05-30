var database = require("../database/config");

function buscarAlertasCPU() {
    var instrucaoSql = `
           SELECT 
            DATE_FORMAT(CONVERT_TZ(cd.data, '+00:00', '-03:00'), '%Y-%m-%d') AS dataAlerta, 
            COUNT(*) AS totalAlertas,
            SUM(CASE WHEN a.statusAlerta = 'To Do' THEN 1 ELSE 0 END) AS toDoAlertas
        FROM alerta a
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        WHERE a.componente = 'CPU'
        GROUP BY dataAlerta
        ORDER BY dataAlerta;

    `
     
    return database.executarQUENTE(instrucaoSql);
}

function buscarAlertasRAM() {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(CONVERT_TZ(cd.data, '+00:00', '-03:00'), '%Y-%m-%d') AS dataAlerta, 
            COUNT(*) AS totalAlertas,
            SUM(CASE WHEN a.statusAlerta = 'To Do' THEN 1 ELSE 0 END) AS toDoAlertas
        FROM alerta a
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        WHERE a.componente = 'RAM'
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
            SUM(CASE WHEN a.statusAlerta = 'To Do' THEN 1 ELSE 0 END) AS toDoAlertas
        FROM alerta a
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        WHERE a.componente = 'DISCO'
        GROUP BY dataAlerta
        ORDER BY dataAlerta;
    `;
    return database.executarQUENTE(instrucaoSql);
}


module.exports = {
    buscarAlertasCPU,
    buscarAlertasRAM,
    buscarAlertasDISCO
};
