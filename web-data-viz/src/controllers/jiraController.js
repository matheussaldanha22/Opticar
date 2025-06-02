var axios = require("axios");

const username = process.env.ATLASSIAN_USERNAME;
const password = process.env.ATLASSIAN_API_KEY;
const domain = process.env.DOMAIN;

const auth = {
  username: username,
  password: password,
};

async function listarAlertas(req, res) {
 try {
    const baseUrl = `https://${domain}.atlassian.net`;

    const config = {
      method: "get",
      url: `${baseUrl}/rest/api/2/search?fields=summary,status,created,resolutiondate,customfield_10057&expand=changelog`,
      headers: { "Content-Type": "application/json" },
      auth: auth,
    };

    const response = await axios.request(config);
    var alertas = [];
    if (response.data && response.data.issues) {
      for (var issue of response.data.issues) {
        alertas.push({
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          created: issue.fields.created,
          resolutionDate: issue.fields.resolutiondate,
          urgency: issue.fields.urgency || "Não disponível",
          idFabrica: issue.fields.customfield_10057 || "Não disponível"
        });
      }
    }
    
    res.status(200).json(alertas);
  } catch (error) {
    console.log("Erro ao listar alertas do Jira:", error.message);
    res.status(500).json({ error: "Erro ao obter alertas do Jira" });
  }
}

async function listarAlertasPorId(req, res) {
  try {
    const baseUrl = `https://${domain}.atlassian.net`;
    const idFabrica = req.params.idFabrica;

    if (!idFabrica) {
      return res.status(400).json({ error: "ID da fábrica não fornecido" });
    }

    const config = {
      method: "get",
      url: `${baseUrl}/rest/api/2/search?fields=summary,status,created,resolutiondate,customfield_10057&expand=changelog`,
      headers: { "Content-Type": "application/json" },
      auth: auth,
    };

    const response = await axios.request(config);
    var somaDosTempos = 0;  
    var quantidadeDeAlertas = 0; 

    for (var i = 0; i < response.data.issues.length; i++) {
      const issue = response.data.issues[i];
      if (issue.fields.customfield_10057 == idFabrica) {
        var dataConclusao = null;
        dataConclusao = issue.fields.resolutiondate;
        if (dataConclusao) {
          var dataCriacao = new Date(issue.fields.created);
          var dataConclusaoFormatada = new Date(dataConclusao);
          var tempoGasto = dataConclusaoFormatada - dataCriacao;
          somaDosTempos += tempoGasto;
          quantidadeDeAlertas++;
        }
      }
    }
    var tempoMedio = 0;
    if (quantidadeDeAlertas > 0) {
      var media = somaDosTempos / quantidadeDeAlertas;
      tempoMedio = media / (1000 * 60)
    }

    const resultado = {
      idFabrica: idFabrica,
      tempoMedioResolucao: Number(tempoMedio.toFixed(2)), 
      totalAlertas: quantidadeDeAlertas
    };
    
    res.status(200).json(resultado);
  } catch (error) {
    console.log("Erro ao calcular tempo médio:", error.message);
    res.status(500).json({ error: "Erro ao calcular tempo médio" });
  }
}

module.exports = {
  listarAlertas,
  listarAlertasPorId,
};
