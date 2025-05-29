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
          SELECT 
            usuario.idusuario AS id,
            usuario.nome,
            usuario.email,
            usuario.cargo,
            empresa.idempresa AS empresaId,
            empresa.nome AS empresaNome,
            usuario.fkFabrica AS idFabrica,
            fabrica.nome AS nomeFabrica
          FROM 
            usuario
          LEFT JOIN 
            fabrica ON usuario.fkFabrica = fabrica.idfabrica
          LEFT JOIN 
            empresa ON (
              fabrica.fkEmpresa = empresa.idempresa
              OR empresa.fkGestorEmpresa = usuario.idusuario
            )
          WHERE 
            usuario.email = '${email}'
            AND usuario.senha = '${senha}';
    `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
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
  return database.executarFRIO(instrucaoSql)
}

function listarPorId(idUsuario) {
  var instrucaoSql = `
  SELECT usuario.nome, usuario.cargo FROM usuario WHERE idUsuario = ${idUsuario};
  `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function listarPorEmpresa(idEmpresa) {
  var instrucaoSql = `
    SELECT usuario.idusuario, usuario.nome, usuario.email, usuario.cpf,  usuario.cargo, empresa.nome AS nomeEmpresa, fabrica.nome AS nomeFabrica from usuario
      JOIN fabrica on usuario.fkFabrica = idFabrica
      JOIN empresa on fabrica.fkEmpresa = empresa.idempresa
    WHERE empresa.idempresa = ${idEmpresa} AND usuario.cargo = 'GestorFabrica';
  `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function listarPorFabrica(idFabrica) {
  var instrucaoSql = `
    SELECT usuario.idusuario, usuario.nome, usuario.email, usuario.cpf,  usuario.cargo, fabrica.nome AS nomeFabrica from usuario
      JOIN fabrica on usuario.fkFabrica = idFabrica
      JOIN empresa on fabrica.fkEmpresa = empresa.idempresa
    WHERE fabrica.idFabrica = ${idFabrica} AND usuario.cargo != 'GestorFabrica' AND usuario.cargo != 'GestorEmpresa';
  `
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function atualizarUsuario(idUsuario, nome, email, cpf, cargo) {
  var instrucaoSql = `
UPDATE usuario
SET nome = '${nome}', email = '${email}', cpf='${cpf}', cargo='${cargo}'
WHERE idusuario = ${idUsuario};
`
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

function atualizarUsuarioFabrica(
  idUsuario,
  nome,
  email,
  cpf,
  cargo,
  idFabrica
) {
  var instrucaoSql = `
UPDATE usuario
SET nome = '${nome}', email = '${email}', cpf='${cpf}', cargo='${cargo}', fkFabrica = ${idFabrica}
WHERE idusuario = ${idUsuario};
`
  console.log("Executando a instrução SQL: \n" + instrucaoSql)
  return database.executarFRIO(instrucaoSql)
}

module.exports = {
  autenticar,
  cadastrar,
  listarPorId,
  listarPorEmpresa,
  listarPorFabrica,
  atualizarUsuario,
  atualizarUsuarioFabrica,
}
