var database = require("../database/config")

function obterSemana(idFabrica, ano, mes){
    var instrucaoSql = `select count(idAlerta) as quantidadeAlertas,
    week(dataHora) AS semana
    from alerta 
    join capturaDados as cap
    on alerta.fkCapturaDados=cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor=comp.idcomponenteServidor
    join servidor_maquina as maq
    on  comp.fkMaquina=maq.idMaquina
    where fkFabrica = ${idFabrica} 
    and year(dataHora) = ${ano} 
    and month(dataHora) = ${mes}
    group by semana
    order by semana asc;    
    `

    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function obterComponente(idFabrica, ano, mes) {
    var instrucaoSql = `select componente, count(idAlerta) as alerta,
    case 
	WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
    WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
    WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
    else 'Madrugada'
    end as periodo
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados=cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor=comp.idcomponenteServidor
    join servidor_maquina as maq
    on  comp.fkMaquina=maq.idMaquina
    where year(dataHora) = ${ano} 
    and month(dataHora) = ${mes}
    and fkFabrica = ${idFabrica}
    group by componente, periodo
    order by alerta desc
    limit 1; `

    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function obterPeriodo(idFabrica, ano, mes) {
    var instrucaoSql = `
    select 
    count(*) as total_alertas,
    case 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        else 'Madrugada'
    end as periodo
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados = cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor = comp.idcomponenteServidor
    join servidor_maquina as maq
    on comp.fkMaquina = maq.idMaquina
    where 
    year(dataHora) = ${ano}
    and month(dataHora) = ${mes}
    and fkFabrica = ${idFabrica}
    group by periodo
    order by total_alertas desc
    limit 1;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function obterDia(idFabrica, ano, mes) {
    var instrucaoSql = `
    select 
	count(idAlerta) as qtdalerta, 
    day(dataHora) as dia
    from alerta
    join capturaDados as cap
	on alerta.fkCapturaDados=cap.idCapturaDados
	join componenteServidor as comp
	on cap.fkcomponenteServidor=comp.idcomponenteServidor
	join servidor_maquina as maq
	on  comp.fkMaquina=maq.idMaquina
	where year(dataHora) = ${ano}
    and month(dataHora) = ${mes}
    and fkFabrica = ${idFabrica}
    group by dia
    order by qtdalerta desc
    limit 1;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function alertasPeriodo(idFabrica, ano, mes) {
    var instrucaoSql = `
    SELECT  COUNT(idAlerta) as qtdalertas, 
		componente,
		CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
		END as periodo
		FROM alerta
		JOIN capturaDados as cap 
        ON alerta.fkCapturaDados = cap.idCapturaDados
		JOIN componenteServidor as comp 
        ON cap.fkcomponenteServidor = comp.idcomponenteServidor
		JOIN servidor_maquina as maq 
		ON comp.fkMaquina = maq.idMaquina
		WHERE YEAR(dataHora) = ${ano}
		AND MONTH(dataHora) = ${mes}
		AND fkFabrica = ${idFabrica}
		GROUP BY componente, periodo
		ORDER BY periodo;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function tabelaProcesso(idFabrica, ano, mes) {
    var instrucaoSql = `
    SELECT COUNT(idAlerta) AS alerta, 
        DATE_FORMAT(dataHora, "%e %m %Y") AS dataP,
        processo,
        prioridade,
        CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
    END AS periodo
    FROM alerta
    INNER JOIN capturaDados AS cap ON alerta.fkCapturaDados = cap.idCapturaDados
    JOIN componenteServidor AS comp ON cap.fkcomponenteServidor = comp.idcomponenteServidor
    JOIN servidor_maquina AS maq ON comp.fkMaquina = maq.idMaquina
    WHERE 
    YEAR(dataHora) = ${ano}
    AND MONTH(dataHora) = ${mes}
    AND fkFabrica = ${idFabrica}
    AND processo IS NOT NULL
    GROUP BY processo, dataP, periodo, prioridade
    ORDER BY alerta desc
    LIMIT 5;     
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function servidorGrafico(idFabrica, idServidor, ano, mes) {
    var instrucaoSql = `
    SELECT  COUNT(idAlerta) as qtdalertas, 
		componente,
		CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
		END as periodo
		FROM alerta
		JOIN capturaDados as cap 
        ON alerta.fkCapturaDados = cap.idCapturaDados
		JOIN componenteServidor as comp 
        ON cap.fkcomponenteServidor = comp.idcomponenteServidor
		JOIN servidor_maquina as maq 
		ON comp.fkMaquina = maq.idMaquina
		WHERE YEAR(dataHora) = ${ano}
		AND MONTH(dataHora) = ${mes}
		AND fkFabrica = ${idFabrica}
        and idMaquina = ${idServidor}
		GROUP BY componente, periodo
		ORDER BY qtdAlertas;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function tabelaServidor(idFabrica, idServidor, ano, mes) {
    var instrucaoSql = `
    SELECT COUNT(idAlerta) AS alerta, 
    DATE_FORMAT(dataHora, "%e %m %Y") AS dataP,
    processo,
    prioridade,
    CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
    END AS periodo
    FROM alerta
    INNER JOIN capturaDados AS cap ON alerta.fkCapturaDados = cap.idCapturaDados
    JOIN componenteServidor AS comp ON cap.fkcomponenteServidor = comp.idcomponenteServidor
    JOIN servidor_maquina AS maq ON comp.fkMaquina = maq.idMaquina
    WHERE 
    YEAR(dataHora) = ${ano}
    AND MONTH(dataHora) = ${mes}
    AND fkFabrica = ${idFabrica}
    AND idMaquina = ${idServidor}
    AND processo IS NOT NULL
    GROUP BY processo, dataP, periodo, prioridade
    ORDER BY alerta desc
    LIMIT 5;                               
    `
    // console.log("Executando a instrução sql: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}



function diaServidor(idFabrica, idServidor, ano, mes) {
    var instrucaoSql = `
    select 
	count(idAlerta) as qtdalerta, 
    day(dataHora) as dia
    from alerta
    join capturaDados as cap
	on alerta.fkCapturaDados=cap.idCapturaDados
	join componenteServidor as comp
	on cap.fkcomponenteServidor=comp.idcomponenteServidor
	join servidor_maquina as maq
	on  comp.fkMaquina=maq.idMaquina
	where year(dataHora) = ${ano}
    and month(dataHora) = ${mes}
    and fkFabrica = ${idFabrica}
    and idMaquina = ${idServidor}
    group by dia
    order by qtdalerta desc
    limit 1;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function periodoServer(idFabrica,idServidor, ano, mes) {
    var instrucaoSql = `
    select 
    count(*) as total_alertas,
    case 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        else 'Madrugada'
    end as periodo
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados = cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor = comp.idcomponenteServidor
    join servidor_maquina as maq
    on comp.fkMaquina = maq.idMaquina
    where 
    year(dataHora) = ${ano}
    and month(dataHora) = ${mes}
    and fkFabrica = ${idFabrica}
    and idMaquina = ${idServidor}
    group by periodo
    order by total_alertas desc
    limit 1;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function componenteServer(idFabrica, idServidor,ano, mes) {
    var instrucaoSql = ` select componente, count(idAlerta) as alerta,
    case 
    WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
    else 'Madrugada'
    end as periodo
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados=cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor=comp.idcomponenteServidor
    join servidor_maquina as maq
    on  comp.fkMaquina=maq.idMaquina
    where year(dataHora) = ${ano}
    and month(dataHora) = ${mes}
    and fkFabrica = ${idFabrica}
    and idMaquina = ${idServidor}
    group by  componente, periodo
    order by alerta desc
    limit 1;  `

    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function semanaServer(idFabrica, idServidor, ano, mes){
    var instrucaoSql = `select count(idAlerta) as quantidadeAlertas,
    week(dataHora) AS semana
    from alerta 
    join capturaDados as cap
    on alerta.fkCapturaDados=cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor=comp.idcomponenteServidor
    join servidor_maquina as maq
    on  comp.fkMaquina=maq.idMaquina
    where fkFabrica = ${idFabrica} 
    and year(dataHora) = ${ano} 
    and month(dataHora) = ${mes}
    and idMaquina = ${idServidor}
    group by semana
    order by semana asc;    
    `

    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function diaComp(idFabrica, ano, mes,dia) {
    var instrucaoSql = `select componente, count(idAlerta) as alerta,
    case 
	WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
    WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
    WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
    else 'Madrugada'
    end as periodo
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados=cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor=comp.idcomponenteServidor
    join servidor_maquina as maq
    on  comp.fkMaquina=maq.idMaquina
    where year(dataHora) = ${ano} 
    and month(dataHora) = ${mes} 
    and fkFabrica = ${idFabrica}
    and day(dataHora) = ${dia}
    group by componente, periodo
    order by alerta desc
    limit 1; `

    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}


function periodoDia(idFabrica, ano, mes, dia) {
    var instrucaoSql = `
    select 
    count(*) as total_alertas,
    case 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        else 'Madrugada'
    end as periodo
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados = cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor = comp.idcomponenteServidor
    join servidor_maquina as maq
    on comp.fkMaquina = maq.idMaquina
    where 
    year(dataHora) = ${ano}
    and month(dataHora) = ${mes}
    and day(dataHora) = ${dia}
    and fkFabrica = ${idFabrica}
    group by periodo
    order by total_alertas desc
    limit 1;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function diaGrafico(idFabrica, ano, mes,dia) {
    var instrucaoSql = `
    SELECT  COUNT(idAlerta) as qtdalertas, 
		componente,
		CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
		END as periodo
		FROM alerta
		JOIN capturaDados as cap 
        ON alerta.fkCapturaDados = cap.idCapturaDados
		JOIN componenteServidor as comp 
        ON cap.fkcomponenteServidor = comp.idcomponenteServidor
		JOIN servidor_maquina as maq 
		ON comp.fkMaquina = maq.idMaquina
		WHERE YEAR(dataHora) = ${ano}
		AND MONTH(dataHora) = ${mes}
        AND DAY(dataHora) = ${dia}
		AND fkFabrica = ${idFabrica}
		GROUP BY componente, periodo
		ORDER BY qtdAlertas;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function diaProcesso(idFabrica, ano, mes,dia) {
    var instrucaoSql = `
    SELECT COUNT(idAlerta) AS alerta, 
        DATE_FORMAT(dataHora, "%e %m %Y") AS dataP,
        processo,
        prioridade,
        CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
    END AS periodo
    FROM alerta
    INNER JOIN capturaDados AS cap ON alerta.fkCapturaDados = cap.idCapturaDados
    JOIN componenteServidor AS comp ON cap.fkcomponenteServidor = comp.idcomponenteServidor
    JOIN servidor_maquina AS maq ON comp.fkMaquina = maq.idMaquina
    WHERE 
    YEAR(dataHora) = ${ano}
    AND MONTH(dataHora) = ${mes}
     AND DAY(dataHora) = ${dia}
    AND fkFabrica = ${idFabrica}
    AND processo IS NOT NULL
    GROUP BY processo, dataP, periodo, prioridade
    ORDER BY alerta desc
    LIMIT 5;     
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function diaServerComp(idFabrica,idServidor, ano, mes, dia) {
var instrucaoSql = `select componente, count(idAlerta) as alerta, hour(dataHora) as hora,
    case 
	WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
    WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
    WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
    else 'Madrugada'
    end as periodo
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados=cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor=comp.idcomponenteServidor
    join servidor_maquina as maq
    on  comp.fkMaquina=maq.idMaquina
    where year(dataHora) = ${ano} 
    and month(dataHora) = ${mes} 
    and day(dataHora) = ${dia}
    and fkFabrica = ${idFabrica}
    and idMaquina = ${idServidor}
    group by hora, componente, periodo
    order by alerta desc
    limit 1; `

    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}


function diaServerPeriodo(idFabrica,idServidor, ano, mes, dia) {
    var instrucaoSql = `
    select 
    count(*) as total_alertas,
    case 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        else 'Madrugada'
    end as periodo
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados = cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor = comp.idcomponenteServidor
    join servidor_maquina as maq
    on comp.fkMaquina = maq.idMaquina
    where 
    year(dataHora) = ${ano}
    and month(dataHora) = ${mes}
    and day(dataHora) = ${dia}
    and fkFabrica = ${idFabrica}
    and idMaquina = ${idServidor}
    group by periodo
    order by total_alertas desc
    limit 1;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function diaServerGrafico(idFabrica, idServidor, ano, mes,dia) {
    var instrucaoSql = `
    SELECT  COUNT(idAlerta) as qtdalertas, 
		componente,
		CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
		END as periodo
		FROM alerta
		JOIN capturaDados as cap 
        ON alerta.fkCapturaDados = cap.idCapturaDados
		JOIN componenteServidor as comp 
        ON cap.fkcomponenteServidor = comp.idcomponenteServidor
		JOIN servidor_maquina as maq 
		ON comp.fkMaquina = maq.idMaquina
		WHERE YEAR(dataHora) = ${ano}
		AND MONTH(dataHora) = ${mes}
        AND DAY(dataHora) = ${dia}
		AND fkFabrica = ${idFabrica}
        and idMaquina = ${idServidor}
		GROUP BY componente, periodo
		ORDER BY qtdAlertas;
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}


function diaServerProcesso(idFabrica, idServidor, ano, mes,dia) {
    var instrucaoSql = `
    SELECT COUNT(idAlerta) AS alerta, 
        DATE_FORMAT(dataHora, "%e %m %Y") AS dataP,
        processo,
        prioridade,
        CASE 
        WHEN HOUR(dataHora) BETWEEN 6 AND 11 THEN 'Manhã'
        WHEN HOUR(dataHora) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN HOUR(dataHora) BETWEEN 18 AND 23 THEN 'Noite'
        ELSE 'Madrugada'
    END AS periodo
    FROM alerta
    INNER JOIN capturaDados AS cap ON alerta.fkCapturaDados = cap.idCapturaDados
    JOIN componenteServidor AS comp ON cap.fkcomponenteServidor = comp.idcomponenteServidor
    JOIN servidor_maquina AS maq ON comp.fkMaquina = maq.idMaquina
    WHERE 
    YEAR(dataHora) = ${ano}
    AND MONTH(dataHora) = ${mes}
     AND DAY(dataHora) = ${dia}
    AND fkFabrica = ${idFabrica}
    AND idMaquina = ${idServidor}
    AND processo IS NOT NULL
    GROUP BY processo, dataP, periodo, prioridade
    ORDER BY alerta desc
    LIMIT 5;     
    `
    // console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function dadosComponentes(ano,mes,idFabrica) {
    var instrucaoSql = `
     select alerta.valor, componente 
    from alerta
    join capturaDados as cap
    on alerta.fkCapturaDados = cap.idCapturaDados
    join componenteServidor as comp
    on cap.fkcomponenteServidor = comp.idcomponenteServidor
    join servidor_maquina as maq
    on comp.fkMaquina = maq.idMaquina
    where 
    year(dataHora) = ${ano}
    and month(dataHora) = ${mes}
    and fkFabrica = ${idFabrica}
    order by valor;
    
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)

}
module.exports = {
    obterSemana,
    obterComponente,
    obterPeriodo,
    obterDia,
    tabelaProcesso,
    servidorGrafico,
    tabelaServidor,
    diaServidor,
    periodoServer,
    periodoServer,
    componenteServer,
    semanaServer,
    alertasPeriodo,
    diaComp,
    periodoDia,
    diaGrafico,
    diaProcesso,
    diaServerComp,
    diaServerPeriodo,
    diaServerGrafico,
    diaServerProcesso,
    dadosComponentes

}