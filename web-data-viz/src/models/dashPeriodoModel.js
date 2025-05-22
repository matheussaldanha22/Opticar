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
    where fkFabrica = ${idFabrica} and year(dataHora) = ${ano} and month(dataHora) = ${mes}
    group by semana
    order by semana asc;    
    `

    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executarFRIO(instrucaoSql)
}

module.exports ={
    obterSemana
}