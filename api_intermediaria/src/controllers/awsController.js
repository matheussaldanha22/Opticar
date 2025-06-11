const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

async function dadosBucket(req, res) {
    try {
        var macAddress = req.body.mac_address;
        var dadosJson = req.body.dadosS3;
        var dataP = req.body.dataAtual
        var fabrica = req.body.idFabrica

        console.log("Dados recebidos:", req.body);

        if (!macAddress || !dadosJson) {
            console.error("MAC Address ou dados não fornecidos.");
            return res.status(400).json({
                mensagem: "MAC Address ou dados não fornecidos"
            });
        }

        const resultado = await enviarParaS3(macAddress, dadosJson, dataP, fabrica);
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

async function relatorioClient(req, res) {
    try {
        const arquivo = req.file;
        const tipo = req.body.tipo;
        const pasta = req.body.pasta;

        console.log("Arquivo recebido:", arquivo);
        console.log("Tipo recebido:", tipo);

        if (!arquivo) {
            console.error("Arquivo não fornecido");
            return res.status(400).json({ 
                mensagem: "Arquivo não fornecido"
            });
        }

        const resultado = await enviarRelatorio(arquivo.buffer, arquivo.originalname, tipo, pasta);
        
        res.status(200).json({
            mensagem: "Relatório enviado para AWS com sucesso", 
            resultado
        });
    } catch (erro) {
        console.error("Erro no relatorioClient:", erro.message);
        res.status(500).json({
            mensagem: "Erro ao enviar para AWS",
            erro: erro.message
        });
    }
}

async function enviarParaS3(macAddress, dadosJson, dataP, fabrica) {
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET_NAME_RAW,
        Key: `fabrica${fabrica}/${macAddress}/${dataP}`,
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

async function enviarRelatorio(bufferArquivo, nomeArquivo, tipo, pasta) {
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET_NAME_CLIENT,
        Key: `${pasta}/${tipo}`,
        Body: bufferArquivo,
        ContentType: 'application/pdf'  
    };

    try {
        const data = await s3.upload(params).promise();
        console.log("Relatório enviado com sucesso:", data.Location);
        return data.Location;
    } catch (erro) {
        console.error("Erro ao enviar relatório:", erro.message);
        throw erro;
    }
}

async function visualizarHistorico(req, res) {
    var pasta = req.params.pasta;
    const s3 = new AWS.S3()

    const params = {
        Bucket: process.env.BUCKET_NAME_CLIENT,
        Prefix: `${pasta}/`
    }

    try {
        const data = await s3.listObjectsV2(params).promise();
        var conteudo = data.Contents.map(objeto => objeto.Key.split('/').pop());
        res.status(200).json(conteudo)
    } catch (erro) {
        console.error(erro)
    }
}

async function pegarS3(req,res){
    var mes = String(req.params.mes).padStart(2, '0');
    var ano = req.params.ano
    console.log(ano,mes)
    
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET_NAME_TRUSTED,
        Key: `pix/${ano}/${mes}/data.json`,
    }

    try {
        const data = await s3.getObject(params).promise();
        var conteudo = data.Body.toString('utf-8');
        var resposta = JSON.parse(conteudo)
        res.status(200).json(resposta)
    }catch (erro){
        console.error("Erro ao pegar do S3")
        res.status(500).json(erro.message)
    }
}

async function baixarHistorico(req, res) {
    var nome = req.params.relatorioNome
    var pasta = req.params.pasta
    const s3 = new AWS.S3()

    const params = {
        Bucket: process.env.BUCKET_NAME_CLIENT,
        Key: `${pasta}/${nome}`
    }

    try {
        const data = await s3.getObject(params).promise()
        const conteudo = data.Body;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${nome}`);
        res.status(200).send(conteudo);
    } catch (erro) {
        console.error("Erro ao baixar histórico")
        res.status(500).json(erro.message)
    }
}

async function logProcesso(req, res) {
    try {
        var log = req.body.logProcesso;
        var data = req.body.data

        console.log("Dados recebidos:", req.body);

        if (!log || !data) {
            console.error("log ou data não fornecidos.");
            return res.status(400).json({
                mensagem: "log ou data não fornecidos."
            });
        }

        const resultado = await enviarLogS3(log, data);
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

async function enviarLogS3(log, data) {
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.BUCKET_NAME_CLIENT,
        Key: `LogsProcesso/${data}`,
        Body: JSON.stringify(log),
        ContentType: 'application/json'
    };

    try {
        const data = await s3.upload(params).promise();
        console.log("Relatório enviado com sucesso:", data.Location);
        return data.Location;
    } catch (erro) {
        console.error("Erro ao enviar relatório:", erro.message);
        throw erro;
    }
}

module.exports = {
    dadosBucket,
    pegarS3,
    relatorioClient,
    visualizarHistorico,
    baixarHistorico,
    logProcesso
};