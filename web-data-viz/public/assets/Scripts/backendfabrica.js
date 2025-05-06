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
                                  <tr class="tituloTabela">
                                    <th>ID Fábrica</th>
                                    <th>Nome</th>
                                    <th>Status/Parâmetro</th>
                                    <th>Gestor</th>
                                    <th>Ações</th>
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
                            <td>${fabrica.idFabrica}</td>
                            <td>${fabrica.nomeFabrica}</td>
                            <td class="ok">Ok <i class='bx bx-check-circle ok'></i></td>
                            <td>${fabrica.nomeGestorFabrica}</td>
                            <td><button class="btn-editar" data-id="${fabrica.idFabrica}">Editar</button>
                                <button class="btn-purple excluir" data-id="${fabrica.idFabrica}">Excluir</button>
                            </td>
                          </tbody>`;
                  } else if (alerta.quantidade_alertas >= fabrica.limiteAtencao && alerta.quantidade_alertas < fabrica.limiteCritico) {
                      linha.innerHTML += `
                          <tbody>
                            <td>${fabrica.idFabrica}</td>
                            <td>${fabrica.nomeFabrica}</td>
                            <td class="atencao">Atenção <i class='bx bx-error-circle atencao'></i></td>
                            <td>${fabrica.nomeGestorFabrica}</td>
                            <td><button class="btn-editar" data-id="${fabrica.idFabrica}">Editar</button>
                                <button class="btn-purple excluir" data-id="${fabrica.idFabrica}">Excluir</button>
                            </td>
                          </tbody>`;
                  } else {
                      linha.innerHTML += `
                          <tbody>
                            <td>${fabrica.idFabrica}</td>
                            <td>${fabrica.nomeFabrica}</td>
                            <td class="critico">Crítico <i class='bx bx-error critico'></i></td>
                            <td>${fabrica.nomeGestorFabrica}</td>
                            <td><button class="btn-editar" data-id="${fabrica.idFabrica}">Editar</button>
                                <button class="btn-purple excluir" data-id="${fabrica.idFabrica}">Excluir</button>
                            </td>
                          </tbody>`;
                  } 
                } else {
                  linha.innerHTML += `
                      <tbody>
                        <td>${fabrica.idFabrica}</td>
                        <td>${fabrica.nomeFabrica}</td>
                        <td class="ok">Ok <i class='bx bx-check-circle ok'></i></td>
                        <td>${fabrica.nomeGestorFabrica}</td>
                        <td><button class="btn-editar" data-id="${fabrica.idFabrica}">Editar</button>
                            <button class="btn-purple excluir" data-id="${fabrica.idFabrica}">Excluir</button>
                        </td>
                      </tbody>`;
                }
  
                tabela.appendChild(linha);

                const botaoExcluir = linha.querySelector(".btn-purple");
                const botaoEditar = linha.querySelector(".btn-editar");

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
        <div style="display: flex;flex-direction:column; align-items: center;border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); height:5vw;background-color:rgb(235, 234, 234);padding:5px;">
          <div style="margin-left: 15px; text-align: left;">
            <h2 style="color:black;margin: 0; font-size: 22px; font-weight: bold;">
              <i class='bx bx-add-to-queue' style="color: #646363; font-size: 30px; border: 3px solid rgb(138, 136, 136);border-radius: 5px;"></i> 
              Cadastro parâmetro fábrica
            </h2>
            <p style="margin: 4px 0 0 0; font-size: 17px;color:black">Informe o parâmetro de alerta que julgar adequado..</p>
          </div>
        </div>
        
        <div class="modal-content">
          <div class="infosCadastro">
              <p class="label">Nome fábrica:</p>
              <input class="iptsCad" id="iptNomeFabrica" value="${fabrica.nome}">
          </div>
          <div class="infosCadastro">
              <p class="label">Função:</p>
              <input class="iptsCad" id="iptFuncaoFabrica" value="${fabrica.funcao}">
          </div>
          <div class="infosCadastro">
              <p class="label">Limite atenção:</p>
              <input class="iptsCad" id="iptLimiteAtencao" value="${fabrica.limiteAtencao}">
          </div>
          <div class="infosCadastro" id="infoUltimo">
              <p class="label">Limite grave:</p>
              <input class="iptsCad" id="iptLimiteGrave" value="${fabrica.limiteCritico}">
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