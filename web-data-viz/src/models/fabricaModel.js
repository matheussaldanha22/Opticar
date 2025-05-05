var database = require("../database/config")

function listarFabricasEmpresa(idEmpresa) {
  var instrucaoSql = `
      SELECT * FROM fabrica where fkEmpresa = ${idEmpresa}

    `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

function cadastrarGestorFabrica(idGestor, idFabrica) {
  var instrucaoSql = `
  UPDATE fabrica SET fkGestorFabrica = ${idGestor} WHERE idfabrica = ${idFabrica}
  `

  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

function cadastrar(nome, funcao, limiteA, limiteG) {
    var instrucaoSql = `insert into fabrica (nome, funcao, limitecritico, limiteatencao) values
    ('${nome}', '${funcao}', ${limiteG}, ${limiteA})`;

    return database.executar(instrucaoSql);
}

function verificaAlertas() {
  var instrucaoSql = `SELECT sm.fkFabrica, COUNT(a.idAlerta) AS quantidade_alertas FROM servidor_maquina sm
                    LEFT JOIN componenteServidor cs ON cs.fkMaquina = sm.idMaquina
                    LEFT JOIN capturaDados cd ON cd.fkComponenteServidor = cs.idcomponenteServidor
                    LEFT JOIN alerta a ON a.fkCapturaDados = cd.idCapturaDados
                    GROUP BY sm.fkFabrica;`;

  return database.executarFRIO(instrucaoSql);
}

function listarFabricas() {
  var instrucaoSql = `SELECT f.idfabrica AS idFabrica, f.nome AS nomeFabrica, f.limiteAtencao, f.limiteCritico, u.nome AS nomeGestorFabrica 
    FROM fabrica AS f LEFT JOIN usuario AS u ON u.fkFabrica = f.idfabrica AND u.cargo = 'GestorFabrica';`

  return database.executar(instrucaoSql)
}

function excluirFabrica(id) {
  var instrucaoSql = `DELETE FROM fabrica WHERE idfabrica = ${id}`

  return database.executar(instrucaoSql)
}

function excluirFabricaFrio(id) {
  var instrucaoSql = `DELETE FROM servidor_maquina WHERE fkFabrica = ${id};`

  return database.executarFRIO(instrucaoSql)
}

function modalUpdate(id) {
  var instrucaoSql = `select * from fabrica where idFabrica = ${id};`

  return database.executar(instrucaoSql)
}


function updateFabrica(id, nome, funcao, limiteA, limiteG) {
  var instrucaoSql = `UPDATE fabrica SET nome = '${nome}', funcao = '${funcao}', limiteAtencao = ${limiteA}, limiteCritico = ${limiteG} WHERE idfabrica = ${id};`;

  console.log("SQL:", instrucaoSql);
  return database.executar(instrucaoSql);
  
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
  updateFabrica
}
