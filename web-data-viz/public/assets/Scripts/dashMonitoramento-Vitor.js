const itensPorPagina = 10
let paginaAtual = 1
let dadosTempoReal = []

document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    renderPagina()
    renderKpis()
  }, 5000)
})

function renderPagina() {
  fetch("/dashMonitoramento/dadosRecebidos")
    .then((res) => res.json())
    .then((dados) => {
      dadosTempoReal = dados

      // console.log(`Quantidade de objetos: ${dadosTempoReal[0].length}`)
      // console.log(`Quantidade de objetos2: ${dados}`)
      if (
        sessionStorage.getItem("FABRICA_ID") == dadosTempoReal[0][0].idFabrica
      ) {
        console.log(
          `SessionStorage: ${sessionStorage.getItem("FABRICA_ID")}, JSON: ${
            dadosTempoReal[0][0].idFabrica
          }`
        )
        renderTabela()
        // renderPaginacao()
      }
    })
    .catch((err) => {
      console.error("Erro ao carregar servidores:", err)
    })
}

function renderTabela() {
  const tabela = document.getElementById("tabela-alertas")
  tabela.innerHTML = `<thead>
                        <tr>
                        <th>Id</th>
                        <th>Servidor</th>
                        <th>CPU</th>
                        <th>RAM</th>
                        <th>Disco</th>
                        <th>Rede</th>
                        <th>Visualizar</th>
                    </tr>
                    </thead>`

  // Agrupa por idMaquina
  // const agrupado = {}
  // dadosTempoReal.forEach((dado) => {
  //   if (!agrupado[dado.idMaquina]) agrupado[dado.idMaquina] = []
  //   agrupado[dado.idMaquina].push(dado)
  // })
  // const servidores = Object.values(agrupado)

  // const inicio = (pagina - 1) * itensPorPagina
  // const fim = inicio + itensPorPagina
  // const paginaDados = servidores.slice(inicio, fim)

  dadosTempoReal.forEach((servidor, index) => {
    const idMaquina = servidor[index].idMaquina
    let cpu = "-",
      ram = "-",
      disco = "-",
      rede = "-"

    servidor.forEach((dado) => {
      if (dado.tipo === "Cpu" && dado.medida === "Porcentagem")
        cpu = dado.valor + "%"
      else if (dado.tipo === "Ram") ram = dado.valor + "%"
      else if (dado.tipo === "Disco") disco = dado.valor + "%"
      else if (dado.tipo === "Rede") rede = dado.valor + "%"
    })

    console.log(
      `Dados: IdMaquina: ${servidor[0].idMaquina}, valor: ${servidor[0].valor}`
    )

    const tr = document.createElement("tr")
    tr.id = `servidor-${idMaquina}`
    tr.innerHTML = `
      <td data-label="ID">${idMaquina}</td>
      <td data-label="Servidor">SV${idMaquina}</td>
      <td data-label="CPU (%)">${cpu}</td>
      <td data-label="RAM">${ram}</td>
      <td data-label="Disco">${disco}</td>
      <td data-label="Rede">${rede}</td>
      <td data-label="Visualizar"><i class='fa fa-eye' onclick="servidorEspecifico(${idMaquina})"></i></td>
    `
    tabela.appendChild(tr)
  })
}

// function renderPaginacao() {
//   const paginacao = document.getElementById("paginacao")
//   paginacao.innerHTML = ""

//   const totalPaginas = Math.ceil(alertas.length / itensPorPagina)

//   for (let i = 1; i <= totalPaginas; i++) {
//     const btn = document.createElement("button")
//     btn.textContent = i
//     if (i === paginaAtual) btn.classList.add("active")
//     btn.addEventListener("click", () => {
//       paginaAtual = i
//       renderTabela(paginaAtual)
//       renderPaginacao()
//     })
//     paginacao.appendChild(btn)
//   }
// }

function renderKpis() {
  const idFabrica = sessionStorage.getItem("FABRICA_ID")

  let totalServidor = document.getElementById("qtdTotalServidores")

  fetch(`/dashMonitoramento/qtdServidoresPorFabrica/${idFabrica}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((dados) => {
      totalServidor.textContent = dados[0].qtdServidores
      console.log(`QtdServidoresMonitorados: ${dados[0].qtdServidores}`)
    })
}

function servidorEspecifico(id) {
  const dado = dadosTempoReal.find((item) => item[0].idMaquina === id)
  console.log(`Dados modal: ${dado}`)

  if (!dado) {
    return Swal.fire("Erro", "Servidor não encontrado", "error")
  }

  Swal.fire({
    title: `Detalhes do Servidor `,
    html: `
      <div class="modal-test">
        <div class="containerConfigAlerta">
            <h2>Título: ${dado[0].idMaquina} </h2>
            <p><b>Servidor:</b> ${dado[0].idMaquina}</p>
            <p><b>Servidor:</b> ${dado[0].idMaquina}</p>
            <p><b>Valor: ${dado[0].valor}</b></p>
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Fechar",
    customClass: "alertaModal",
  })
}
