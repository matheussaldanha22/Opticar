const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

async function dadosBucket(req, res) {
    try {
        var macAddress = req.body.mac_address;
        var dadosJson = req.body.dadosS3;

        console.log("Dados recebidos:", req.body);

        if (!macAddress || !dadosJson) {
            console.error("MAC Address ou dados não fornecidos.");
            return res.status(400).json({
                mensagem: "MAC Address ou dados não fornecidos"
            });
        }

        const resultado = await enviarParaS3(macAddress, dadosJson);
        res.status(200).json({
            mensagem: "Dados enviados com sucesso", local: resultado 
        });
    } catch (erro) {
        console.error("Erro no controller:", erro.message);
        res.status(500).json({ 
            mensagem: "Erro ao enviar para o S3", erro: erro.message
        });
    }
}

async function enviarParaS3(macAddress, dadosJson) {
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${macAddress}/dados.json`,
        Body: JSON.stringify(dadosJson),
        ContentType: 'application/json'
    };

    try {
        var data = await s3.upload(params).promise();
        console.log("Arquivo enviado com sucesso:", data.Location);
        return data.Location;
    } catch (erro) {
        console.error("Erro ao enviar para o S3:", erro.message);
        throw erro;
    }
}

async function pegarS3(req,res){
    var nomeArquivo = "pix"

    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${nomeArquivo}/dados.json`,
    }

    try {
        const data = await s3.getObject(params).promise();
        var conteudo = data.Body.toString('utf-8');
        var resposta = JSON.parse(conteudo)
        res.status(200).json(resposta)
    }catch (erro){
        console.error("Erro ao pegar do S3", )
        res.status(500).json(erro.message)
    }
        

}



module.exports = {
    dadosBucket,
    pegarS3
};