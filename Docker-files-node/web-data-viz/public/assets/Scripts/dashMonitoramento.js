const nomeUsuario = sessionStorage.getItem("NOME_USUARIO")
const aquarios = JSON.parse(sessionStorage.getItem("AQUARIOS"))
const idUsuario = sessionStorage.getItem("ID_USUARIO")
const emailUsuario = sessionStorage.getItem("EMAIL_USUARIO")

const nomeElement = document.getElementById("usuarioNome")
const emailElement = document.getElementById("usuarioEmail")

if (nomeElement) {
  nomeElement.textContent = nomeUsuario
}
if (emailElement) {
  emailElement.textContent = emailUsuario
}
