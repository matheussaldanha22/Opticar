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

function qtdServidoresPorFabrica(idFabrica) {
  var instrucaoSql = `
  select count(*) as qtdServidores from servidor_Maquina where fkFabrica = ${idFabrica};
  `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarQUENTE(instrucaoSql)
}


function filtroMedida(idMaquina){
  var instrucaoSql = `
  SELECT componente.tipo as componente, componente.medida as medida from componente 
	JOIN componenteServidor ON  componenteServidor.fkComponente = componente.idcomponente
    WHERE componenteServidor.fkMaquina = ${idMaquina};  
  `
  return database.executarQUENTE(instrucaoSql)
}

function inserirProcesso(pid, nome, fkServidorMaquina){
  var instrucaoSql = `
    INSERT INTO pedidoProcesso (pid, nome, fkServidor_maquina) VALUES
    (${pid}, '${nome}', ${fkServidorMaquina})
  `
  return database.executarQUENTE(instrucaoSql)
}

module.exports = {
  obterParametrosComponente,
  qtdServidoresPorFabrica,
  filtroMedida,
  inserirProcesso
}
