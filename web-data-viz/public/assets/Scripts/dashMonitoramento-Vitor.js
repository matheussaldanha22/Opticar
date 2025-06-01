const itensPorPagina = 10
let paginaAtual = 1
let dadosTempoReal = []

document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    renderPagina()
    renderKpis()
  }, 6000)
})

function renderPagina() {
  fetch("/dashMonitoramento/dadosRecebidos")
    .then((res) => res.json())
    .then((dados) => {
      dadosTempoReal = dados
      console.log(dadosTempoReal)
      if (
        sessionStorage.getItem("FABRICA_ID") == dadosTempoReal.CPU.idFabrica
      ) {
        console.log(
          `SessionStorage: ${sessionStorage.getItem("FABRICA_ID")}, JSON: ${
            dadosTempoReal.CPU.idFabrica
          }`
        )
        renderTabela()
      }
    })
    .catch((err) => {
      console.error("Erro ao carregar servidores:", err)
    })
}

function renderTabela() {
  const tabela = document.getElementById("tabela-alertas")
  let tempoReal = dadosTempoReal
  tabela.innerHTML = `<thead>
                        <tr>
                        <th>Id</th>
                        <th>Servidor</th>
                        <th>CPU</th>
                        <th>RAM</th>
                        <th>Disco</th>
                        <th>Download</th>
                        <th>Upload</th>
                        <th>Visualizar</th>
                    </tr>
                    </thead>`

  const tr = document.createElement("tr")
  tr.id = `servidor-${tempoReal.CPU.idMaquina}`
  tr.innerHTML = `
      <td data-label="ID">${tempoReal.CPU.idMaquina}</td>
      <td data-label="Servidor">SV${tempoReal.CPU.idMaquina}</td>
      <td data-label="CPU (%)">${tempoReal.CPU.valor}%</td>
      <td data-label="RAM">${tempoReal.RAM.valor}%</td>
      <td data-label="Disco">${tempoReal.DISCO.valor}%</td>
      <td data-label="Download">${tempoReal.RedeRecebida.valor} MB/s</td>
      <td data-label="Upload">${tempoReal.RedeEnviada.valor} MB/s</td>
      <td data-label="Visualizar"><i class='fa fa-eye servidores' data-id="${tempoReal.CPU.idMaquina}"></i></td>
    `
  tabela.appendChild(tr)

  const btnServidor = tr.querySelector(".servidores")
  btnServidor.addEventListener("click", () => {
    const idServidor = btnServidor.getAttribute("data-id")
    sessionStorage.setItem("idServidorSelecionado", idServidor)
    window.location.href = "../../dashMonitoramento-vitor-especifico.html"
    console.log("Clicou no botão")
  })
}

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

// function servidorEspecifico(id) {
//   const dado = dadosTempoReal.find((item) => item[0].idMaquina === id)
//   console.log(`Dados modal: ${dado}`)

//   if (!dado) {
//     return Swal.fire("Erro", "Servidor não encontrado", "error")
//   }

//   Swal.fire({
//     title: `Detalhes do Servidor `,
//     html: `
//       <div class="modal-test">
//         <div class="containerConfigAlerta">
//             <h2>Título: ${dado[0].idMaquina} </h2>
//             <p><b>Servidor:</b> ${dado[0].idMaquina}</p>
//             <p><b>Servidor:</b> ${dado[0].idMaquina}</p>
//             <p><b>Valor: ${dado[0].valor}</b></p>
//         </div>
//       </div>
//     `,
//     showCancelButton: true,
//     cancelButtonText: "Fechar",
//     customClass: "alertaModal",
//   })
// }
