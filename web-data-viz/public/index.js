const express = require("express")
const fs = require("fs")
const path = require("path")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())

const arquivoJson = path.join(__dirname, "dados.json")

app.get("/alertas", (req, res) => {
  fs.readFile(arquivoJson, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Erro ao ler o arquivo.")
    }

    try {
      const conteudo = JSON.parse(data)
      console.log(conteudo)
      res.json(conteudo)
    } catch (erro) {
      res.status(500).send("Erro ao interpretar o JSON.")
    }
  })
})

app.post("/cadastrarAlerta", (req, res) => {
  const {
    id,
    servidor,
    componente,
    dtAlerta,
    gravidade,
    status,
    metricaRegistrada,
    tipoMetrica,
  } = req.body

  if (!servidor) {
    return res.status(400).send('O campo "nome" é obrigatório.')
  } else if (!componente) {
    return res.status(400).send('O campo "componente" é obrigatório.')
  }

  // Lê o conteúdo atual do arquivo
  else
    fs.readFile(arquivoJson, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Erro ao ler o arquivo.")
      }

      let dados = []

      try {
        dados = JSON.parse(data)
      } catch (erro) {
        return res.status(500).send("Erro ao interpretar o arquivo JSON.")
      }

      // Adiciona novo nome à lista
      dados.push({
        id,
        servidor,
        componente,
        dtAlerta,
        gravidade,
        status,
        metricaRegistrada,
        tipoMetrica,
      })

      // Salva de volta no arquivo
      fs.writeFile(arquivoJson, JSON.stringify(dados, null, 2), (err) => {
        if (err) {
          return res.status(500).send("Erro ao salvar no arquivo.")
        }

        res.send(`Servidor "${servidor}" adicionado com sucesso!`)
      })
    })
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
