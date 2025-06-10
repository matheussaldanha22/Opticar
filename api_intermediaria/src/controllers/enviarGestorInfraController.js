// Carrega as variáveis de ambiente definidas no arquivo .env.dev
require('dotenv').config();

var AWS = require('aws-sdk'); 

// Configura as credenciais temporárias da AWS (tem q trocardireto isso)
AWS.config.update({
  accessKeyId: process.env.aws_access_key_id, 
  secretAccessKey: process.env.aws_secret_access_key, 
  sessionToken: process.env.aws_session_token, 
  region: process.env.AWS_REGION 
});

// Cria uma instância do serviço S3 com as credenciais
var s3 = new AWS.S3();

// Define o nome do bucket a ser usado, retirado do .env
var bucket = 's3-raw-opti';

// Exporta a função 
exports.enviarParaS3 = async (req, res) => {
  var arquivo = req.file; // O arquivo enviado virá dentro de req.file (usado com multer)

  var nomeOk = ['cpu-relatorio', 'ram-relatorio', 'disco-relatorio'];
  var csv = '.csv';

  var nomeArquivo = arquivo.originalname;
  var nomeBase = nomeArquivo.split('.')[0]; // Nome antes do ponto
  var extensao = nomeArquivo.slice(-4).toLowerCase(); // Últimos 4 caracteres da extensão

  // Validação do nome permitido
  if (!nomeOk.includes(nomeBase)) {
    return res.status(400).json({
      erro: 'Nome errado. '
    });
  }

  // Validação da extensão CSV
  if (extensao !== csv) {
    return res.status(400).json({
      erro: 'tem que ser csv.'
      
    });
  }

  // Define os parâmetros necessários para o envio ao S3
  var parametros = {
    Bucket: bucket, 
    Key: `previsao/ ${nomeArquivo}`, 
    Body: arquivo.buffer, 
    ContentType: arquivo.mimetype //da biblioteca multer
  };

  try {
    // sobe o arquivo pro s3 e deixa pra finalizar 'depois' o jhonis
    await s3.upload(parametros).promise();

    // Se deu tudo certo, envia uma resposta de sucesso ao frontend
    res.status(200).json({ mensagem: 'Arquivo enviado com sucesso.' });
  } catch (erro) {
    // Em caso de erro no upload, mostra no console e retorna um erro 500 com detalhes
    console.error('Erro ao enviar para o S3:', erro);
    res.status(500).json({ mensagem: 'Erro pra enviar pro baldin.', erro });
  }
};
