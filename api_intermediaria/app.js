// var ambiente_processo = "producao";
var ambiente_processo = "desenvolvimento";

var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";

const path = require("path");
const express = require("express");
var cors = require("cors");

require("dotenv").config({path: caminho_env});

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


app.listen(PORTA_APP, () => {
    console.log(`Servidor rodando em http://${HOST_APP}:${PORTA_APP}`);
});

