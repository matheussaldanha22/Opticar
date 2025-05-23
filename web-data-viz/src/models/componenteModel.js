var database = require("../database/config");

function listarTipo() {
    var instrucaoSql = `SELECT DISTINCT tipo FROM componente;`;
    return database.executar(instrucaoSql);
}

function listarMedida(tipoSelecionado) {
    var instrucaoSql = `SELECT DISTINCT medida FROM componente WHERE tipo = '${tipoSelecionado}';`;
    return database.executar(instrucaoSql);
}

function verificar(tipo, medida) {
    var instrucaoSql = `select idcomponente from componente WHERE tipo = "${tipo}" && medida = "${medida}";`
    return database.executar(instrucaoSql);
}

function cadastrar(codigo, modelo, limiteA, limiteG, idMaquina) {
    var instrucaoSql = `insert into componenteServidor (fkcomponente, fkmaquina, modelo, limiteCritico, limiteAtencao) values
    (${codigo}, ${idMaquina}, '${modelo}', '${limiteG}', '${limiteA}')`;

    return database.executar(instrucaoSql);
}

function cadastrarFrio(codigo, modelo, limiteA, limiteG, idMaquina) {
    var instrucaoSql = `insert into componenteServidor (fkcomponente, fkmaquina, modelo, limiteCritico, limiteAtencao) values
    (${codigo}, ${idMaquina}, '${modelo}', '${limiteG}', '${limiteA}')`;

    return database.executarFRIO(instrucaoSql);
}

function listarComponentes(idMaquina) {
    var instrucaoSql = `SELECT cs.idcomponenteServidor, cs.fkMaquina, c.tipo, c.medida, c.indicador, cs.modelo, cs.limiteCritico, cs.limiteAtencao 
FROM componenteServidor AS cs JOIN componente AS c ON cs.fkComponente = c.idcomponente WHERE fkMaquina = ${idMaquina} ;`
    
    return database.executar(instrucaoSql);
}

function excluirComponente(id) {
    var instrucaoSql = `DELETE FROM componenteServidor WHERE idcomponenteServidor = ${id};`;
    return database.executar(instrucaoSql);
}

function excluirComponenteFrio(id) {
    var instrucaoSql = `DELETE FROM componenteServidor WHERE idcomponenteServidor = ${id};`;
    return database.executarFRIO(instrucaoSql);
}

module.exports ={ 
    listarTipo,
    listarMedida,
    verificar,
    cadastrar,
    cadastrarFrio,
    listarComponentes,
    excluirComponente,
    excluirComponenteFrio
 };