const itensPorPagina = 10
let paginaAtual = 1
let dadosTempoReal = []

document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    renderPagina()
    renderKpis()
  }, 6000)
})



let dadosTempoRealFiltrados = []



// function renderPagina() {
//   const idFabrica = sessionStorage.getItem("FABRICA_ID")

//   fetch(`/dashMonitoramento/dadosRecebidos/${idFabrica}`)
//     .then((res) => res.json())
//     .then((dados) => {
//       // Para cada servidor recebido
//       dados.forEach((servidores) => {
//         servidores.forEach((novoServidor) => {
//           // Procura se já existe no array
//           const idx = dadosTempoReal.findIndex(
//             (arr) => arr[0].CPU.idMaquina === novoServidor.CPU.idMaquina
//           )
//           if (idx !== -1) {
//             // Atualiza o existente
//             dadosTempoReal[idx][0] = novoServidor
//           } else {
//             // Adiciona novo
//             dadosTempoReal.push([novoServidor])
//           }
//         })
//       })










//       dadosTempoReal.forEach(dados => {
//         dados.forEach((servidor) => {
//           // console.log('CPU ' + servidor.CPU.valor)
//           console.log('Estou no forEach')

//           // Controladores
//           let controlCpuAtencao = false
//           let controlRamAtencao = false
//           let controlDiscoAtencao = false

//           let controlCpuCritico = false
//           let controlRamCritico = false
//           let controlDiscoCritico = false

//           // Valor atual cpu, ram e disco
//           let valorCpu = servidor.CPU.valor
//           let valorRam = servidor.RAM.valor
//           let valorDisco = servidor.DISCO.valor

//           // Valores de limiteAtenção e limiteCritico
//           let valorLimiteACpu = servidor.CPU.limiteAtencao
//           let valorLimiteCCpu = servidor.CPU.limiteCritico

//           let valorLimiteARam = servidor.RAM.limiteAtencao
//           let valorLimiteCRam = servidor.RAM.limiteCritico

//           let valorLimiteADisco = servidor.DISCO.limiteAtencao
//           let valorLimiteCDisco = servidor.DISCO.limiteCritico

//           // Pontos
//           let pontosCpu = 0
//           let pontosRam = 0
//           let pontosDisco = 0

//           let pontosMaquina = 0


//           // CPU Atenção
//           if ((valorCpu > valorLimiteACpu) && !controlCpuAtencao) {
//             pontosCpu++
//             controlCpuAtencao = true
//           } else if ((valorCpu < valorLimiteACpu) && controlCpuAtencao) {
//             pontosCpu--
//             controlCpuAtencao = false
//           }
//           // CPU Critico
//           if ((valorCpu > valorLimiteCCpu) && !controlCpuCritico) {
//             pontosCpu++
//             controlCpuCritico = true
//           } else if ((valorCpu < valorLimiteCCpu) && controlCpuCritico) {
//             pontosCpu--
//             controlCpuCritico = false
//           }
//           /////////////////////////////////////////////////////////////////////////////////////////////////

//           // Ram Atenção
//           if ((valorRam > valorLimiteARam) && !controlRamAtencao) {
//             pontosRam++
//             controlRamAtencao = true
//           } 
//            if ((valorRam < valorLimiteARam) && controlRamAtencao) {
//             pontosRam--
//             controlRamAtencao = false
//           }
//           // Ram Critico
//           if ((valorRam > valorLimiteCRam) && !controlRamCritico) {
//             pontosRam++
//             controlRamCritico = true
//           } else if ((valorRam < valorLimiteCRam) && controlRamCritico) {
//             pontosRam--
//             controlRamCritico = false
//           }
//           /////////////////////////////////////////////////////////////////////////////////////////////////

//           // Disco Atenção
//           if ((valorDisco > valorLimiteADisco) && !controlDiscoAtencao) {
//             pontosDisco++
//             controlDiscoAtencao = true
//           } else if ((valorDisco < valorLimiteADisco) && controlDiscoAtencao) {
//             pontosDisco--
//             controlDiscoAtencao = false
//           }
//           // Disco Critico
//           if ((valorDisco > valorLimiteCDisco) && !controlDiscoCritico) {
//             pontosDisco++
//             controlDiscoCritico = true
//           } else if ((valorDisco < valorLimiteCDisco) && controlDiscoCritico) {
//             pontosDisco--
//             controlDiscoCritico = false
//           }
//           console.log(`Pontos cpu: ${pontosCpu}, pontos ram: ${pontosRam}, pontos disco: ${pontosDisco}`)

//           pontosMaquina += pontosCpu + pontosRam + pontosDisco
//           console.log(`Pontos maquina: ${pontosMaquina}`)
//           let estadoMaquina = ""

//           if (pontosMaquina > 1 && pontosMaquina < 4) {
//             estadoMaquina = "Atenção"
//             dadosTempoRealFiltrados.push(servidor, { "estadoMaquina": estadoMaquina })
//             console.log('Dados Filtrados')
//             console.log(dadosTempoRealFiltrados)

//           } else if (pontosMaquina > 3 && pontosMaquina < 7) {
//             estadoMaquina = "Critico"
//             dadosTempoRealFiltrados.push(servidor, { "estadoMaquina": estadoMaquina })
//             console.log('Dados Filtrados')
//             console.log(dadosTempoRealFiltrados)
//           }
//         })
//       });







//       renderTabela()
//     })
//     .catch((err) => {
//       console.error("Erro ao carregar servidores:", err)
//     })
// }

function renderPagina() {
  const idFabrica = sessionStorage.getItem("FABRICA_ID")

  fetch(`/dashMonitoramento/dadosRecebidos/${idFabrica}`)
    .then((res) => res.json())
    .then((dados) => {
      // Variáveis de controle e pontos devem ser inicializadas fora do loop de servidores
      let pontosCpu = 0
      let pontosRam = 0
      let pontosDisco = 0
      let pontosMaquina = 0
      let controlCpuAtencao = false
      let controlRamAtencao = false
      let controlDiscoAtencao = false
      let controlCpuCritico = false
      let controlRamCritico = false
      let controlDiscoCritico = false


      // Para cada servidor recebido
      dados.forEach((servidores) => {
        servidores.forEach((novoServidor) => {
          const idx = dadosTempoReal.findIndex(
            (arr) => arr[0].CPU.idMaquina === novoServidor.CPU.idMaquina
          )
          if (idx !== -1) {
            dadosTempoReal[idx][0] = novoServidor
          } else {
            dadosTempoReal.push([novoServidor])
          }
        })
      })
      dadosTempoReal.forEach(dados => {
        dados.forEach((servidor) => {
          // Atualize os pontos e controles apenas dentro deste loop
          pontosCpu = 0
          pontosRam = 0
          pontosDisco = 0

          let valorCpu = servidor.CPU.valor
          let valorRam = servidor.RAM.valor
          let valorDisco = servidor.DISCO.valor

          let valorLimiteACpu = servidor.CPU.limiteAtencao
          let valorLimiteCCpu = servidor.CPU.limiteCritico
          let valorLimiteARam = servidor.RAM.limiteAtencao
          let valorLimiteCRam = servidor.RAM.limiteCritico
          let valorLimiteADisco = servidor.DISCO.limiteAtencao
          let valorLimiteCDisco = servidor.DISCO.limiteCritico

          // CPU Atenção
          if ((valorCpu > valorLimiteACpu) && !controlCpuAtencao) {
            pontosCpu++
            controlCpuAtencao = true
          }
          if ((valorCpu < valorLimiteACpu) && controlCpuAtencao) {
            pontosCpu--
            controlCpuAtencao = false
          }
          // CPU Critico
          if ((valorCpu > valorLimiteCCpu) && !controlCpuCritico) {
            pontosCpu++
            controlCpuCritico = true
          }
          if ((valorCpu < valorLimiteCCpu) && controlCpuCritico) {
            pontosCpu--
            controlCpuCritico = false
          }

          // Ram Atenção
          if ((valorRam > valorLimiteARam) && !controlRamAtencao) {
            pontosRam++
            controlRamAtencao = true
          }
          if ((valorRam < valorLimiteARam) && controlRamAtencao) {
            pontosRam--
            controlRamAtencao = false
          }
          // Ram Critico
          if ((valorRam > valorLimiteCRam) && !controlRamCritico) {
            pontosRam++
            controlRamCritico = true
          }
          if ((valorRam < valorLimiteCRam) && controlRamCritico) {
            pontosRam--
            controlRamCritico = false
          }

          // Disco Atenção
          if ((valorDisco > valorLimiteADisco) && !controlDiscoAtencao) {
            pontosDisco++
            controlDiscoAtencao = true
          }
          if ((valorDisco < valorLimiteADisco) && controlDiscoAtencao) {
            pontosDisco--
            controlDiscoAtencao = false
          }
          // Disco Critico
          if ((valorDisco > valorLimiteCDisco) && !controlDiscoCritico) {
            pontosDisco++
            controlDiscoCritico = true
          }
          if ((valorDisco < valorLimiteCDisco) && controlDiscoCritico) {
            pontosDisco--
            controlDiscoCritico = false
          }
          console.log(`Pontos cpu: ${pontosCpu}, pontos ram: ${pontosRam}, pontos disco: ${pontosDisco}`)
          pontosMaquina = pontosCpu + pontosRam + pontosDisco
          console.log(`Pontos maquina: ${pontosMaquina}`)

          let estadoMaquina = ""


          if (pontosMaquina > 1 && pontosMaquina < 4) {
            estadoMaquina = "Atenção"
            adicionarServidor(servidor, estadoMaquina);

          } else if (pontosMaquina > 3 && pontosMaquina < 7) {
            estadoMaquina = "Critico"
            adicionarServidor(servidor, estadoMaquina);
          }
        })
      });








      renderTabela()
    })
    .catch((err) => {
      console.error("Erro ao carregar servidores:", err)
    })
}

function adicionarServidor(servidor, estadoMaquina) {
  // Procura se já existe um servidor com o mesmo idMaquina
  const indiceExistente = dadosTempoRealFiltrados.findIndex(item => 
    item[0].CPU.idMaquina === servidor.CPU.idMaquina
  );

  if (indiceExistente !== -1) {
    // Se existe, atualiza o servidor existente
    dadosTempoRealFiltrados[indiceExistente] = [servidor, { "estadoMaquina": estadoMaquina }];
    console.log(`Servidor ${servidor.CPU.idMaquina} atualizado no array filtrados`);
  } else {
    // Se não existe, adiciona um novo
    dadosTempoRealFiltrados.push([servidor, { "estadoMaquina": estadoMaquina }]);
    console.log(`Servidor ${servidor.CPU.idMaquina} adicionado ao array filtrados`);
  }
  
  console.log('Array dadosTempoRealFiltrados atual:');
  console.log(dadosTempoRealFiltrados);
}



function renderTabela() {

  // console.log('Estou percorrendo o array de dadosFiltrados')
  // dadosTempoRealFiltrados.forEach((dados, index) => {
  //   console.log(dados[index])
  // })



  const tabela = document.getElementById("tabela-alertas")
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

  dadosTempoReal.forEach((dados) => {
    dados.forEach((tempoReal) => {
      // let tempoReal = dados[0]
      // console.log("Tempo real: " + tempoReal)

      const tr = document.createElement("tr")
      tr.id = `servidor-${tempoReal.CPU.idMaquina}`
      tr.innerHTML += `
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
        console.log("Clicou no botão")
        setInterval(() => {
          window.location.href = "../../dashMonitoramento-vitor-especifico.html"
        }, 2000)
      })
    })
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
      // console.log(`QtdServidoresMonitorados: ${dados[0].qtdServidores}`)
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
