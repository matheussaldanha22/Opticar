const AWS = require("aws-sdk");

async function pegarS3(req, res) {
    const componente = req.params.componente?.toLowerCase(); // Ex: CPU, RAM, DISCO

    if (!componente) {
        return res.status(400).json({ erro: "Componente não fornecido" });
    }

    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${componente}-relatorio.json`
    };

console.log("Buscando no S3:", params);

    try {
        const data = await s3.getObject(params).promise();
        const conteudo = data.Body.toString('utf-8');
        const resposta = JSON.parse(conteudo);
        res.status(200).json(resposta);
    } catch (erro) {
        console.error(`Erro ao buscar ${params.Key} no S3:`, erro.message);
        res.status(404).json({ erro: `Arquivo ${params.Key} não encontrado.` });
    }
}

module.exports = { pegarS3 };