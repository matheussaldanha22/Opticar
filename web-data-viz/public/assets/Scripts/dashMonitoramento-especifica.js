const itensPorPagina = 10
let paginaAtual = 1


let dadosTempoReal = []
let listaDadosPedido = []
let listaFiltroAplicado = []
let listaHorarios = []
let listaHorarios2 = []

let componenteFiltrado = ""
let medida = ""
let indicadorPedido = ""
let indicadorPedidoRam = ""

document.addEventListener("DOMContentLoaded", () => {
  renderGraficos()

  const idMaquina = sessionStorage.getItem('idServidorSelecionado')
  let servidor = document.getElementById('nomeServidor')

  servidor.textContent = 'SV' + idMaquina  

  setInterval(() => {
    buscarProcesso()
    renderTabelaProcessos()

  }, 500);



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

let cpuFiltro = false
let ramFiltro = false
let discoFiltro = false
let redeFiltro = false


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
    series: [0],
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
  }, 500);
}



let maquinasCritico = []

function renderDados() {
  let maquinaSelecionada = sessionStorage.getItem("idServidorSelecionado");
  const idFabrica = sessionStorage.getItem("FABRICA_ID");

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



      const agora = new Date();
      let hora = agora.toLocaleTimeString('pt-BR', { hour12: false });


      listaHorarios2.push(hora)

      if (listaHorarios2.length > 7) {
        listaHorarios2.shift()
      }


      if (!cpuFiltro) {
        // Inicio dados da CPU
        cpuData = dadosTempoReal.map(arr => arr[0].CPU.valor);

        limiteAtencao = dadosTempoReal.map(arr => arr[0].CPU.limiteAtencao)
        limiteCritico = dadosTempoReal.map(arr => arr[0].CPU.limiteCritico)

        const valorLimiteAtencao = limiteAtencao[0] || 0;
        const valorLimiteCritico = limiteCritico[0] || 0;

        const dadosLimiteAtencao = new Array(cpuData.length).fill(valorLimiteAtencao);
        const dadosLimiteCritico = new Array(cpuData.length).fill(valorLimiteCritico);


        // Atualize apenas os dados do gráfico
        chart.updateSeries([{
          name: "Porcentagem",
          data: cpuData,
        },
        {
          name: 'Limite Atenção',
          data: dadosLimiteAtencao,
          type: 'line'
        },
        {
          name: 'Limite Crítico',
          data: dadosLimiteCritico,
          type: 'line'
        }


        ]);
        chart.updateOptions({
          xaxis: { categories: listaHorarios2 },
          colors: ['#000', '#FFA500', '#FF0000']
        });

        const cpuTexto = cpuData[cpuData.length - 1] || 0;
        let utilizacaoTexto = document.getElementById('utilizacaoInfo');
        utilizacaoTexto.textContent = cpuTexto + '%';
        // Fim dados da CPU
      } else {
        renderDadosPedido(medida, componenteFiltrado)
      }

      if (!ramFiltro) {
        //  Inicio dados RAM
        ramData = dadosTempoReal.map(arr => arr[0].RAM.valor)
        limiteAtencao = dadosTempoReal.map(arr => arr[0].RAM.limiteAtencao)
        limiteCritico = dadosTempoReal.map(arr => arr[0].RAM.limiteCritico)

        const valorLimiteAtencao = limiteAtencao[0] || 0;
        const valorLimiteCritico = limiteCritico[0] || 0;

        const dadosLimiteAtencao = new Array(cpuData.length).fill(valorLimiteAtencao);
        const dadosLimiteCritico = new Array(cpuData.length).fill(valorLimiteCritico);



        graficoRam.updateSeries([{
          name: "Porcentagem",
          data: ramData
        },
        {
          name: 'Limite Atenção',
          data: dadosLimiteAtencao,
          type: 'line'
        },
        {
          name: 'Limite Crítico',
          data: dadosLimiteCritico,
          type: 'line'
        }
        ])
        graficoRam.updateOptions({
          xaxis: { categories: listaHorarios2 },
          colors: ['#000', '#FFA500', '#FF0000']
        })

        const ramTexto = ramData[ramData.length - 1] || 0;
        let utilizacaoRam = document.getElementById('utilizacaoInfoRam')
        utilizacaoRam.textContent = ramTexto + '%'

        // Fim dados RAM
      } else {
        renderDadosPedido(medida, componenteFiltrado)
      }


      if (!discoFiltro) {
        //  Inicio Disco
        discoData = [dadosTempoReal[dadosTempoReal.length - 1]?.[0]?.DISCO?.valor || 0]

        const ultimoDisco = discoData[discoData.length - 1] || 0

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

        let utilizacaoDisco = document.getElementById('utilizacaoInfoDisco')
        utilizacaoDisco.textContent = ultimoDisco + '%'
        //  Fim Disco
      }

      if (!redeFiltro) {
        //  Inicio DOWNLOAD e UPLOAD
        downloadData = dadosTempoReal.map(arr => arr[0].RedeRecebida.valor)
        uploadData = dadosTempoReal.map(arr => arr[0].RedeEnviada.valor)

        const downloadTexto = downloadData[downloadData.length - 1] || 0
        const uploadTexto = uploadData[uploadData.length - 1] || 0

        let dowTexto = document.getElementById('recebida')
        let upTexto = document.getElementById('enviada')

        dowTexto.textContent = downloadTexto + 'MB/s'
        upTexto.textContent = uploadTexto + 'MB/s'

        //  Fim DOWNLOAD e UPLOAD
      }
    });
}

let novaMaquina = {}

function adicionarOuSubstituirDados(maquinaId, nomeComponente, dados) {
  // Cria um NOVO objeto a cada chamada
  let novaMaquina = {};
  novaMaquina[nomeComponente] = dados;

  listaFiltroAplicado.push([novaMaquina]);

  if (listaFiltroAplicado.length > 7) {
    listaFiltroAplicado.shift();
  }

  console.log('Dados adicionados:', novaMaquina);
  console.log('Lista atual:', listaFiltroAplicado);
}





function renderDadosPedido(medidaSelecionada, filtroComponente) {
  let maquinaSelecionada = sessionStorage.getItem("idServidorSelecionado");
  const idFabrica = sessionStorage.getItem("FABRICA_ID");
  console.log('Estou na funcao renderDadosPedido')
  console.log(`Maquina selecionada:  ${maquinaSelecionada}`)
  console.log('Cpu esta filtrada')
  console.log(`MedidaSelecionada dentro da funcao: ${medidaSelecionada}`)

  function adicionarOuSubstituirDados(maquinaId, nomeComponente, dados) {
    // Cria um NOVO objeto a cada chamada
    let novaMaquina = {};
    novaMaquina[nomeComponente] = dados;

    listaFiltroAplicado.push([novaMaquina]);

    if (listaFiltroAplicado.length > 7) {
      listaFiltroAplicado.shift();
    }

    console.log('Dados adicionados:', novaMaquina);
    console.log('Lista atual:', listaFiltroAplicado);
  }
  fetch(`/dashMonitoramento/dadosPedidoRecebidos/${idFabrica}/${maquinaSelecionada}`)
    .then((res) => res.json())
    .then((dados) => {
      dados.forEach((componente) => {
        const objComponente = Object.keys(componente)
        let objeto = componente[objComponente]
        const nomeComponente = objComponente[0]
        const idMaquina = objeto.idMaquina
        // console.log(`Nome componente: ${nomeComponente}`)
        // console.log(`Componente: ${nomeComponente} | Medida: ${objeto.Medida} | idMaquina: ${idMaquina}`)
        // console.log(`FiltroComponente: ${filtroComponente} | MedidaSelecionada: ${medidaSelecionada} | idMaquina: ${idMaquina}`)
        if ((objeto.Medida == medidaSelecionada) && (nomeComponente == filtroComponente)) {
          console.log(`Componente: ${nomeComponente} | Medida: ${objeto.Medida} | idMaquina: ${idMaquina}`)
          adicionarOuSubstituirDados(idMaquina, nomeComponente, objeto)
        }
      });
    });

  console.log('Indicador pedido: ' + indicadorPedido)

  const agora = new Date();
  let hora = agora.toLocaleTimeString('pt-BR', { hour12: false });
  listaHorarios.push(hora)

  if (listaHorarios.length > 7) {
    listaHorarios.shift()
  }

  if (cpuFiltro) {
    // Inicio dados da CPU
    cpuData = listaFiltroAplicado.map(arr => arr[0].Cpu.Valor)
    limiteAtencao = listaFiltroAplicado.map(arr => arr[0].Cpu.limiteAtencao)
    limiteCritico = listaFiltroAplicado.map(arr => arr[0].Cpu.limiteCritico)

    const valorLimiteAtencao = limiteAtencao[0] || 0;
    const valorLimiteCritico = limiteCritico[0] || 0;

    const dadosLimiteAtencao = new Array(cpuData.length).fill(valorLimiteAtencao);
    const dadosLimiteCritico = new Array(cpuData.length).fill(valorLimiteCritico);

    // Atualize apenas os dados do gráfico
    chart.updateSeries([{
      name: `${medidaSelecionada}`,
      data: cpuData,
    },
    {
      name: 'Limite Atenção',
      data: dadosLimiteAtencao,
      type: 'line'
    },
    {
      name: 'Limite Crítico',
      data: dadosLimiteCritico,
      type: 'line'
    }]);
    chart.updateOptions({
      xaxis: { categories: listaHorarios },
      colors: ['#000', '#FFA500', '#FF0000']
    });

    const cpuTexto = cpuData[cpuData.length - 1] || 0;
    let utilizacaoTexto = document.getElementById('utilizacaoInfo')
    utilizacaoTexto.textContent = cpuTexto + `${indicadorPedido}`
    // Fim dados da CPU
  }

  if (ramFiltro) {
    //  Inicio dados RAM
    ramData = listaFiltroAplicado.map(arr => arr[0].Ram.Valor)
    limiteAtencao = listaFiltroAplicado.map(arr => arr[0].Ram.limiteAtencao)
    limiteCritico = listaFiltroAplicado.map(arr => arr[0].Ram.limiteCritico)

    const valorLimiteAtencao = limiteAtencao[0] || 0;
    const valorLimiteCritico = limiteCritico[0] || 0;

    const dadosLimiteAtencao = new Array(cpuData.length).fill(valorLimiteAtencao);
    const dadosLimiteCritico = new Array(cpuData.length).fill(valorLimiteCritico);

    graficoRam.updateSeries([{
      name: `${medidaSelecionada}`,
      data: ramData
    },
    {
      name: 'Limite Atenção',
      data: dadosLimiteAtencao,
      type: 'line'
    },
    {
      name: 'Limite Crítico',
      data: dadosLimiteCritico,
      type: 'line'
    }
    ])
    graficoRam.updateOptions({
      xaxis: { categories: listaHorarios }
    })

    const ramTexto = ramData[ramData.length - 1] || 0;
    let utilizacaoRam = document.getElementById('utilizacaoInfoRam')
    utilizacaoRam.textContent = ramTexto + `${indicadorPedidoRam}`
    // Fim dados RAM
  }
  //  Adicionar uma variavel que tera mhz, %, etc
}


function modalFiltro(nomeComponente) {
  let maquinaSelecionada = sessionStorage.getItem('idServidorSelecionado')
  let idFabrica = sessionStorage.getItem('FABRICA_ID')
  let filtroComponente = nomeComponente.dataset.idFiltro
  let medidaSelecionada = ""

  fetch(`dashMonitoramento/filtroMedida/${maquinaSelecionada}`)
    .then((resposta) => resposta.json())
    .then((dados) => {
      // Filtra apenas os itens do componente selecionado
      const componentesFiltrados = dados.filter(item =>
        item.componente === filtroComponente
      );
      // console.log(componentesFiltrados)
      // console.log(filtroComponente)

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
            medidaSelecionada = document.getElementById('selectMedida').value;
            // Aqui você pode fazer algo com os valores selecionados
            console.log(`Filtro aplicado: ${filtroComponente} - ${medidaSelecionada}`);
            return { medida: medidaSelecionada };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            // Faça algo com o resultado após confirmar
            // renderDadosPedido(result.value.medida, filtroComponente)
            medida = result.value.medida
            console.log(`MedidaSelecionada: ${medidaSelecionada}`)
            console.log(`MedidaSelecionada: ${medida}`)
            componenteFiltrado = filtroComponente
            console.log(`Indicador: ${indicadorPedido}`)
            const medidaLower = medida.toLowerCase()
            if (medidaLower.includes('fr')) {
              indicadorPedido = 'Mhz'
              indicadorPedidoRam = 'Mhz'
              console.log('Estou no if de frequencia')
            } else if (medida == 'Porcentagem') {
              indicadorPedido = '%'
              indicadorPedidoRam = '%'
            }



            indicadorPedidoRam

            if (componenteFiltrado == 'Cpu') {
              cpuFiltro = true
            }

            if (componenteFiltrado == 'Ram') {
              ramFiltro = true
            }

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


let listaProcessos = []

function buscarProcesso() {
  const idMaquina = sessionStorage.getItem('idServidorSelecionado')

  if (!idMaquina) {
    console.log("Nenhuma máquina selecionada");
    return;
  }

  fetch(`dashMonitoramento/listarProcessos/${idMaquina}`)
    .then((resposta) => resposta.json())
    .then((dados) => {
      console.log("Processos recebidos do backend:", dados);

      // ✅ Simples: substitui a lista inteira pelos novos dados
      listaProcessos = dados;

      console.log("Lista de processos atualizada:", listaProcessos);
      console.log("Quantidade de processos:", listaProcessos.length);
    })
    .catch(error => {
      console.error("Erro ao buscar processos:", error);
    });
}

function renderTabelaProcessos() {
  let idMaquina = sessionStorage.getItem('idServidorSelecionado')
  let tbody = document.getElementById('tbody')


  // ✅ Limpa a tabela antes de renderizar
  tbody.innerHTML = '';

  console.log("Renderizando processos:", listaProcessos);
  console.log("Quantidade para renderizar:", listaProcessos.length);

  // ✅ Sempre renderiza exatamente 3 linhas
  for (let i = 0; i < 3; i++) {
    const processo = listaProcessos[i] || {
      pid: 0,
      nome: 'Processo não encontrado',
      cpu: 0,
      ram: 0,
      idMaquina: 0
    };

    const tr = document.createElement("tr")
    tr.id = `servidor-${processo.idMaquina}-${i}`

    tr.innerHTML = `
        <td data-label="ID">${processo.pid || i + 1}</td>
        <td data-label="Processo">${processo.nome}</td>
        <td data-label="CPU">${processo.cpu}%</td>
        <td data-label="RAM">${processo.ram}%</td>
        <td data-label="Finalizar processo"><i class="fa-solid fa-trash" aria-hidden="true" onclick="finalizarProcesso(${processo.pid}, '${processo.nome}', ${idMaquina})"></i></td>
      `
    tbody.appendChild(tr)
  }
}

function finalizarProcesso(pid, nome, idMaquina) {

  Swal.fire({
    title: "Processo",
    text: "Para confirmar, digite 'matar' no campo abaixo:",
    input: 'text',
    inputPlaceholder: 'Digite "matar" para confirmar',
    showCancelButton: true,
    confirmButtonText: "Aplicar",
    cancelButtonText: "Fechar",
    preConfirm: (value) => {
      if (value !== 'matar') {
        Swal.showValidationMessage('Você deve digitar "matar" para confirmar a ação');
        return false;
      }
      return true;
    },
    allowOutsideClick: false,
    allowEscapeKey: false
  })
  .then((result) => {
    if (result.isConfirmed) {
      fetch(`dashMonitoramento/inserirProcesso`, {    
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: pid,
          nome: nome,
          fkServidorMaquina: idMaquina
        }),
      })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          console.log(res.json())
        }
      })
      .then((res) => {
        if (res) {
          console.log("Processo finalizado com sucesso!")
          Swal.fire({
            title: "Sucesso",
            text: "Processo finalizado!",
            icon: "success",
            confirmButtonText: "OK",
          })
        } else {
          console.log("Erro ao finalizar processo")
          Swal.fire({
            title: "Erro",
            text: "Erro ao finalizar processo",
            icon: "error",
            confirmButtonText: "OK",
          })
        }
      })
    }
  })
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


