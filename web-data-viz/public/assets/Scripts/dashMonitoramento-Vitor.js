const itensPorPagina = 10
let paginaAtual = 1
let dadosTempoReal = []

document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    renderPagina()
    renderKpis()
  }, 1000)
})



let dadosTempoRealFiltrados = []





function renderPagina() {
  const idFabrica = sessionStorage.getItem("FABRICA_ID")

  fetch(`/dashMonitoramento/dadosRecebidos/${idFabrica}`)
    .then((res) => res.json())
    .then((dados) => {
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
          // MOVA AS VARIÁVEIS DE CONTROLE PARA DENTRO DO LOOP DE CADA SERVIDOR
          let pontosCpu = 0
          let pontosRam = 0
          let pontosDisco = 0
          let pontosMaquina = 0

          // Valores atuais
          let valorCpu = servidor.CPU.valor
          let valorRam = servidor.RAM.valor
          let valorDisco = servidor.DISCO.valor

          // Limites
          let valorLimiteACpu = servidor.CPU.limiteAtencao
          let valorLimiteCCpu = servidor.CPU.limiteCritico
          let valorLimiteARam = servidor.RAM.limiteAtencao
          let valorLimiteCRam = servidor.RAM.limiteCritico
          let valorLimiteADisco = servidor.DISCO.limiteAtencao
          let valorLimiteCDisco = servidor.DISCO.limiteCritico

          // SIMPLIFICAR A LÓGICA DE PONTUAÇÃO
          // CPU - 1 ponto se > limiteAtencao, 2 pontos se > limiteCritico
          if (valorCpu > valorLimiteCCpu) {
            pontosCpu = 2; // Crítico
          } else if (valorCpu > valorLimiteACpu) {
            pontosCpu = 1; // Atenção
          }

          // RAM - mesma lógica
          if (valorRam > valorLimiteCRam) {
            pontosRam = 2; // Crítico
          } else if (valorRam > valorLimiteARam) {
            pontosRam = 1; // Atenção
          }

          // DISCO - mesma lógica
          if (valorDisco > valorLimiteCDisco) {
            pontosDisco = 2; // Crítico
          } else if (valorDisco > valorLimiteADisco) {
            pontosDisco = 1; // Atenção
          }

          pontosMaquina = pontosCpu + pontosRam + pontosDisco
          
          console.log(`Servidor ${servidor.CPU.idMaquina}:`);
          console.log(`  CPU: ${valorCpu}% (limite A: ${valorLimiteACpu}%, C: ${valorLimiteCCpu}%) = ${pontosCpu} pontos`);
          console.log(`  RAM: ${valorRam}% (limite A: ${valorLimiteARam}%, C: ${valorLimiteCRam}%) = ${pontosRam} pontos`);
          console.log(`  Disco: ${valorDisco}% (limite A: ${valorLimiteADisco}%, C: ${valorLimiteCDisco}%) = ${pontosDisco} pontos`);
          console.log(`  Total: ${pontosMaquina} pontos`);

          let estadoMaquina = ""

          if (pontosMaquina >= 4) {
            estadoMaquina = "Critico"
            adicionarServidor(servidor, estadoMaquina, pontosMaquina);
          } else if (pontosMaquina >= 1) {
            estadoMaquina = "Atenção"
            adicionarServidor(servidor, estadoMaquina, pontosMaquina);
          }
          
          console.log(`Estado: ${estadoMaquina}`);
          console.log('---');
        })
      });

      console.log('Array dadosTempoRealFiltrados final:', dadosTempoRealFiltrados);
      ordenarServidoresPorPontos()
      renderTabela()
    })
    .catch((err) => {
      console.error("Erro ao carregar servidores:", err)
    })
}

function adicionarServidor(servidor, estadoMaquina, pontosMaquina) {
  // Procura se já existe um servidor com o mesmo idMaquina
  const indiceExistente = dadosTempoRealFiltrados.findIndex(item => 
    item[0].CPU.idMaquina === servidor.CPU.idMaquina
  );

  if (indiceExistente !== -1) {
    // Se existe, atualiza o servidor existente
    dadosTempoRealFiltrados[indiceExistente] = [servidor, { "estadoMaquina": estadoMaquina, "pontosMaquina": pontosMaquina }];
    console.log(`Servidor ${servidor.CPU.idMaquina} atualizado no array filtrados`);
  } else {
    // Se não existe, adiciona um novo
    dadosTempoRealFiltrados.push([servidor, { "estadoMaquina": estadoMaquina, "pontosMaquina": pontosMaquina  }]);
    console.log(`Servidor ${servidor.CPU.idMaquina} adicionado ao array filtrados`);
  }
  
  // console.log('Array dadosTempoRealFiltrados atual:');
  // console.log(dadosTempoRealFiltrados);
}

function ordenarServidoresPorPontos() {
  dadosTempoRealFiltrados.sort((a, b) => {
    // a[1] e b[1] são os objetos de estado que contêm pontosMaquina
    const pontosA = a[1].pontosMaquina;
    const pontosB = b[1].pontosMaquina;
    
    // Ordenação decrescente (maior para menor)
    return pontosB - pontosA;
  });
  
  console.log('Array ordenado por pontos (maior para menor):');
  console.log(dadosTempoRealFiltrados);
}



function renderTabela() {
  console.log('Estou no renderTabela')
  
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
                        <th>Estado</th>
                        <th>Pontos</th>
                        <th>Visualizar</th>
                    </tr>
                    </thead>`

  dadosTempoRealFiltrados.forEach((dados) => {
    // Acesse diretamente os índices específicos
    const servidor = dados[0];        // O servidor está sempre no índice 0
    const estado = dados[1];          // O estado está sempre no índice 1
    
    // Verifique se servidor existe e tem as propriedades necessárias
    if (servidor && servidor.CPU && servidor.CPU.idMaquina) {
      const tr = document.createElement("tr")
      tr.id = `servidor-${servidor.CPU.idMaquina}`
      
      // Adiciona a classe CSS baseada no estado da máquina
      if (estado.estadoMaquina === "Critico") {
        tr.classList.add("critico");
      } else if (estado.estadoMaquina === "Atenção") {
        tr.classList.add("atencao");
      }
      
      tr.innerHTML = `
        <td data-label="ID">${servidor.CPU.idMaquina}</td>
        <td data-label="Servidor">SV${servidor.CPU.idMaquina}</td>
        <td data-label="CPU (%)">${servidor.CPU.valor}%</td>
        <td data-label="RAM">${servidor.RAM.valor}%</td>
        <td data-label="Disco">${servidor.DISCO.valor}%</td>
        <td data-label="Download">${servidor.RedeRecebida.valor} MB/s</td>
        <td data-label="Upload">${servidor.RedeEnviada.valor} MB/s</td>
        <td data-label="Estado">${estado.estadoMaquina}</td>
        <td data-label="Pontos">${estado.pontosMaquina}</td>
        <td data-label="Visualizar"><i class='fa fa-eye servidores' data-id="${servidor.CPU.idMaquina}"></i></td>
      `
      tabela.appendChild(tr)

      const btnServidor = tr.querySelector(".servidores")
      btnServidor.addEventListener("click", () => {
        const idServidor = btnServidor.getAttribute("data-id")
        sessionStorage.setItem("idServidorSelecionado", idServidor)
        console.log("Clicou no botão")
        setTimeout(() => {
          window.location.href = "../../dashMonitoramento-vitor-especifico.html"
        }, 2000)
      })
    } else {
      console.warn("Servidor inválido encontrado:", dados);
    }
  })
}

function renderKpis() {
  const idFabrica = sessionStorage.getItem("FABRICA_ID")

  let totalServidor = document.getElementById("qtdTotalServidores")

  // fetch(`/dashMonitoramento/qtdServidoresPorFabrica/${idFabrica}`, {
  //   method: "GET",
  // })
  //   .then((res) => res.json())
  //   .then((dados) => {
  //     totalServidor.textContent = dados[0].qtdServidores
  //     // console.log(`QtdServidoresMonitorados: ${dados[0].qtdServidores}`)
  //   })

  // Percorrer dadosTempoRealFiltrados para contar servidores por estado
  let qtdServidoresCritico = 0;
  let qtdServidoresAtencao = 0;

  dadosTempoRealFiltrados.forEach((dados) => {
    const estado = dados[1]; // O objeto de estado está no índice 1
    console.log('estou no forEach de renderKpis')
    
    if (estado.estadoMaquina.includes('C')) {
      qtdServidoresCritico++;
    } else if (estado.estadoMaquina.includes('A')) {
      qtdServidoresAtencao++;
    }
  });
  let totalServidoresMonitorados = qtdServidoresAtencao + qtdServidoresCritico
  console.log(`Quantidade de servidores críticos: ${qtdServidoresCritico}`);
  console.log(`Quantidade de servidores em atenção: ${qtdServidoresAtencao}`);
  console.log(`Total de serviores monitorados ${totalServidoresMonitorados}`)

  let elementoCritico = document.getElementById("qtdServidoresCritico");
  let elementoAtencao = document.getElementById("qtdServidoresAtencao");
  
  if (elementoCritico) elementoCritico.textContent = qtdServidoresCritico;
  if (elementoAtencao) elementoAtencao.textContent = qtdServidoresAtencao;
    totalServidor.textContent = totalServidoresMonitorados

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
