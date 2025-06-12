var areaEnvio = document.getElementById('areaEnvio');
var inputArquivo = document.getElementById('documentos');
require('dotenv').config()

  // Eventos para sair ou soltar
  ['dragleave', 'drop'].forEach(evento => {
    areaEnvio.addEventListener(evento, ev => {
      ev.preventDefault();
      
    });
  });

  // Quando o arquivo for solto 
  areaEnvio.addEventListener('drop', e => {
    var arquivo = e.dataTransfer.files[0];
    enviarArquivo(arquivo);
  });

  // Quando o arquivo for selecionado pelo botão
  inputArquivo.addEventListener('change', () => {
    var arquivo = inputArquivo.files[0];
    enviarArquivo(arquivo);
  });

  // Função para enviar o arquivo ao backend
  async function enviarArquivo(arquivo) {
    if (!arquivo) return alert('Nenhum arquivo selecionado!');

    var formData = new FormData();
    formData.append('arquivo', arquivo);

    try {
      var resposta = await fetch(`http://34.198.19.147:5000/awsUpload/enviar`, {
        method: 'POST',
        body: formData
      });

      var dados = await resposta.json();

      if (resposta.ok) {
        alert('Arquivo enviado com sucesso!');
        console.log('Resposta do S3:', dados);
      } else {
        alert('Erro ao enviar: ' + dados.message);
      }
    } catch (erro) {
      console.error('Erro ao enviar arquivo:', erro);
      alert('Erro  durante o envio.');
    }
  }