var mysql = require("mysql2");

var mySqlConfigFrio = {
    host: process.env.DB_HOST_FRIO,
    database: process.env.DB_DATABASE_FRIO,
    user: process.env.DB_USER_FRIO,
    password: process.env.DB_PASSWORD_FRIO,
    port: process.env.DB_PORT_FRIO
};

var mySqlConfigQuente = {
    host: process.env.DB_HOST_QUENTE,
    database: process.env.DB_DATABASE_QUENTE,
    user: process.env.DB_USER_QUENTE,
    password: process.env.DB_PASSWORD_QUENTE,
    port: process.env.DB_PORT_QUENTE
};


function executarFrio(instrucao) {
    if (!["producao", "desenvolvimento"].includes(process.env.AMBIENTE_PROCESSO)) {
        console.error("Erro: Ambiente (produção OU desenvolvimento) não foi definido no arquivo .env.");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise((resolve, reject) => {
        const conexao = mysql.createConnection(mySqlConfigFrio);
        conexao.connect((erro) => {
            if (erro) {
                console.error("Erro ao conectar ao MySQL:", erro.message);
                return reject(erro);
            }
            conexao.query(instrucao, (erro, resultados) => {
                if (erro) {
                    console.error("Erro ao executar a consulta:", erro.message);
                    return reject(erro);
                }
                console.log("Resultados:", resultados);
                resolve(resultados);
            });
            conexao.end((erro) => {
                if (erro) console.error("Erro ao fechar a conexão:", erro.message);
            });
        });
        conexao.on("error", (erro) => {
            console.error("Erro no MySQL Server:", erro.sqlMessage);
        });
    });
}

function executarQuente(instrucao) {
    if (!["producao", "desenvolvimento"].includes(process.env.AMBIENTE_PROCESSO)) {
        console.error("Erro: Ambiente (produção OU desenvolvimento) não foi definido no arquivo .env.");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise((resolve, reject) => {
        const conexao = mysql.createConnection(mySqlConfigQuente);
        conexao.connect((erro) => {
            if (erro) {
                console.error("Erro ao conectar ao MySQL:", erro.message);
                return reject(erro);
            }
            conexao.query(instrucao, (erro, resultados) => {
                if (erro) {
                    console.error("Erro ao executar a consulta:", erro.message);
                    return reject(erro);
                }
                console.log("Resultados:", resultados);
                resolve(resultados);
            });
            conexao.end((erro) => {
                if (erro) console.error("Erro ao fechar a conexão:", erro.message);
            });
        });
        conexao.on("error", (erro) => {
            console.error("Erro no MySQL Server:", erro.sqlMessage);
        });
    });
}

module.exports = {
    executarFrio,
    executarQuente
};