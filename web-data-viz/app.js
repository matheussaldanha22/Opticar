// var ambiente_processo = "producao"

var ambiente_processo = "desenvolvimento"

var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev"
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env })

var express = require("express")
var cors = require("cors")
var path = require("path")
var PORTA_APP = process.env.APP_PORT
var HOST_APP = process.env.APP_HOST

var app = express()

var indexRouter = require("./src/routes/index")
var usuarioRouter = require("./src/routes/usuarios")
var avisosRouter = require("./src/routes/avisos")
var fabricasRouter = require("./src/routes/fabricas")
var servidoresRouter = require("./src/routes/servidores")
var empresasRouter = require("./src/routes/empresas")
var componenteRouter = require("./src/routes/componentes")
var listaservidoresRouter = require("./src/routes/listadeservidores")
var alertasRouter = require("./src/routes/alertas")
var adminRouter = require("./src/routes/admin")
var jiraRouter = require("./src/routes/jira")
var dashComponentesRouter = require("./src/routes/dashComponentes")
var dashPeriodoRouter = require("./src/routes/dashPeriodo")
var gestorInfraRouter = require("./src/routes/gestorInfra")
var dashMonitoramentoRouter = require("./src/routes/dashMonitoramento")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

app.use(cors())

app.use("/", indexRouter)
app.use("/usuarios", usuarioRouter)
app.use("/avisos", avisosRouter)
app.use("/fabricas", fabricasRouter)
app.use("/servidores", servidoresRouter)
app.use("/empresas", empresasRouter)
app.use("/componentes", componenteRouter)
app.use("/listadeservidores", listaservidoresRouter)
app.use("/alertas", alertasRouter)
app.use("/admin", adminRouter)
app.use("/jira", jiraRouter)
app.use("/dashComponentes", dashComponentesRouter)
app.use("/dashPeriodo", dashPeriodoRouter)
app.use("/gestorInfra", gestorInfraRouter)
app.use("/dashMonitoramento", dashMonitoramentoRouter)

app.listen(PORTA_APP, function () {
  console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`)
})
