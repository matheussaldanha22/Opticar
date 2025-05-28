var database = require("../database/config");

function buscarAlertasCPU() {
    var instrucaoSql = `
        SELECT 
            DATE(cd.data) AS dataAlerta, 
            COUNT(*) AS totalAlertas,
            SUM(CASE WHEN a.statusAlerta = 'To Do' THEN 1 ELSE 0 END) AS toDoAlertas
        FROM alerta a
        JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
        WHERE a.componente = 'CPU'
        GROUP BY DATE(cd.data)
        ORDER BY DATE(cd.data);
    `;
    return database.executarQUENTE(instrucaoSql);
}

module.exports = {
    buscarAlertasCPU
};
