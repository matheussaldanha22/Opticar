let alertaFabrica = [];
var fabricaCriticaLista = [];

function verificaAlertas() {
    fetch("/fabricas/verificaAlertas", {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
  }).then(function (resposta) {
      if (resposta.ok) {
          resposta.json().then((json) => {
            alertaFabrica = json;
        });
        listarFabricas()
      }
    })
    .catch(function (error) {
      console.error("Erro ao realizar fetch:", error);
    });
}

function cadastrarFabrica() {
    var nomeVar = iptNomeFabrica.value
    var funcaoVar = iptFuncaoFabrica.value
    var limiteAVar = iptLimiteAtencao.value
    var limiteGVar = iptLimiteGrave.value


    if (nomeVar == '' || !funcaoVar || !limiteAVar || !limiteGVar) {
        Swal.fire('Erro!', 'Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }

    fetch("/fabricas/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        nomeServer: nomeVar,
        funcaoServer: funcaoVar,
        limiteAServer: limiteAVar,
        limiteGServer: limiteGVar
      }),
      })
        .then(async function (resposta) {
          console.log("resposta: ", resposta);
          var mensagem = await resposta.text();
          if (resposta.ok) {
            listarFabricas()
            Swal.fire('Sucesso!', 'Fábrica cadastrada com sucesso!', 'success');
          } else if (mensagem.includes("Duplicate entry")) {
            Swal.fire('Erro!', 'Fábrica já cadastrada', 'error');
          } else {
            Swal.fire('Erro!', 'Falha ao cadastrar a Fábrica.', 'error');
          }
        })
        .catch(function (erro) {
          console.error("Erro ao enviar dados:", erro);
        });
        return false;
}

function listarFabricas() {
  const idEmpresa = sessionStorage.EMPRESA;

  fetch(`/fabricas/listarFabricasEmpresa/${idEmpresa}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => res.json())
    .then(fabricas => {
      const tabela = document.querySelector(".fabricaContainer table");
      tabela.innerHTML = `
        <thead class="tituloTabela">
          <tr>
            <th>ID Fábrica</th>
            <th>Nome</th>
            <th>Limite Atenção</th>
            <th>Limite Crítico</th>
            <th>Status/Parâmetro</th>
            <th>Gestor</th>
            <th>Ações</th>
            <th>Visualizar</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const corpoTabela = tabela.querySelector("tbody");
      const fabricaCriticaLista = [];

      for (let i = 0; i < fabricas.length; i++) {
        const fabrica = fabricas[i];

        for (let j = 0; j < alertaFabrica.length; j++) {
          const alerta = alertaFabrica[j];

          if (alerta.fkFabrica === fabrica.idfabrica) {
            const quantidade = alerta.qtd_to_do + alerta.qtd_in_progress;
            let estado, nivelCriticidade;

            if (quantidade >= fabrica.limiteCritico) {
              estado = "critico";
              nivelCriticidade = quantidade - fabrica.limiteCritico;
            } else if (quantidade >= fabrica.limiteAtencao) {
              estado = "atencao";
              nivelCriticidade = quantidade - fabrica.limiteAtencao;
            } else {
              estado = "ok";
              nivelCriticidade = 0;
            }

            fabricaCriticaLista.push({
              nome: fabrica.nome,
              gestor: fabrica.nome,
              atencao: fabrica.limiteAtencao,
              critico: fabrica.limiteCritico,
              telefone: fabrica.telefone,
              id: fabrica.idfabrica,
              qtd_to_do: alerta.qtd_to_do,
              qtd_in_progress: alerta.qtd_in_progress,
              quantidade,
              estado,
              nivelCriticidade
            });
            break;
          }
        }
      }

      fabricaCriticaLista.sort((a, b) => b.nivelCriticidade - a.nivelCriticidade);

      fabricaCriticaLista.forEach(fabrica => {
        const linha = document.createElement("tr");
        linha.classList.add("cor");

        let statusHTML = "";
        if (fabrica.estado === "ok") {
          statusHTML = `<td data-label="Status/Parâmetro" class="ok">Ok <i class='bx bx-check-circle ok'></i></td>`;
        } else if (fabrica.estado === "atencao") {
          statusHTML = `<td data-label="Status/Parâmetro" class="atencao">Atenção <i class='bx bx-error-circle atencao'></i></td>`;
        } else {
          statusHTML = `<td data-label="Status/Parâmetro" class="critico">Crítico <i class='bx bx-error critico'></i></td>`;
        }

        linha.innerHTML = `
          <td data-label="ID Fábrica">${fabrica.id}</td>
          <td data-label="Nome">${fabrica.nome}</td>
          <td data-label="Limite Grave">${fabrica.critico}</td>
          <td data-label="Limite Atenção">${fabrica.atencao}</td>
          ${statusHTML}
          <td data-label="Gestor">${fabrica.gestor}</td>
          <td data-label="Ações">
            <button class="btn-editar" data-id="${fabrica.id}"><i class='bx bx-edit'></i></button>
            <button class="btn-purple excluir" data-id="${fabrica.id}"><i class='bx bxs-trash'></i></button>
          </td>
          <td data-label="Visualizar">
            <button class="btn-visualizar" data-id="${fabrica.id}"><i class='fa fa-eye'></i></button>
          </td>
        `;

        corpoTabela.appendChild(linha);

        const botaoEditar = linha.querySelector(".btn-editar");
        const botaoExcluir = linha.querySelector(".btn-purple");
        const botaoVisualizar = linha.querySelector(".btn-visualizar");

        botaoEditar.addEventListener("click", () => {
          abrirModal(botaoEditar);
        });

        botaoExcluir.addEventListener("click", () => {
          Swal.fire({
            title: "Tem certeza?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, excluir!"
          }).then((result) => {
            if (result.isConfirmed) {
              excluirFabrica(botaoExcluir);
            }
          });
        });

        botaoVisualizar.addEventListener("click", () => {
          abiriModalVisu(botaoVisualizar);
        });
      });
    })
    .catch(erro => {
      console.error("Erro ao buscar fábrias:", erro);
    });
}


function excluirFabrica(botaoExcluir) {
    var idVar = botaoExcluir.getAttribute("data-id");

    fetch("/fabricas/excluirFabrica", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idServer: idVar,
          }),
      })
        .then(function (resposta) {
          if (resposta.ok) {
            excluirFabricaFrio(idVar)
            listarFabricas()
            Swal.fire('Excluído', 'Fábrica excluída com sucesso', 'success')
          } else {
            Swal.fire('Erro', 'Fábrica não foi excluída com sucesso', 'error')
          }
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
        });     
}

function excluirFabricaFrio(idVar) {
  fetch("/fabricas/excluirFabricaFrio", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        idServer: idVar,
      }),
  })
    .then(function (resposta) {
      if (resposta.ok) {
        listarFabricas()
      } else {
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });     
}

function abrirModal(botaoEditar) {
  var idVar = botaoEditar.getAttribute("data-id");

  fetch("/fabricas/modalUpdate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ idServer: idVar }),
  })
  .then(resposta => {
    if (!resposta.ok) throw new Error("Erro na resposta da API");
    return resposta.json();
  })
  .then(dados => {
    const fabrica = dados[0]; 
    Swal.fire({
      html: `
            <div class="modal-test">
                <div class="containerCadastroFrabic">
                    <h3>Cadastrar Fábrica</h3>
                    <label>Nome Fábrica: <input id="iptNomeFabrica" value="${fabrica.nome}"></label>
                    <label>Função: <input id="iptFuncaoFabrica" value="${fabrica.funcao}"></label>
                    <label>Limite atenção: <input id="iptLimiteAtencao" value="${fabrica.limiteAtencao}"></label>
                    <label>Limite grave: <input id="iptLimiteGrave" value="${fabrica.limiteCritico}"></label>
                </div>
            </div>
      `,
      showCancelButton: true,
      cancelButtonText: "Fechar",
      background: '#fff',
      confirmButtonColor: '#2C3E50',
      confirmButtonText: "Salvar",
      customClass: 'addModal'
    }).then((result) => {
      if (result.isConfirmed) {
        updateFabrica(idVar);
      }
    });

    listarFabricas(); // Cuidado: isso recarrega antes da edição. Talvez mover para depois do update.
  })
  .catch(function (error) {
    console.error("Erro ao realizar fetch:", error);
  });
}

function abiriModalVisu(botaoVisu) {
  var idVar = botaoVisu.getAttribute('data-id');

  fetch(`/fabricas/infoFabrica/${idVar}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then(function (resposta) {
    if (!resposta.ok) {
      console.log(resposta);
      throw new Error(`Erro na resposta infoFabrica: ${resposta.status}`);
    }
    return resposta.json();
  }).then(function (informacao) {
    return fetch(`/jira/listarAlertasPorId/${idVar}`, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    }).then(resposta => {
      if (resposta.ok) {
        console.log(resposta);
        return resposta.json();
      }
      throw new Error("Erro ao buscar tempo resolução Jira");
    }).then(dadosJira => {
      return fetch(`/fabricas/verificarAlertasPorId/${idVar}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      }).then(resposta => {
        if (resposta.ok) {
          console.log(resposta);
          return resposta.json();
        }
        throw new Error("Erro ao buscar tempo de resolução");
      }).then(alertas => {
        return fetch(`/admin/mtbf/${idVar}`, {
          method: "GET",
          headers: {"Content-Type": "application/json"}
        }).then(resposta => {
          if (resposta.ok) {
            return resposta.json();
          }
          throw new Error("Erro ao buscar dados MTBF");
        }).then(dadosMtbf => {

          var mtbf = 0;
          var estado;
          if (dadosMtbf[0].minutos_operacao && dadosMtbf[0].qtd_alertas > 0) {
            mtbf = dadosMtbf[0].minutos_operacao / dadosMtbf[0].qtd_alertas;
          }
          var tempoMedio = dadosJira.tempoMedioResolucao
          var tempoResolucao;
          if(dadosJira.tempoMedioResolucao >= 1440) {
            if(tempoMedio > mtbf) {
              estado = 'critico'
            } else {
              estado = 'ok'
            }
            tempoResolucao = `${(tempoMedio / 1440).toFixed(0)}(d)`
          } else if (dadosJira.tempoMedioResolucao >= 60) {
            if (tempoMedio > mtbf) {
              estado = 'critico'
            } else {
              estado = 'ok'
            }
            tempoResolucao = `${(tempoMedio / 60).toFixed(0)}(h)`
          } else {
            if (tempoMedio > mtbf) {
              estado = 'critico'
            } else {
              estado = 'ok'
            }
            tempoResolucao = `${(tempoMedio).toFixed(0)}(m)`
          }

          var nome = informacao[0].nomeFabrica
          var gestor = informacao[0].nomeGestorFabrica
          var telefone = informacao[0].telefone
          var status = estado
          var qtdAlertasAberto = alertas[0].qtd_to_do
          var qtdAlertasAndamento = alertas[0].qtd_done

      
          Swal.fire({
          html: `
                <div class="modal-test">
                    <div class="containerCadastroFrabic">
                        <h3>Informações Fábrica</h3>
                        <label>Nome Fábrica: ${nome} </label>
                        <label>Gestor: ${gestor}</label>
                        <label>Telefone: ${telefone} </label>
                        <label>Status: ${status}</label>
                        <label>Alertas em aberto: ${qtdAlertasAberto}</label>
                        <label>Alertas em andamento: ${qtdAlertasAndamento}</label>
                        <label>Tempo resolução: ${tempoResolucao}</label>
                    </div>
                </div>
          `,
          showCancelButton: true,
          cancelButtonText: "Fechar",
          background: '#fff',
          customClass: 'addModal'
          })
        });
      });
    });
  }).catch(error => {
    console.error("Erro:", error);
  });
}  

function updateFabrica(idVar) {
  var nomeVar = iptNomeFabrica.value
  var funcaoVar = iptFuncaoFabrica.value
  var limiteAVar = Number(iptLimiteAtencao.value)
  var limiteGVar = Number(iptLimiteGrave.value)


  if (nomeVar == '' || !funcaoVar || !limiteAVar || !limiteGVar) {
      Swal.fire('Erro!', 'Por favor, preencha todos os campos corretamente.', 'error');
      return;
  }

  fetch("/fabricas/updateFabrica", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      idServer: idVar,
      nomeServer: nomeVar,
      funcaoServer: funcaoVar,
      limiteAServer: limiteAVar,
      limiteGServer: limiteGVar
    }),
    })
      .then(async function (resposta) {
        console.log("resposta: ", resposta);
        var mensagem = await resposta.text();
        if (resposta.ok) {
          listarFabricas()
          Swal.fire('Sucesso!', 'Fábrica editada com sucesso!', 'success');
        } else {
          Swal.fire('Erro!', 'Falha ao editar a Fábrica.', 'error');
        }
      })
      .catch(function (erro) {
        console.error("Erro ao enviar dados:", erro);
      });
      return false;
}