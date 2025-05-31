const itensPorPagina = 10
let paginaAtual = 1
let dadosTempoReal = []


document.addEventListener("DOMContentLoaded", () => {
  setInterval(() =>{
  renderPagina()
  },5000)

})


function renderPagina(){
  fetch("/dashMonitoramento/dadosRecebidos")
    .then((res) => res.json())
    .then((dados) => {
      dadosTempoReal = dados
      console.log(dadosTempoReal)

if (dadosTempoReal.length > 6) {
  dadosTempoReal.splice(0, dadosTempoReal.length - 6);
}
      
      renderTabela(paginaAtual)
      renderPaginacao()
    })
    .catch((err) => {
      console.error("Erro ao carregar servidores:", err)
    })
}



function renderTabela(pagina) {
  const tabela = document.getElementById("tabela-alertas")
  tabela.innerHTML = ` <thead>
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

  const inicio = (pagina - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const paginaDados = dadosTempoReal.slice(inicio, fim)
  // console.log(dadosTempoReal.dadosVitorAlmeida)
  // console.log(`Tamanho do array: ${dadosTempoReal.dadosVitorAlmeida.length}`)

  paginaDados.forEach((servidor) => {
    let tr = document.getElementById(`servidor-${servidor.idMaquina}`); // Tenta pegar a linha existente

    if (!tr) {  // Se a linha não existir, cria uma nova
      tr = document.createElement("tr");
      tr.id = `servidor-${servidor.idMaquina}`;

      tr.innerHTML = `
        <td data-label="ID">${servidor.idMaquina}</td>
        <td data-label="Servidor">SV${servidor.idMaquina}</td>
        <td data-label="CPU (%)">-</td>
        <td data-label="RAM">-</td>
        <td data-label="Disco">-</td>
        <td data-label="Rede">-</td>
        <td data-label="Visualizar"><i class='fa fa-eye' onclick="servidorEspecifico(${servidor[0].idMaquina})"></i></td>
      `;

      tabela.appendChild(tr); // Adiciona a nova linha
    }

    
    servidor.forEach(dado => {
      if (dado.tipo === "Cpu" && dado.medida === "Porcentagem") {
        tr.cells[2].textContent = dado.valor + "%"; 
      } else if (dado.tipo === "Ram") {
        tr.cells[3].textContent = dado.valor + "%"; 
      } else if (dado.tipo === "Disco") {
        tr.cells[4].textContent = dado.valor + "%"; 
      } else if (dado.tipo === "Rede") {
        tr.cells[5].textContent = dado.valor + "%"; 
      }
    });
  });
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
