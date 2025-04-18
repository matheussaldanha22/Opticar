// const login = () => {
//   window.location.href = "./dashMonitoramento.html"
// }

function voltar() {
  window.location.href = "./index.html"
}

function entrar() {
  //   aguardar()

  var emailVar = inpEmail.value
  var senhaVar = inpSenha.value

  if (emailVar == "" || senhaVar == "") {
    console.log("Preencha todos os campos!")
    // cardErro.style.display = "block"
    // mensagem_erro.innerHTML = "(Mensagem de erro para todos os campos em branco)";
    // finalizarAguardar();
    return false
  }
  // else {
  //     setInterval(sumirMensagem, 5000)
  // }

  console.log("FORM LOGIN: ", emailVar)
  console.log("FORM SENHA: ", senhaVar)

  fetch("/usuarios/autenticar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailServer: emailVar,
      senhaServer: senhaVar,
    }),
  })
    .then(function (resposta) {
      console.log("ESTOU NO THEN DO entrar()!")

      if (resposta.ok) {
        console.log(resposta)

        resposta.json().then((json) => {
          console.log(json)
          console.log(JSON.stringify(json))
          sessionStorage.EMAIL_USUARIO = json.email
          sessionStorage.NOME_USUARIO = json.nome
          sessionStorage.ID_USUARIO = json.id
          sessionStorage.SERVIDORES = JSON.stringify(json.servidores)
          sessionStorage.EMPRESA = json.empresaId
          console.log(`ID Empresa: ${json.empresaId}`)

          setTimeout(function () {
            window.location = "./dashMonitoramento.html"
          }, 1000) // apenas para exibir o loading
        })
      } else {
        console.log("Houve um erro ao tentar realizar o login!")

        resposta.text().then((texto) => {
          console.error(texto)
          //   finalizarAguardar(texto)
        })
      }
    })
    .catch(function (erro) {
      console.log(erro)
    })

  return false
}

function sumirMensagem() {
  cardErro.style.display = "none"
}
