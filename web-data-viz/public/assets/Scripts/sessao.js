function deslogar() {
  sessionStorage.clear()
  window.location.href = "./index.html"
}

function funcionarios() {
  window.location.href = "./funcionarios.html"
}

function componentes() {
  window.location.href = "./componentes.html"
}

function monitoramento() {
  window.location.href = "./dashMonitoramento.html"
}

function alertas() {
  window.location.href = "./alertas.html"
}

function analise() {
  window.location.href = "./dashAnalise.html"
}

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

fetch(`/usuarios/listarPorId/${idUsuario}`, {
  method: "GET",
})
  .then((resposta) => {
    resposta
      .json()
      .then((resultado) => {
        const cargoUsuario = resultado[0].cargo

        let ul_links = document.getElementById("ul_links")
        if (
          cargoUsuario === "GestorEmpresa" ||
          cargoUsuario === "GestorFabrica"
        ) {
          ul_links.innerHTML = `

            <li class="li-active">
              <i class='bx bx-desktop' style='color:#ffffff' onclick="monitoramento()"></i>
              <span onclick="monitoramento()">Dashboard monitoramento</span>

            </li>
            <li>
              <i class='bx bxs-bell-ring' style='color:#ffffff' onclick="alertas()"></i>
              <span onclick="alertas()">Alertas</span>
            </li>
            <li>
              <i class='bx bx-server' style='color:#ffffff'></i>
              <span>Servidores</span>
            </li>
            <li>
                <i class='bx bx-user' style='color:#ffffff' onclick="funcionarios()"></i>
                <span onclick="funcionarios()">Funcionários</span>
            </li>
            <li>
                <i class='bx bx-memory-card' style='color:#ffffff' onclick="componentes()"></i>
                <span onclick="componentes()">Componentes</span>
            </li>
            <li>
            <i class='bx bx-exit' style='color:#ffffff' onclick="deslogar()"></i>
              <span onclick="deslogar()">Sair</span>
            </li>

            `
        } else if (cargoUsuario === "AnalistaDados") {
          ul_links.innerHTML = `
            <li class="li-active">
              <i class='bx bx-desktop' style='color:#ffffff' onclick="analise()"></i>
              <span onclick="analise()">Dashboard analise</span>
            </li>
            <li>
              <i class='bx bxs-bell-ring' style='color:#ffffff' onclick="alertas()"></i>
              <span onclick="alertas()">Alertas</span>
            </li>
            <li>
              <i class='bx bx-server' style='color:#ffffff'></i>
              <span>Servidores</span>
            </li>
            <li>
            <i class='bx bx-exit' style='color:#ffffff'></i>
              <span onclick="deslogar()">Sair</span>
            </li>
          `
        }

        // nomeFuncionario.innerHTML = resultado[0].nome
      })
      .catch((erro) => {
        console.log(erro)
      })
  })
  .catch((erro) => {
    console.log(erro)
  })
