const itensPorPagina = 10
let paginaAtual = 1
let alertas = [] // Armazenamento dos dados recebidos do backend

document.addEventListener("DOMContentLoaded", () => {
  fetch("/alertas/listar")
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
  tabela.innerHTML = ` <thead>
                        <tr>
                        <th>Id</th>
                        <th>valor</th>
                        <th>Prioridade</th>
                        <th>Tipo</th>
                        <th>Componente</th>
                        <th>Status</th>
                        <th>Visualizar</th>
                    </tr>
                    </thead>`

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
      <td data-label="ID">${alerta.idAlerta}</td>
      <td data-label="Valor">${alerta.valor}</td>
      <td data-label="Prioridade">${alerta.prioridade}</td>
      <td data-label="Tipo">${alerta.tipo}</td>
      <td data-label="TipoComponente">${alerta.tipoComponente}</td>
      <td data-label="Status">${alertaNome}</td>
      <td data-label="Vizualizar"><i class='bx bx-arrow-from-left btn' onclick="abrirModal(${alerta.id})"></i></td>
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
            <h2>Título: ${alerta.titulo} </h2>
            <p><b>Data:</b> ${alerta.dataAlerta}</p>
            <p><b>Descrição:</b></p>
            <textarea rows="5" cols="30"> ${alerta.descricao}</textarea>
        </div>

        <div class="containerComponentes">
            <p><b>Hostname: </b> ${alerta.hostname}</p>
            <p><b>Mac Address: </b> ${alerta.Mac_Address}</p>
            <p><b>Jira key: </b> ${alerta.jira_key}</p>
            <hr>
            <h3>Informações Componente</h3>
            <p><b>Componente: </b>${alerta.tipoComponente}</p>
            <p><b>Modelo: </b>${alerta.modelo}</p>
            <p><b>Tipo: </b> ${alerta.medidaComponente}</p>  
            <p><b>Valor: </b> ${alerta.valor}</p>  
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Fechar",
    customClass: "alertaModal",
  })
}



var options = {
  chart: {
    type: 'line',
    height: '100%',
    width: '100%',
    foreColor: '#fff'
  },
  series: [{
    name: 'sales',
    data: [30,40,45,50,49,60,70,91,125]
  }],
  colors: ['#fff'],
  xaxis: {
    categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
  }
}

var options2 = {
  chart: {
    height: '100%',
    width: '100%',
      type: 'radialBar',
  },
  colors: ['#01627B', '#eee'],
  series: [60],
  labels: ['Uso'],
}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();


var grafico = new ApexCharts(document.getElementById("chartDisco"), options2)
grafico.render()