var ambiente_processo = "producao";
// var ambiente_processo = "desenvolvimento";
var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";

const { GoogleGenAI } = require("@google/genai");
const path = require("path");
const express = require("express");
const puppeteer = require('puppeteer');
var cors = require("cors");

require("dotenv").config({ path: caminho_env });

const chatIA = new GoogleGenAI({ apiKey: process.env.MINHA_CHAVE });
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var mysqlRouter = require("./src/routes/mysql");
var awsRouter = require("./src/routes/aws");
var awsGestorInfraRouter = require("./src/routes/awsGestorInfra");
var envioArquivoRouter = require("./src/routes/enviarGestorInfra");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/mysql", mysqlRouter);
app.use("/aws", awsRouter);
app.use('/awsGestorinfra', awsGestorInfraRouter);
app.use('/awsUpload', envioArquivoRouter);

app.listen(PORTA_APP, () => {
    console.log(`Servidor rodando em http://${HOST_APP}:${PORTA_APP}`);
});

app.post("/perguntar", async (req, res) => {
    const pergunta = req.body.perguntaServer;

    try {
        const resultado = await gerarResposta(pergunta);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(resultado);
        
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post("/pdf", async (req, res) => {
    const respostas = req.body.respostaBOB;
    const nome = req.body.nomeArquivo

    try {
        const pdfBuffer = await htmlParaPdf(respostas);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${nome}"`);
        res.send(pdfBuffer);
        
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

async function gerarResposta(mensagem) {
    try {
        const modeloIA = chatIA.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `Somos a OptiCars, empresa que monitora hardware de servidores SCADA para fábricas do setor automotivo. Cada fábrica tem servidores e usuários com funções específicas: Analista de Suporte: monitora alertas e processos em tempo real por fábrica. Analista de Dados: analisa padrões de falhas. Tem dashboards de: Periodicidade de alertas (por mês, dia, servidor, volume de Pix). Riscos de componentes (KPIs, histórico, predições). Gestor de Infraestrutura: vê criticidade dos servidores da fábrica, preços de componentes, previsões de custo e sua precisão. Administrador: acompanha o estado geral das fábricas, alertas em aberto, predições com base em MTBF e tempo de resolução. 

            IMPORTANTE: Retorne APENAS HTML válido, sem \`\`\`html no início ou \`\`\` no final. Sem explicações extras. Apenas HTML puro.

            Pergunta: ${mensagem}`
        });

        var resposta = (await modeloIA).text;
        
        resposta = resposta
            .replace(/^```html\s*/, "")  
            .replace(/```$/, "") 
            .trim();

        const tokens = (await modeloIA).usageMetadata;
        console.log(resposta);
        console.log("Uso de Tokens:", tokens);
        
        return resposta;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function htmlParaPdf(respostas) {
    return new Promise((resolve, reject) => {
        const options = { format: 'A4' };

        pdf.create(respostas, options).toBuffer((erro, buffer) => {
            if (erro) {
                console.error('Erro htmlParaPdf:', erro);
                reject(erro);
            } else {
                resolve(buffer);
            }
        });
    });
}