var database = require("../database/config")

function listarFabricasEmpresa(idEmpresa) {
  var instrucaoSql = `
                        SELECT 
                          f.idfabrica,
                          f.nome AS nomeFabrica,
                          f.limiteCritico,
                          f.limiteAtencao,
                          f.telefone,
                          u.nome AS nomeGestor
                      FROM fabrica f
                      LEFT JOIN usuario u 
                          ON u.fkFabrica = f.idfabrica AND u.cargo = 'GestorInfra'
                      WHERE f.fkEmpresa = ${idEmpresa};
    `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function cadastrarGestorFabrica(idGestor, idFabrica) {
  var instrucaoSql = `
      UPDATE fabrica SET fkGestorInfra = ${idGestor} WHERE idfabrica = ${idFabrica}`
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function cadastrar(nome, funcao, limiteA, limiteG) {
    var instrucaoSql = `insert into fabrica (nome, funcao, limitecritico, limiteatencao) values
    ('${nome}', '${funcao}', ${limiteG}, ${limiteA})`;

    return database.executarFRIO(instrucaoSql);
}

function verificaAlertas() {
  var instrucaoSql = `SELECT 
      servidor.fkFabrica, 
      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'aberto' THEN 1 END) AS qtd_to_do,
      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'em andamento' THEN 1 END) AS qtd_in_progress,
      COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'resolvido' THEN 1 END) AS qtd_done
    FROM servidor_maquina AS servidor
    LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
    LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
    LEFT JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados
    GROUP BY servidor.fkFabrica
    ORDER BY (qtd_to_do + qtd_in_progress) DESC;`;
  return database.executarQUENTE(instrucaoSql);
}

function verificarAlertasPorId(idFabrica) {
  var instrucaoSql = `SELECT servidor.fkFabrica, COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'aberto' THEN 1 END) AS qtd_to_do,
							   COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'em andamento' THEN 1 END) AS qtd_in_progress,
							   COUNT(CASE WHEN LOWER(alerta.statusAlerta) = 'resolvido' THEN 1 END) AS qtd_done
								FROM servidor_maquina AS servidor
								LEFT JOIN componenteServidor ON servidor.idMaquina = componenteServidor.fkMaquina
								LEFT JOIN capturaDados AS captura ON componenteServidor.idcomponenteServidor = captura.fkComponenteServidor
								INNER JOIN alerta ON captura.idCapturaDados = alerta.fkCapturaDados
								where servidor.fkFabrica = ${idFabrica};`;

  return database.executarQUENTE(instrucaoSql);
}


function listarFabricas() {
  var instrucaoSql = `SELECT f.idfabrica AS idFabrica, f.nome AS nomeFabrica, f.limiteAtencao, f.limiteCritico, u.nome AS nomeGestorFabrica 
    FROM fabrica AS f LEFT JOIN usuario AS u ON u.fkFabrica = f.idfabrica AND u.cargo = 'GestorInfra';`

  return database.executarFRIO(instrucaoSql)
}

function infoFabrica(idFabrica) {
  var instrucaoSql = `SELECT f.idfabrica AS idFabrica, f.nome AS nomeFabrica, f.limiteAtencao, f.limiteCritico, u.nome AS nomeGestorFabrica, f.telefone
    FROM fabrica AS f LEFT JOIN usuario AS u ON u.fkFabrica = f.idfabrica AND u.cargo = 'GestorFabrica' WHERE idfabrica = ${idFabrica};`

  return database.executarFRIO(instrucaoSql)
}

function excluirFabrica(id) {
  var instrucaoSql = `DELETE FROM fabrica WHERE idfabrica = ${id}`

  return database.executarFRIO(instrucaoSql)
}

function excluirFabricaFrio(id) {
  var instrucaoSql = `DELETE FROM servidor_maquina WHERE fkFabrica = ${id};`

  return database.executarQUENTE(instrucaoSql)
}

function modalUpdate(id) {
  var instrucaoSql = `select * from fabrica where idFabrica = ${id};`

  return database.executarFRIO(instrucaoSql)
}


function updateFabrica(id, nome, funcao, limiteA, limiteG) {
  var instrucaoSql = `UPDATE fabrica SET nome = '${nome}', funcao = '${funcao}', limiteAtencao = ${limiteA}, limiteCritico = ${limiteG} WHERE idfabrica = ${id};`;

  console.log("SQL:", instrucaoSql);
  return database.executarFRIO(instrucaoSql);
  
}

module.exports = {
  listarFabricasEmpresa,
  cadastrarGestorFabrica,
  cadastrar,
  verificaAlertas,
  listarFabricas,
  excluirFabrica,
  excluirFabricaFrio,
  modalUpdate,
  updateFabrica,
  infoFabrica,
  verificarAlertasPorId
}
