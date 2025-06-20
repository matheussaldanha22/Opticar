var database = require("../database/config")

function obterParametrosComponente(idMaquina, componente) {
    var instrucaoSql = `
    SELECT ROUND(AVG(cs.limiteCritico),2) as limiteCritico, ROUND(AVG(cs.limiteAtencao),2) as limiteAtencao FROM componenteServidor cs
    JOIN componente c ON cs.fkComponente = c.idcomponente
    JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
    WHERE c.tipo = '${componente}' 
    AND sm.idMaquina = ${idMaquina}
    AND c.medida = 'Porcentagem';

    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function obterAnosDisponiveis(idMaquina, componente) {
    var instrucaoSql = `
    SELECT DISTINCT YEAR(c.data) AS ano
    FROM capturaDados c
    JOIN componenteServidor cs ON c.fkComponenteServidor = cs.idcomponenteServidor
    JOIN componente comp ON cs.fkComponente = comp.idcomponente
    JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
    WHERE sm.idMaquina = ${idMaquina}
    AND comp.tipo = '${componente}'
    ORDER BY ano DESC;

    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function obterMesesDisponiveis(idMaquina, componente, ano) {
    var instrucaoSql = `
    SELECT DISTINCT MONTH(c.data) AS mes
    FROM capturaDados c
    JOIN componenteServidor cs ON c.fkComponenteServidor = cs.idcomponenteServidor
    JOIN componente comp ON cs.fkComponente = comp.idcomponente
    JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
    WHERE YEAR(c.data) = ${ano}
    AND sm.idMaquina = ${idMaquina}
    AND comp.tipo = '${componente}'   
    ORDER BY mes;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}


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
        JOIN servidor_maquina ON idMaquina = fkMaquina
    WHERE 
        a.componente = '${componente}' AND servidor_maquina.idMaquina = ${idMaquina}
        AND YEAR(a.dataHora) = YEAR(CURDATE()) 
        AND MONTH(a.dataHora) = MONTH(CURDATE());

    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function obterMediaUso(idMaquina, componente) {
    var instrucaoSql = `
        SELECT
        MONTH(cd.data) AS mes,
        ROUND(AVG(cd.valor), 2) AS media_uso
        FROM capturaDados cd
        JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
        JOIN componente c ON cs.fkComponente = c.idcomponente
        JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
        WHERE
        sm.idMaquina = ${idMaquina} -- ID da máquina desejada
        AND c.tipo = '${componente}' -- Tipo de componente
        AND c.medida = 'Porcentagem'
        AND YEAR(cd.data) = YEAR(CURDATE())
        AND MONTH(cd.data) IN (MONTH(CURDATE()), MONTH(CURDATE()) - 1)
        GROUP BY MONTH(cd.data)
        ORDER BY mes DESC;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
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
     AND c.tipo = '${componente}') AS qtd_alertas
FROM 
    capturaDados cd
    JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
    JOIN componente c ON cs.fkComponente = c.idcomponente
WHERE 
    c.tipo = '${componente}'
    AND cs.fkMaquina = ${idMaquina};

    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function dadosGraficoUsoSemanal(idMaquina, componente, anoEscolhido, mesEscolhido) {
    var instrucaoSql = `
    SELECT
    CEIL(DAY(cd.data) / 7) AS semana_do_mes,
    ROUND(AVG(cd.valor), 2) AS media_utilizacao
    FROM capturaDados cd
    JOIN componenteServidor AS cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
    JOIN componente AS c ON cs.fkComponente = c.idcomponente
    JOIN servidor_maquina AS sm ON cs.fkMaquina = sm.idMaquina
    WHERE
    c.tipo = '${componente}'
    AND c.medida = 'Porcentagem'
    AND sm.idMaquina = ${idMaquina}
    AND YEAR(cd.data) = ${anoEscolhido}
    AND MONTH(cd.data) = ${mesEscolhido}
    GROUP BY CEIL(DAY(cd.data) / 7)
    ORDER BY semana_do_mes;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function dadosGraficoUsoMensal(idMaquina, componente, anoEscolhido) {
    var instrucaoSql = `
    select month(capturaDados.data) as mes,ROUND(AVG(capturaDados.valor),2) as media_utilizacao FROM capturaDados
    JOIN componenteServidor ON fkComponenteServidor = idComponenteServidor
    JOIN componente c ON fkComponente = idcomponente
        JOIN servidor_maquina ON idMaquina = fkMaquina
    WHERE 
        c.tipo = '${componente}' 
        AND c.medida = 'Porcentagem'
        AND servidor_maquina.idMaquina = ${idMaquina}
        AND year(capturaDados.data) = ${anoEscolhido}
        group by mes
        order by mes;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function dadosGraficoAlertaMensal(idMaquina, componente, anoEscolhido) {
    var instrucaoSql = `
    SELECT 
    MONTH(dataHora) AS mes,
    SUM(CASE WHEN prioridade = 'Média' THEN 1 ELSE 0 END) AS alertasMedios,
    SUM(CASE WHEN prioridade = 'Crítica' THEN 1 ELSE 0 END) AS alertasCriticos
FROM 
    alerta a
    JOIN capturaDados ON fkCapturaDados = idCapturaDados
    JOIN componenteServidor ON fkComponenteServidor = idComponenteServidor
    JOIN servidor_maquina ON idMaquina = fkMaquina
    WHERE 
    a.componente = '${componente}' AND servidor_maquina.idMaquina = ${idMaquina}
    AND YEAR(dataHora) = ${anoEscolhido}
GROUP BY 
    MONTH(dataHora)
    ORDER BY month(dataHora);
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function dadosGraficoAlertaAnual(idMaquina, componente) {
    var instrucaoSql = `
        SELECT 
    YEAR(dataHora) AS ano,
    SUM(CASE WHEN prioridade = 'Média' THEN 1 ELSE 0 END) AS alertasMedios,
    SUM(CASE WHEN prioridade = 'Crítica' THEN 1 ELSE 0 END) AS alertasCriticos
FROM 
    alerta a
    JOIN capturaDados ON fkCapturaDados = idCapturaDados
    JOIN componenteServidor ON fkComponenteServidor = idComponenteServidor
    JOIN servidor_maquina ON idMaquina = fkMaquina
    WHERE 
     a.componente = '${componente}' AND servidor_maquina.idMaquina = ${idMaquina}
GROUP BY 
    YEAR(dataHora)
    ORDER BY ano;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function dadosPredicaoAlertaSemanal(idMaquina, componente) {
    var instrucaoSql = `
   SELECT
  CEIL(DAY(a.dataHora) / 7) AS semana_do_mes,
  COUNT(a.idAlerta) AS quantidade_alertas
FROM alerta a
JOIN capturaDados cd ON a.fkCapturaDados = cd.idCapturaDados
JOIN componenteServidor cs ON cd.fkComponenteServidor = cs.idcomponenteServidor
JOIN servidor_maquina sm ON cs.fkMaquina = sm.idMaquina
WHERE
  a.componente = '${componente}'
  AND sm.idMaquina = ${idMaquina}
  AND YEAR(a.dataHora) = YEAR(CURDATE())
  AND MONTH(a.dataHora) = MONTH(CURDATE()) 
GROUP BY CEIL(DAY(a.dataHora) / 7)
ORDER BY semana_do_mes;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

module.exports = {
    obterParametrosComponente,
    obterAnosDisponiveis,
    obterMesesDisponiveis,
    obterAlertasMes,
    obterMediaUso,
    obterTempoMtbf,
    dadosGraficoUsoSemanal,
    dadosGraficoUsoMensal,
    dadosGraficoAlertaMensal,
    dadosGraficoAlertaAnual,
    dadosPredicaoAlertaSemanal
}