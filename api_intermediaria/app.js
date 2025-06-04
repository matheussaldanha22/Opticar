// var ambiente_processo = "producao";
var ambiente_processo = "desenvolvimento";

var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const express = require("express");
var cors = require("cors");

require("dotenv").config({path: caminho_env});

const chatIA = new GoogleGenerativeAI(process.env.MINHA_CHAVE);
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var mysqlRouter = require("./src/routes/mysql");
var awsRouter = require("./src/routes/aws");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use("/mysql", mysqlRouter);
app.use("/aws", awsRouter);

app.post("/perguntar", async (req, res) => {
    const pergunta = req.body.pergunta;

    try {
        const resultado = await gerarResposta(pergunta);
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }

});

async function gerarResposta(mensagem) {

    try {
        const modeloIA = chatIA.models.getGenerativeModel({
            model: "gemini-2.0-flash",
            contents: `Estou realizando um projeto acadêmico, nesse projeto nós somos uma companhia chamada OptiCars, somos uma companhia que faz monitoramento de hardware de servidores Scada no setor de indústria automobilistica, aonde tem a empresa, que por sua vez tem várias fábricas que por sua vez cada fábrica pode ter vários servidores, e temos personas que cuidam de respectivas áreas, temos a persona de analista de suporte que faz o monitoramento em tempo real dos servidores de sua respectiva fábrica, verificando os alertas gerados e tentando cuidar dos componentes, para eles temos um dashboard que  : ${mensagem}`
        });
        
        const resposta = (await modeloIA).text;
        const tokens = (await modeloIA).usageMetadata;

        console.log(resposta);
        console.log("Uso de Tokens:", tokens);

        return resposta;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


app.listen(PORTA_APP, () => {
    console.log(`Servidor rodando em http://${HOST_APP}:${PORTA_APP}`);
});



