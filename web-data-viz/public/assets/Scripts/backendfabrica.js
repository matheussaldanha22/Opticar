let alertaFabrica = [];

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
    var idMaquinaVar = sessionStorage.idMaquinaSelecionada

    fetch("/fabricas/listarFabricas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idMaquinaServer: idMaquinaVar
        }),
        }).then(resposta => resposta.json())
          .then(fabricas => {
            const tabela = document.querySelector(".fabricaContainer table");
            tabela.innerHTML = "";
            tabela.innerHTML = `<thead class ="tituloTabela">
                                  <tr>
                                      <th>ID Fabrica</th>
                                      <th>Nome</th>
                                      <th>Limite Atenção</th>
                                      <th>Limite Crítico</th>
                                      <th>Status/Parâmetro</th>
                                      <th>Gestor</th>
                                      <th>Ações</th>
                                      <th>Vizualizar</th>
                                  </tr>
                                </thead> `;
          

            fabricas.forEach(fabrica => {
                var alerta = null;
        
                for (let i = 0; i < alertaFabrica.length; i++) {
                  if (alertaFabrica[i].fkFabrica === fabrica.idFabrica) {
                      alerta = alertaFabrica[i];
                      break;
                  }
                }

                const linha = document.createElement("tr");
                linha.classList.add("cor");
                linha.innerHTML = "";
                
                if (alerta) {
                  console.log(alerta.quantidade_alertas)
                  console.log(fabrica.limiteAtencao)
                  if (alerta.quantidade_alertas < fabrica.limiteAtencao) {
                      linha.innerHTML += `
                          <tbody>
                            <td data-label = "ID Fábrica">${fabrica.idFabrica}</td>
                            <td data-label = "Nome">${fabrica.nomeFabrica}</td>
                            <td data-label = "Limite Grave">${fabrica.limiteCritico}</td>
                            <td data-label = "Limite atenção">${fabrica.limiteAtencao}</td>
                            <td data-label = "Status/Parâmetro" class="ok">Ok <i class='bx bx-check-circle ok'></i></td>
                            <td data-label = "Gestor">${fabrica.nomeGestorFabrica}</td>
                            <td data-label = "Ações"><button class="btn-editar" data-id="${fabrica.idFabrica}"><i class='bx bx-edit' ></i></button>
                                <button class="btn-purple excluir" data-id="${fabrica.idFabrica}"><i class='bx bxs-trash'></i></button>
                                
                            </td>
                            <td data-label = "Vizualizar"><button class="btn-visualizar" data-id="${fabrica.idFabrica}"><i class='fa fa-eye'></i></button></td>
                          </tbody>`;
                  } else if (alerta.quantidade_alertas >= fabrica.limiteAtencao && alerta.quantidade_alertas < fabrica.limiteCritico) {
                      linha.innerHTML += `
                          <tbody>
                            <td data-label = "ID Fábrica">${fabrica.idFabrica}</td>
                            <td data-label = "Nome">${fabrica.nomeFabrica}</td>
                            <td data-label = "Limite Grave">${fabrica.limiteCritico}</td>
                            <td data-label = "Limite atenção">${fabrica.limiteAtencao}</td>
                            <td data-label = "Status/Parâmetro" class="atencao">Atenção <i class='bx bx-error-circle atencao'></i></td>
                            <td data-label = "Gestor">${fabrica.nomeGestorFabrica}</td>
                            <td data-label = "Ações"><button class="btn-editar" data-id="${fabrica.idFabrica}"><i class='bx bx-edit' ></i></button>
                                <button class="btn-purple excluir" data-id="${fabrica.idFabrica}"><i class='bx bxs-trash'></i></button>
                            </td>
                            <td data-label = "Vizualizar"><button class="btn-visualizar" data-id="${fabrica.idFabrica}"><i class='fa fa-eye'></i></button></td>
                          </tbody>`;
                  } else {
                      linha.innerHTML += `
                          <tbody>
                            <td data-label = "ID Fábrica">${fabrica.idFabrica}</td>
                            <td data-label = "Nome">${fabrica.nomeFabrica}</td>
                            <td data-label = "Limite Grave">${fabrica.limiteCritico}</td>
                            <td data-label = "Limite atenção">${fabrica.limiteAtencao}</td>
                            <td data-label = "Status/Parâmetro" class="critico">Crítico <i class='bx bx-error critico'></i></td>
                            <td data-label = "Gestor">${fabrica.nomeGestorFabrica}</td>
                            <td data-label = "Ações"><button class="btn-editar" data-id="${fabrica.idFabrica}"><i class='bx bx-edit' ></i></button>
                                <button class="btn-purple excluir" data-id="${fabrica.idFabrica}"><i class='bx bxs-trash'></i></button>
                            </td>
                            <td data-label = "Vizualizar"><button class="btn-visualizar" data-id="${fabrica.idFabrica}"><i class='fa fa-eye'></i></button></td>
                          </tbody>`;
                  } 
                } else {
                  linha.innerHTML += `
                      <tbody>
                        <td data-label = "ID Fábrica">${fabrica.idFabrica}</td>
                        <td data-label = "Nome">${fabrica.nomeFabrica}</td>
                        <td data-label = "Limite Grave">${fabrica.limiteCritico}</td>
                        <td data-label = "Limite atenção">${fabrica.limiteAtencao}</td>
                        <td data-label = "Status/Parâmetro" class="ok">Ok <i class='bx bx-check-circle ok'></i></td>
                        <td data-label = "Gestor">${fabrica.nomeGestorFabrica}</td>
                        <td data-label = "Ações"><button class="btn-editar" data-id="${fabrica.idFabrica}"><i class='bx bx-edit' ></i></button>
                            <button class="btn-purple excluir" data-id="${fabrica.idFabrica}"><i class='bx bxs-trash'></i></button>
                        </td>
                        <td data-label = "Vizualizar"><button class="btn-visualizar" data-id="${fabrica.idFabrica}"><i class='fa fa-eye'></i></button></td>
                      </tbody>`;
                }
  
                tabela.appendChild(linha);

                const botaoExcluir = linha.querySelector(".btn-purple");
                const botaoEditar = linha.querySelector(".btn-editar");
                const botaoVisu = linha.querySelector(".btn-visualizar");

                botaoEditar.addEventListener("click", () => {
                  abrirModal(botaoEditar)
                })

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

                botaoVisu.addEventListener("click", () => {
                  abiriModalVisu(botaoVisu);
                })
          });
    }).catch(erro => {
        console.error("Erro ao buscar componentes:", erro);
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