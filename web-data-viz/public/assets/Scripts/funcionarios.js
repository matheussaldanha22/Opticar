const itensPorPagina = 10
let paginaAtual = 1
let alertas = [] // Armazenamento dos dados recebidos do backend

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/alertas")
    .then((res) => res.json())
    .then((dados) => {
      alertas = dados
      renderTabela(paginaAtual)
      renderPaginacao()
    })
    .catch((err) => {
      console.error("Erro ao carregar alertas:", err)
    })
})

function renderTabela(pagina) {
  const tabela = document.getElementById("tabela-alertas")
  tabela.innerHTML = ` <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Cargo</th>
                        <th>Status</th>
                        <th>Editar</th>
                    </tr>`

  const inicio = (pagina - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const paginaDados = alertas.slice(inicio, fim)

  paginaDados.forEach((funcionario) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${funcionario.nome}</td>
      <td>${funcionario.email}</td>
      <td>${funcionario.cargo}</td>
      <td>${funcionario.status}</td>
      <td><i class='bx bx-arrow-from-left btn' onclick="abrirModal(${funcionario.id})"></i></td>
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
