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

    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function obterComponente(idFabrica, ano, mes) {
    var instrucaoSql = `select componente, count(idAlerta) as alerta, hour(dataHora) as hora,
    case 
	when hour(dataHora)  > 5 and hour(dataHora) <12 then 'Manhã'
    when hour(dataHora)  > 11 and hour(dataHora) <18 then 'Tarde'
    when hour(dataHora)  > 18 and hour(dataHora) <24 then 'Noite'
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
    group by hora, componente, periodo
    order by componente desc
    limit 1; `

    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

function obterPeriodo(idFabrica, ano, mes) {
    var instrucaoSql = `
    select 
    count(*) as total_alertas,
    case 
        when hour(dataHora) > 5 and hour(dataHora) < 12 then 'Manhã'
        when hour(dataHora) > 11 and hour(dataHora) < 18 then 'Tarde'
        when hour(dataHora) > 17 and hour(dataHora) < 24 then 'Noite'
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
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
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
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarQUENTE(instrucaoSql)
}

module.exports ={
    obterSemana,
    obterComponente,
    obterPeriodo,
    obterDia
}