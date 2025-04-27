const itensPorPagina = 10
let paginaAtual = 1
let alertas = [] // Armazenamento dos dados recebidos do backend

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3333/alertas/listar")
    .then((res) => res.json())
    .then((dados) => {
      alertas = dados
      renderTabela(paginaAtual)
      renderPaginacao()
    })
    .catch((err) => {
      console.error("Erro ao carregar alertas:", err)
    })
  console.log("Iniciando a API do JIRA")

  getChamados()
})

function renderTabela(pagina) {
  const tabela = document.getElementById("tabela-alertas")
  tabela.innerHTML = ` <tr>
                        <th>Id</th>
                        <th>valor</th>
                        <th>Prioridade</th>
                        <th>Tipo</th>
                        <th>Componente</th>
                        <th>Status</th>
                        <th>Visualizar</th>
                    </tr>`

  const inicio = (pagina - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const paginaDados = alertas.slice(inicio, fim)

  paginaDados.forEach((alerta) => {
    const tr = document.createElement("tr")
    alertaNome = ""
    if (alerta.statusAlerta == "To Do") {
      alertaNome = "A Fazer"
    } else if (alerta.statusAlerta == "In Progress") {
      alertaNome = "Em Andamento"
    } else if (alerta.statusAlerta == "Done") {
      alertaNome = "Fechado"
    }
    tr.innerHTML = `
      <td>${alerta.idAlerta}</td>
      <td>${alerta.valor}</td>
      <td>${alerta.prioridade}</td>
      <td>${alerta.tipo_incidente}</td>
      <td>${alerta.componente}</td>
      <td>${alertaNome}</td>
      <td><i class='bx bx-arrow-from-left btn' onclick="abrirModal(${alerta.id})"></i></td>
    `
    tabela.appendChild(tr)
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
    title: `Detalhes do Alerta ${alerta.idAlerta}`,
    html: `
      <div class="modal-test">
        <div class="containerConfigAlerta">
            <h3>Título: ${alerta.titulo} </h3>
            <p><b>Descrição:</b></p>
            <textarea rows="5" cols="30"> ${alerta.descricao}</textarea>
            <p><b>Data:</b> ${alerta.dataAlerta}</p>
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
