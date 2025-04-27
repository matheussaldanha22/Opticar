const itensPorPagina = 10
let paginaAtual = 1
let alertas = [] // Armazenamento dos dados recebidos do backend

document.addEventListener("DOMContentLoaded", () => {
  // fetch("http://localhost:3000/alertas")
  //   .then((res) => res.json())
  //   .then((dados) => {
  //     alertas = dados
  //     renderTabela(paginaAtual)
  //     renderPaginacao()
  //   })
  //   .catch((err) => {
  //     console.error("Erro ao carregar alertas:", err)
  //   })
  console.log("Iniciando a API do JIRA")

  getChamados()
})

function renderTabela(pagina) {
  const tabela = document.getElementById("tabela-alertas")
  tabela.innerHTML = ` <tr>
                        <th>Servidor</th>
                        <th>Componente</th>
                        <th>Data</th>
                        <th>Gravidade</th>
                        <th>Status</th>
                        <th>Visualizar</th>
                    </tr>`

  const inicio = (pagina - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const paginaDados = alertas.slice(inicio, fim)

  paginaDados.forEach((alerta) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${alerta.servidor}</td>
      <td>${alerta.componente}</td>
      <td>${alerta.dtAlerta}</td>
      <td>${alerta.gravidade}</td>
      <td>${alerta.status}</td>
      <td><i class='bx bx-arrow-from-left btn' onclick="abrirModal(${alerta.id})"></i></td>
    `
    tabela.appendChild(tr)
  })
}

// https://sptech-team-latencyslayer.atlassian.net/rest/api/2/
function getChamados() {
  const tabela = document.getElementById("tabela-alertas")
  tabela.innerHTML = ` <tr>
                        <th>Servidor</th>
                        <th>Componente</th>
                        <th>Data</th>
                        <th>Gravidade</th>
                        <th>Status</th>
                        <th>Visualizar</th>
                    </tr>`
  console.log("testessssss")
  // Fazendo a requisição para o backend
  fetch("http://localhost:3333/jira/teste")
    .then(function (response) {
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao buscar chamados")
      }

      console.log(response.json())
      return response.json() // Converte a resposta para JSON
    })
    .then(function (chamados) {
      // Pegando o elemento onde os chamados serão exibidos
      var listElement = document.getElementById("tabela-alertas")

      // Limpando qualquer conteúdo anterior na lista
      listElement.innerHTML = ""

      // Iterando pelos chamados e criando as linhas da tabela
      chamados.forEach(function (chamado) {
        // Criando a linha da tabela
        var tr = document.createElement("tr")

        tr.innerHTML = `
                  <td>${chamado.key}</td>
                  <td>${chamado.fields.summary}</td>
                  <td>${
                    chamado.fields.assignee
                      ? chamado.fields.assignee.displayName
                      : "Não atribuído"
                  }</td>
                  <td>${chamado.fields.created}</td>
                  <td>${chamado.fields.status.name}</td>
                  <td><i class="bx bx-arrow-from-left btn" onclick="abrirModal(${
                    chamado.id
                  })"></i></td>
              `

        // Adicionando a linha à tabela
        listElement.appendChild(tr)
      })
    })
    .catch(function (error) {
      // Em caso de erro, exibe um alerta
      console.error("Erro ao carregar chamados:", error)
      alert("Não foi possível carregar os chamados")
    })
}

function renderPaginacao() {
  const paginacao = document.getElementById("paginacao")
  paginacao.innerHTML = ""

  const totalPaginas = Math.ceil(alertas.length / itensPorPagina)

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button")
    btn.textContent = i
    if (i === paginaAtual) btn.classList.add("active")
    btn.addEventListener("click", () => {
      paginaAtual = i
      renderTabela(paginaAtual)
      renderPaginacao()
    })
    paginacao.appendChild(btn)
  }
}

function abrirModal(id) {
  const alerta = alertas.find((item) => item.id === id)

  if (!alerta) {
    return Swal.fire("Erro", "Alerta não encontrado", "error")
  }

  Swal.fire({
    title: `Detalhes do Alerta ${alerta.id}`,
    html: `
      <div class="modal-test">
        <div class="containerConfigAlerta">
            <h3>Configuração alerta</h3>
            <p><b>id:</b> ${alerta.id}</p>
            <p><b>Gravidade:</b> ${alerta.gravidade}</p>
            <p><b>Data:</b> ${alerta.dtAlerta}</p>
        </div>

        <div class="containerComponentes">
            <p><b>Componente: </b> ${alerta.componente}</p>
            <p><b>Servidor: </b> ${alerta.servidor}</p>
            <p><b>Métrica registrada: </b>${alerta.gravidade}</p>
            <p><b>Tipo de Métrica: </b>${alerta.tipoMetrica}</p>
            <p><b>Processos Relacionados: </b></p>  
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Fechar",
    customClass: "alertaModal",
  })
}
