var database = require("../database/config")

// function autenticar(email, senha) {
//     console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
//     var instrucaoSql = `
//         SELECT id, nome, email, fk_empresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
//     `;
//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.executar(instrucaoSql);
// }

function autenticar(email, senha) {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",
    email,
    senha
  )
  var instrucaoSql = `
        SELECT usuario.idusuario AS id, usuario.nome, usuario.email, usuario.cargo, empresa.idempresa AS empresaId, empresa.nome AS empresaNome, usuario.fkFabrica AS idFabrica, fabrica.nome AS nomeFabrica
            FROM 
                usuario
            JOIN 
                fabrica ON usuario.fkFabrica = fabrica.idfabrica
            JOIN 
                empresa ON fabrica.fkEmpresa = empresa.idempresa
            WHERE 
                usuario.email = '${email}' 
                AND usuario.senha = '${senha}';
    `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, cpf, cargo, senha, fkFabrica) {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():",
    nome,
    email,
    cpf,
    cargo,
    senha,
    fkFabrica
  )

  // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
  //  e na ordem de inserção dos dados.
  var instrucaoSql = `
        INSERT INTO usuario (nome, email, cpf, cargo, senha, fkFabrica) VALUES ('${nome}', '${email}', '${cpf}', '${cargo}',  '${senha}', '${fkFabrica}');
    `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

function listarPorId(idUsuario) {
  var instrucaoSql = `
  SELECT usuario.nome, usuario.cargo FROM usuario WHERE idUsuario = ${idUsuario};
  `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executar(instrucaoSql)
}

module.exports = {
  autenticar,
  cadastrar,
  listarPorId,
}
