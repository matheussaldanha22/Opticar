var AWS = require("aws-sdk");

async function pegarS3(req, res) {
    var componente = req.params.componente?.toLowerCase(); // Ex: CPU, RAM, DISCO

    if (!componente) {
        return res.status(400).json({ erro: "Componente não fornecido" });
    }

    var s3 = new AWS.S3();

    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `previsao/${componente}-relatorio.json`
    };

console.log("Buscando no S3:", params);

    try {
        var data = await s3.getObject(params).promise();
        var conteudo = data.Body.toString('utf-8');
        var resposta = JSON.parse(conteudo);
        res.status(200).json(resposta);
    } catch (erro) {
        console.error(`Erro ao buscar ${params.Key} no S3:`, erro.message);
        res.status(404).json({ erro: `Arquivo ${params.Key} não encontrado.` });
    }
}

module.exports = { pegarS3 };