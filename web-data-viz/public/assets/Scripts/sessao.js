function deslogar() {
  sessionStorage.clear()
  window.location.href = "./index.html"
}

let pagina = 0

function funcionarios() {
  pagina = 1
  window.location.href = "./funcionarios.html"
  document.getElementById("funcionarios").className = "li-active"
}

function componentes() {
  pagina = 2
  window.location.href = "./componentes.html"
  document.getElementById("componentes").className = "li-active"
}

function dashMonitoramento() {
  pagina = 3
  window.location.href = "./dashMonitoramento-vitor.html"
  document.getElementById("dashMonitoramento").className = "li-active"
}

function alertasPagina() {
  pagina = 4
  window.location.href = "./alertas.html"
  document.getElementById("alertas").className = "li-active"
}

function dashAnalise() {
  pagina = 5
  window.location.href = "./dashAnalise.html"
  document.getElementById("dashAnalise").className = "li-active"
}

function dashEmpresa() {
  pagina = 6
  window.location.href = "./dashAdmin.html"
  document.getElementById("dashEmpresa").className = "li-active"
}

function dashGestaoFabrica() {
  window.location.href = "./dashGestaofabrica.html"
}

function listaServidores() {
  window.location.href = "./listadeservidores.html"
}

const nomeUsuario = sessionStorage.getItem("NOME_USUARIO")
const aquarios = JSON.parse(sessionStorage.getItem("AQUARIOS"))
const idUsuario = sessionStorage.getItem("ID_USUARIO")
const emailUsuario = sessionStorage.getItem("EMAIL_USUARIO")
const empresaUsuario = sessionStorage.getItem("EMPRESA_NOME")

const nomeElement = document.getElementById("usuarioNome")
const emailElement = document.getElementById("usuarioEmail")
const empresaElement = document.getElementById("empresaNome")

if (nomeElement) {
  nomeElement.textContent = nomeUsuario
}
if (emailElement) {
  emailElement.textContent = emailUsuario
}

if (empresaElement) {
  empresaElement.textContent = empresaUsuario
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
        if (cargoUsuario === "GestorAdmin") {
          ul_links.innerHTML = `

            <li id="dashEmpresa">
              <i class='bx bx-desktop' style='color:#ffffff' onclick="dashEmpresa()"></i>
              <span onclick="dashEmpresa()">Dashboard empresa</span>
            </li>
            <li id="funcionarios">
                <i class='bx bx-user' style='color:#ffffff' onclick="funcionarios()"></i>
                <span onclick="funcionarios()">Funcionários</span>
            </li>
            <li>
            <i class='bx bx-exit' style='color:#ffffff' onclick="deslogar()"></i>
              <span onclick="deslogar()">Sair</span>
            </li>

            `
        } else if (cargoUsuario == "GestorInfra") {
          ul_links.innerHTML = `
            <li id="dashGestaoFabrica">
              <i class='bx bxs-bar-chart-alt-2' style='color:#ffffff' onclick="dashGestaoFabrica()"></i>
              <span onclick="dashGestaoFabrica()">Dashboard fábrica</span>
            </li>
            <li id="alertas">
              <i class='bx bxs-bell-ring' style='color:#ffffff' onclick="alertasPagina()"></i>
              <span onclick="alertasPagina()">Alertas</span>
            </li>
            <li id="servidores">
              <i class='bx bx-server' style='color:#ffffff' onclick="listaServidores()"></i>
              <span onclick="listaServidores()">Servidores</span>
            </li>
            <li id="funcionarios">
                <i class='bx bx-user' style='color:#ffffff' onclick="funcionarios()"></i>
                <span onclick="funcionarios()">Funcionários</span>
            </li>
            <li>
            <i class='bx bx-exit' style='color:#ffffff' onclick="deslogar()"></i>
              <span onclick="deslogar()">Sair</span>
            </li>

            `
        } else if (cargoUsuario === "AnalistaDados") {
          ul_links.innerHTML = `
            <li id="dashAnalise">
              <i class='bx bxs-bar-chart-alt-2' style='color:#ffffff' onclick="dashAnalise()"></i>
              <span onclick="dashAnalise()">Dashboard Análise</span>
            </li>
            <li id="servidores">
              <i class='bx bx-server' style='color:#ffffff' onclick="listaServidores()"></i>
              <span onclick="listaServidores()">Servidores</span>
            </li>
            <li id="componentes">
                <i class='bx bx-memory-card' style='color:#ffffff' onclick="componentes()"></i>
                <span onclick="componentes()">Componentes</span>
            </li>
            <li>
            <i class='bx bx-exit' style='color:#ffffff' onclick="deslogar()"></i>
              <span onclick="deslogar()">Sair</span>
            </li>

            `
        } else if (cargoUsuario === "AnalistaSuporte") {
          ul_links.innerHTML = `
            <li id="dashMonitoramento">
              <i class='bx bx-desktop' style='color:#ffffff' onclick="dashMonitoramento()"></i>
              <span onclick="dashMonitoramento()">Dashboard monitoramento</span>
            </li>
            <li id="alertas">
              <i class='bx bxs-bell-ring' style='color:#ffffff' onclick="alertasPagina()"></i>
              <span onclick="alertasPagina()">Alertas</span>
            </li>
            <li id="servidores">
              <i class='bx bx-server' style='color:#ffffff' onclick="listaServidores()"></i>
              <span onclick="listaServidores()">Servidores</span>
            </li>
            <li>
            <i class='bx bx-exit' style='color:#ffffff' onclick="deslogar()"></i>
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
