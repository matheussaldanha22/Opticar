// var idUsuario = sessionStorage.getItem("ID_USUARIO")

function deslogar() {
  sessionStorage.clear()
  window.location.href = "./index.html"
}

function funcionarios() {
  window.location.href = "./funcionarios.html"
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
        // ul_links.innerHTML = `
        //     <li class="li-active">
        //       <i class='bx bx-desktop' style='color:#ffffff'></i>
        //       <span>Monitoramento</span>
        //     </li>
        //     <li>
        //       <i class='bx bxs-bell-ring' style='color:#ffffff'></i>
        //       <span>Alertas</span>
        //     </li>
        //     <li>
        //       <i class='bx bx-server' style='color:#ffffff'></i>
        //       <span>Servidores</span>
        //     </li>
        //     <li>
        //       <span onclick="deslogar()">Sair</span>
        //     </li>
        //   `

        // Se for Gestor ou GestorEmpresa, adiciona o menu de Funcionários
        if (
          cargoUsuario === "GestorEmpresa" ||
          cargoUsuario === "GestorFabrica"
        ) {
          ul_links.innerHTML = `

            <li class="li-active">
              <i class='bx bx-desktop' style='color:#ffffff'></i>
              <span>Monitoramento</span>
            </li>
            <li>
              <i class='bx bxs-bell-ring' style='color:#ffffff'></i>
              <span>Alertas</span>
            </li>
            <li>
              <i class='bx bx-server' style='color:#ffffff'></i>
              <span>Servidores</span>
            </li>
            <li>
              <span onclick="deslogar()">Sair</span>
            </li>
            <li>
                <i class='bx bx-user' style='color:#ffffff' onclick="funcionarios()"></i>
                <span><a href="./funcionarios.html">Funcionários</a></span>
            </li>
            `
        } else if (cargoUsuario === "AnalistaSuporte") {
          ul_links.innerHTML = `
            <li class="li-active">
              <i class='bx bx-desktop' style='color:#ffffff'></i>
              <span>Monitoramento</span>
            </li>
            <li>
              <i class='bx bxs-bell-ring' style='color:#ffffff'></i>
              <span>Alertas</span>
            </li>
            <li>
              <i class='bx bx-server' style='color:#ffffff'></i>
              <span>Servidores</span>
            </li>
            <li>
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
