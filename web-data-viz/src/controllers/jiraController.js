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

    const alertas = response.data.issues.map((issue) => ({
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      created: issue.fields.created,
      resolutionDate: issue.fields.resolutiondate || "Não concluído",
      urgency: issue.fields.customfield_10124 || "Não disponível",
      idFabrica: issue.fields.customfield_10157 || "Não disponível"
    }));

    res.status(200).json(alertas); // Retorna os dados da API Jira
  } catch (error) {
    console.log("Erro ao listar alertas do Jira:", error.message);
    res.status(500).json({ error: "Erro ao obter alertas do Jira" });
  }
}

module.exports = {
  listarAlertas,
};
