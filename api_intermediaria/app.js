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
            contents: `Em um paragráfo responda: ${mensagem}`
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



