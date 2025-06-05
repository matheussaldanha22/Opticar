const itensPorPagina = 10
let paginaAtual = 1


let dadosTempoReal = []


document.addEventListener("DOMContentLoaded", () => {
  renderGraficos()
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

let cpuData = []
let discoData = []
let ramData = []
let downloadData = []
let uploadData = []

function renderGraficos() {
  // Crie o gráfico com dados vazios
  var cpu = {
    chart: {
      type: "line",
      height: "100%",
      width: "100%",
      foreColor: "#000",
    },
    series: [
      {
        name: "Porcentagem",
        data: [],
      },
    ],
    stroke: {
      curve: "smooth",
      width: 3
    },
    colors: ["#000"],
    xaxis: {
      categories: [],
    },
  };

  var disco = {
    chart: {
      height: "100%",
      width: "100%",
      type: "radialBar",
    },
    colors: ["#01627B", "#4b4b4b9c"],
    series: [60],
    labels: ["Uso"],
  }

  var ram = {
    chart: {
      type: "line",
      height: "100%",
      width: "100%",
      foreColor: "#000",
    },
    series: [
      {
        name: "Ram",
        data: [],
      },
    ],
    stroke: {
      curve: "smooth",
      width: 3
    },
    colors: ["#000"],
    xaxis: {
      categories: [],
    },
  }

  chart = new ApexCharts(document.querySelector("#chart"), cpu);
  chart.render();

  graficoDisco = new ApexCharts(document.getElementById("chartDisco"), disco)
  graficoDisco.render()

  graficoRam = new ApexCharts(document.getElementById("chartRam"), ram)
  graficoRam.render()



  setInterval(() => {
    renderDados()
  }, 6000);
}





function renderDados() {
  let maquinaSelecionada = sessionStorage.getItem("idServidorSelecionado");
  const idFabrica = sessionStorage.getItem("FABRICA_ID");

  console.log(`Maquina selecionada:  ${maquinaSelecionada}`)

  fetch(`/dashMonitoramento/dadosRecebidos/${idFabrica}`)
    .then((res) => res.json())
    .then((dados) => {
      dados.forEach((servidores) => {
        servidores.forEach((novoServidor) => {
          if (novoServidor.CPU.idMaquina == maquinaSelecionada) {
            dadosTempoReal.push([novoServidor]);
            if (dadosTempoReal.length > 7) {
              dadosTempoReal.shift();
            }
          }
        });
      });

      cpuData = dadosTempoReal.map(arr => arr[0].CPU.valor);

      discoData = [dadosTempoReal[dadosTempoReal.length - 1]?.[0]?.DISCO?.valor || 0]

      console.log(`Dados disco: ${discoData}`)

      ramData = dadosTempoReal.map(arr => arr[0].RAM.valor)

      downloadData = dadosTempoReal.map(arr => arr[0].RedeRecebida.valor)
      uploadData = dadosTempoReal.map(arr => arr[0].RedeEnviada.valor)


      const ultimoDisco = discoData[discoData.length - 1] || 0


      const cpuHorarios = dadosTempoReal.map(arr => {
        const agora = new Date();
        return agora.toLocaleTimeString('pt-BR', { hour12: false });
      });

      // Atualize apenas os dados do gráfico
      chart.updateSeries([{
        name: "Porcentagem",
        data: cpuData,
      }]);
      chart.updateOptions({
        xaxis: { categories: cpuHorarios }
      });


      graficoDisco.updateSeries([ultimoDisco])

      graficoDisco.updateOptions({
        // colors: ["#FF0"],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                show: true,
                fontSize: '22px',
                color: '#000'
              }
            }
          }
        }
      })

      graficoRam.updateSeries([{
        name: "Porcentagem",
        data: ramData
      }])
      graficoRam.updateOptions({
        xaxis: { categories: cpuHorarios }
      })






      // Atualize o texto de utilização
      const cpuTexto = cpuData[cpuData.length - 1] || 0;
      let utilizacaoTexto = document.getElementById('utilizacaoInfo');
      utilizacaoTexto.textContent = cpuTexto + '%';

      let utilizacaoDisco = document.getElementById('utilizacaoInfoDisco')
      utilizacaoDisco.textContent = ultimoDisco + '%'

      const ramTexto = ramData[ramData.length - 1] || 0;
      let utilizacaoRam = document.getElementById('utilizacaoInfoRam')
      utilizacaoRam.textContent = ramTexto + '%'


      const downloadTexto = downloadData[downloadData.length - 1] || 0
      const uploadTexto = uploadData[uploadData.length - 1] || 0

      let dowTexto = document.getElementById('recebida')
      let upTexto = document.getElementById('enviada')

      dowTexto.textContent = downloadTexto + 'MB/s'
      upTexto.textContent = uploadTexto + 'MB/s'


      console.log(cpuData)
      console.log(dadosTempoReal)
    });
}

function renderDadosPedido() {
  let maquinaSelecionada = sessionStorage.getItem("idServidorSelecionado");
  const idFabrica = sessionStorage.getItem("FABRICA_ID");

  console.log(`Maquina selecionada:  ${maquinaSelecionada}`)

  fetch(`/dashMonitoramento/dadosRecebidos/${idFabrica}`)
    .then((res) => res.json())
    .then((dados) => {
      dados.forEach((servidores) => {
        servidores.forEach((novoServidor) => {
          if (novoServidor.CPU.idMaquina == maquinaSelecionada) {
            dadosTempoReal.push([novoServidor]);
            if (dadosTempoReal.length > 7) {
              dadosTempoReal.shift();
            }
          }
        });
      });

      cpuData = dadosTempoReal.map(arr => arr[0].CPU.valor);

      discoData = [dadosTempoReal[dadosTempoReal.length - 1]?.[0]?.DISCO?.valor || 0]

      console.log(`Dados disco: ${discoData}`)

      ramData = dadosTempoReal.map(arr => arr[0].RAM.valor)

      downloadData = dadosTempoReal.map(arr => arr[0].RedeRecebida.valor)
      uploadData = dadosTempoReal.map(arr => arr[0].RedeEnviada.valor)




      const cpuHorarios = dadosTempoReal.map(arr => {
        const agora = new Date();
        return agora.toLocaleTimeString('pt-BR', { hour12: false });
      });

      // Atualize apenas os dados do gráfico
      chart.updateSeries([{
        name: "Porcentagem",
        data: cpuData,
      }]);
      chart.updateOptions({
        xaxis: { categories: cpuHorarios }
      });


      graficoDisco.updateSeries([ultimoDisco])

      graficoDisco.updateOptions({
        // colors: ["#FF0"],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                show: true,
                fontSize: '22px',
                color: '#000'
              }
            }
          }
        }
      })

      graficoRam.updateSeries([{
        name: "Porcentagem",
        data: ramData
      }])
      graficoRam.updateOptions({
        xaxis: { categories: cpuHorarios }
      })

      // Atualize o texto de utilização
      const cpuTexto = cpuData[cpuData.length - 1] || 0;
      let utilizacaoTexto = document.getElementById('utilizacaoInfo');
      utilizacaoTexto.textContent = cpuTexto + '%';

      const ultimoDisco = discoData[discoData.length - 1] || 0
      let utilizacaoDisco = document.getElementById('utilizacaoInfoDisco')
      utilizacaoDisco.textContent = ultimoDisco + '%'

      const ramTexto = ramData[ramData.length - 1] || 0;
      let utilizacaoRam = document.getElementById('utilizacaoInfoRam')
      utilizacaoRam.textContent = ramTexto + '%'


      const downloadTexto = downloadData[downloadData.length - 1] || 0
      const uploadTexto = uploadData[uploadData.length - 1] || 0

      let dowTexto = document.getElementById('recebida')
      let upTexto = document.getElementById('enviada')

      dowTexto.textContent = downloadTexto + 'MB/s'
      upTexto.textContent = uploadTexto + 'MB/s'


      console.log(cpuData)
      console.log(dadosTempoReal)
    });
}


function modalFiltro(nomeComponente) {
  let maquinaSelecionada = sessionStorage.getItem('idServidorSelecionado')
  let filtroComponente = nomeComponente.dataset.idFiltro

  fetch(`dashMonitoramento/filtroMedida/${maquinaSelecionada}`)
    .then((resposta) => resposta.json())
    .then((dados) => {
      // Filtra apenas os itens do componente selecionado
      const componentesFiltrados = dados.filter(item => 
        item.componente === filtroComponente
      );
      console.log(componentesFiltrados)
      console.log(filtroComponente)
      
      if (componentesFiltrados.length > 0) {
        // Cria opções para escolher a medida
        let opcoesHTML = '';
        componentesFiltrados.forEach(item => {
          opcoesHTML += `<option value="${item.medida}">${item.medida}</option>`;
        });
        
        Swal.fire({
          title: `Filtro ${filtroComponente}`,
          html: `
            <div class="modal-test">
              <div class="containerConfigAlerta">
                <h2>Escolha a medida:</h2>
                <select id="selectMedida" class="form-select">
                  ${opcoesHTML}
                </select>
              </div>
            </div>
          `,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "Aplicar",
          cancelButtonText: "Fechar",
          customClass: "alertaModal",
          preConfirm: () => {
            const medidaSelecionada = document.getElementById('selectMedida').value;
            // Aqui você pode fazer algo com os valores selecionados
            console.log(`Filtro aplicado: ${filtroComponente} - ${medidaSelecionada}`);
            return { medida: medidaSelecionada };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            // Faça algo com o resultado após confirmar
          }
        });
      } else {
        Swal.fire({
          title: "Erro",
          text: `Não encontramos medidas para o componente ${filtroComponente}`,
          icon: "error"
        });
      }
    })
    .catch(error => {
      console.error("Erro ao buscar medidas:", error);
      Swal.fire({
        title: "Erro",
        text: "Falha ao carregar as medidas disponíveis",
        icon: "error"
      });
    });
}









// var ram = {
//   chart: {
//     type: "line",
//     height: "100%",
//     width: "100%",
//     foreColor: "#000",
//   },
//   series: [
//     {
//       name: "sales",
//       data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
//     },
//   ],
//   colors: ["#000"],
//   xaxis: {
//     categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
//   },
// }


