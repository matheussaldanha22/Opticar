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
      url: `${baseUrl}/rest/api/2/search?fields=summary,status,created,resolutiondate,customfield_10157,customfield_10124&expand=changelog`,
      headers: { "Content-Type": "application/json" },
      auth: auth,
    };

    const response = await axios.request(config);
    const alertas = [];

    for (var i = 0; i < response.data.issues.length; i++) {
      const issue = response.data.issues[i];          
      if (issue.changelog && issue.changelog.histories) {
        for (const history of issue.changelog.histories) {
          for (const item of history.items) {
            if (item.field === 'status' && item.toString === 'Done') {
              dataConclusao = history.created;
              break;
            }
          }
        }
      }
      alertas.push({
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        created: issue.fields.created,
        resolutionDate: dataConclusao,
        urgency: issue.fields.customfield_10124 || "Não disponível",
        idFabrica: issue.fields.customfield_10157 || "Não disponível"
      });
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
      url: `${baseUrl}/rest/api/2/search?fields=summary,status,created,resolutiondate,customfield_10157,customfield_10124&expand=changelog`,
      headers: { "Content-Type": "application/json" },
      auth: auth,
    };

    const response = await axios.request(config);
    const alertas = [];

    for (let i = 0; i < response.data.issues.length; i++) {
      const issue = response.data.issues[i];
      if (issue.fields.customfield_10157 == idFabrica) {
      alertas.push({
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        created: issue.fields.created,
        resolutionDate: issue.fields.resolutiondate || "Não concluído",
        urgency: issue.fields.customfield_10124 || "Não disponível",
        idFabrica: issue.fields.customfield_10157 || "Não disponível"
      });
      }
    }

    res.status(200).json(alertas);
  } catch (error) {
    console.log("Erro ao listar alertas do Jira:", error.message);
    res.status(500).json({ error: "Erro ao obter alertas do Jira" });
  }
}

async function kpiTempoMaiorResolucao(req, res) {
  try {
    const baseUrl = `https://${domain}.atlassian.net`;
    const idFabrica = req.body.idFabricaServer;

    if (!idFabrica) {
      return res.status(400).json({ error: "ID da fábrica não fornecido" });
    }

    const config = {
      method: "get",
      url: `${baseUrl}/rest/api/2/search?fields=summary,status,created,resolutiondate,customfield_10157,customfield_10124&expand=changelog`,
      headers: { "Content-Type": "application/json" },
      auth: auth,
    };

    const response = await axios.request(config);
    let somaDosTempos = 0;  
    let quantidadeDeAlertas = 0; 

    for (var i = 0; i < response.data.issues.length; i++) {
      const issue = response.data.issues[i];
      if (issue.fields.customfield_10157 == idFabrica) {
        let dataConclusao = null;
        if (issue.changelog && issue.changelog.histories) {
          for (const history of issue.changelog.histories) {
            for (const item of history.items) {
              if (item.field === 'status' && item.toString === 'Done') {
                dataConclusao = new Date(history.created);
                break;
              }
            }
          }
        }
        
        if (dataConclusao) {
          const dataCriacao = new Date(issue.fields.created);
          const tempoGasto = dataConclusao - dataCriacao;
        
          somaDosTempos += tempoGasto;
          quantidadeDeAlertas++;
        }
      }
    }

    let tempoMedio = 0;
    if (quantidadeDeAlertas > 0) {
      let media = somaDosTempos / quantidadeDeAlertas;
      tempoMedio = media / (1000 * 60)
    }

    const resultado = {
      idFabrica: idFabrica,
      tempoMedioResolucao: tempoMedio.toFixed(2), 
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
  kpiTempoMaiorResolucao
};
