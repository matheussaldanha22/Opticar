function listarTipo() {
    fetch("/componentes/listarTipo", {
        method: "GET",
    })
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error(`Erro na resposta: ${resposta.status}`);
        }
        return resposta.json();
    })
    .then(function (componentes) {
        var tipoElement = document.getElementById("sltTipo");
        tipoElement.innerHTML = "";
        tipoElement.innerHTML = `<option value="#" selected>Selecione o Componente</option>`
        if (componentes.length > 0) {
            componentes.forEach((tipo) => {
                var option = document.createElement("option");
                option.textContent = tipo.tipo;
                tipoElement.appendChild(option);
            });
            console.log("Tipos cadastrados com sucesso");
        } else {
            var option = document.createElement("option");
            option.value = "";
            option.textContent = "Nenhum componente disponível";
            tipoElement.appendChild(option);
        }
    })
    .catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}


function listarMedida() {
    var tipoSelecionadoVar = sltTipo.value;

    fetch("/componentes/listarMedida", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        tipoSelecionadoServer: tipoSelecionadoVar,
      }),
    })
    .then(function (resposta) {
        return resposta.json();
    }).then(function (componentes) {
        var medidaElement = document.getElementById("sltMedida");
        medidaElement.innerHTML = "";
        medidaElement.innerHTML = `<option value="#" selected>Selecione a Medida</option>`;
        if (componentes.length > 0) {
            componentes.forEach((tipo) => {
              if (tipoSelecionadoVar == "Cpu" && tipo.medida == "Porcentagem") {
                return
              } else if (tipoSelecionadoVar == "Ram" && tipo.medida == "Porcentagem") {
                return
              } else if (tipoSelecionadoVar == "Disco" && tipo.medida == "Porcentagem") {
                return
              } else if (tipoSelecionadoVar == "Rede" && tipo.medida == "Upload" || tipo.medida == "Download") {
                return
              } else {
                var option = document.createElement("option");
                option.textContent = tipo.medida;
                medidaElement.appendChild(option);
              }
            });
            console.log("Tipos cadastrados com sucesso");
        } else {
            var option = document.createElement("option");
            option.value = "";
            option.textContent = "Nenhum componente disponível";
            medidaElement.appendChild(option);
        }
    })
    .catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
    });
}

function verificaPedido() {
    console.log("entrei no verifica")
    var codigoPedido = [];
    var tipoVar = sltTipo.value
    var medidaVar = sltMedida.value
    if (tipoVar === "#" || medidaVar === "#") {
        Swal.fire('Erro!', 'Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }

    fetch("/componentes/verificar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tipoServer: tipoVar,
            medidaServer: medidaVar
          }),
      })
        .then(function (resposta) {
          resposta.json().then((codigos) => {
            codigos.forEach((codigo) => {
                codigoPedido.push(codigo.idcomponente);
                console.log(codigoPedido)
                cadastrarPedido(codigoPedido);
            });
          });
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
        });
}

function cadastrarPedido(codigoPedido) {
    var codigoVar = codigoPedido[0]
    var idMaquinaVar = sessionStorage.idMaquinaSelecionada
    var modeloVar = iptModelo.value
    var limiteAVar = iptLimiteAtencao.value
    var limiteGVar = iptLimiteGrave.value

    console.log(codigoVar)

    if (codigoVar == '' || !modeloVar || !limiteAVar || !limiteGVar) {
        Swal.fire('Erro!', 'Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }

    fetch("/componentes/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        idMaquinaServer: idMaquinaVar,
        codigoServer: codigoVar,
        modeloServer: modeloVar,
        limiteAServer: limiteAVar,
        limiteGServer: limiteGVar
      }),
      })
        .then(async function (resposta) {
          console.log("resposta: ", resposta);
          var mensagem = await resposta.text();
          if (resposta.ok) {
            listarComponente()
            cadastrarPedidoFrio(codigoPedido)
            Swal.fire('Sucesso!', 'Componente cadastrado com sucesso!', 'success');
          } else if (mensagem.includes("Duplicate entry")) {
            Swal.fire('Erro!', 'Componente já cadastrado para essa máquina!', 'error');
          } else {
            Swal.fire('Erro!', 'Falha ao cadastrar o componente.', 'error');
          }
        })
        .catch(function (erro) {
          console.error("Erro ao enviar dados:", erro);
        });
        return false;
}

function cadastrarPedidoFrio(codigoPedido) {
    var idMaquinaVar = sessionStorage.idMaquinaSelecionada
    var codigoVar = codigoPedido[0]
    var modeloVar = iptModelo.value
    var limiteAVar = iptLimiteAtencao.value
    var limiteGVar = iptLimiteGrave.value

    console.log(codigoVar)

    if (codigoVar == '' || !modeloVar || !limiteAVar || !limiteGVar) {
        Swal.fire('Erro!', 'Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }

    fetch("/componentes/cadastrarFrio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        idMaquinaServer: idMaquinaVar,
        codigoServer : codigoVar,
        modeloServer: modeloVar,
        limiteAServer: limiteAVar,
        limiteGServer: limiteGVar
      }),
      })
        .then(async function (resposta) {
          console.log("resposta: ", resposta);
          var mensagem = await resposta.text();
          if (resposta.ok) {
            Swal.fire('Sucesso!', 'Componente cadastrado com sucesso!', 'success');
          } else if (mensagem.includes("Duplicate entry")) {
            Swal.fire('Erro!', 'Componente já cadastrado para essa máquina!', 'error');
          } else {
            Swal.fire('Erro!', 'Falha ao cadastrar o componente.', 'error');
          }
        })
        .catch(function (erro) {
          console.error("Erro ao enviar dados:", erro);
        });
        return false;
}

function listarComponente() {
    var codigoMaquina = document.querySelector("#codigoMaquina");
    var idMaquinaVar = sessionStorage.idMaquinaSelecionada
    codigoMaquina.innerHTML = `SV00${idMaquinaVar}`
    fetch("/componentes/listarComponentes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idMaquinaServer: idMaquinaVar
        }),
        }).then(resposta => resposta.json())
          .then(componentes => {
            const tabela = document.querySelector(".componentesContainer table");
            tabela.innerHTML = "";
            tabela.innerHTML = `
                              <thead class ="tituloTabela">    
                                <tr>
                                    <th>ID Componente</th>
                                    <th>Tipo do componente</th>
                                    <th>Tipo de medida</th>
                                    <th>Indicador</th>
                                    <th>Modelo</th>
                                    <th>Limite grave</th>
                                    <th>Limite atenção</th>
                                    <th>Ações</th>
                                </tr>
                              </thead>`;

            componentes.forEach(componente => {
              if ((componente.tipo == "Cpu" || componente.tipo == "Ram" || componente.tipo == "Disco" || componente.tipo == "Rede")
                 && (componente.medida == "Porcentagem" || componente.medida == "Upload" || componente.medida == "Download")) {
                const linha = document.createElement("tr");
                linha.innerHTML = ""; 
                linha.innerHTML += `
                    <tbody>
                      <td data-label = "ID Componente">${componente.idcomponenteServidor}</td>
                      <td data-label = "Tipo componente">${componente.tipo}</td>
                      <td data-label = "Tipo de medida">${componente.medida}</td>
                      <td data-label = "Indicador">${componente.indicador}</td>
                      <td data-label = "Modelo">${componente.modelo}</td>
                      <td data-label = "Limite Grave">${componente.limiteCritico}</td>
                      <td data-label = "Limite atenção">${componente.limiteAtencao}</td>
                      <td data-label = "Editar"><button class="btn-editar" data-id="${componente.idcomponenteServidor}"><i class='bx bx-edit'></i></button></td>
                    </tbody>
                `;
                tabela.appendChild(linha);

                const botaoEditar = linha.querySelector(".btn-editar")
                botaoEditar.addEventListener("click", () => {
                  modalEditar(botaoEditar)
                })
                } else {
                  const linha = document.createElement("tr");
                linha.innerHTML = ""; 
                linha.innerHTML += `
                    <tbody>
                      <td data-label = "ID Componente">${componente.idcomponenteServidor}</td>
                      <td data-label = "Tipo componente">${componente.tipo}</td>
                      <td data-label = "Tipo de medida">${componente.medida}</td>
                      <td data-label = "Indicador">${componente.indicador}</td>
                      <td data-label = "Modelo">${componente.modelo}</td>
                      <td data-label = "Limite Grave">${componente.limiteCritico}</td>
                      <td data-label = "Limite atenção">${componente.limiteAtencao}</td>
                      <td data-label = "Ações"><button class="btn-purple" data-id="${componente.idcomponenteServidor}"><i class='bx bxs-trash'></i></button>
                      <button class="btn-editar" data-id="${componente.idcomponenteServidor}"><i class='bx bx-edit'></i></button></td>
                    </tbody>
                `;
                tabela.appendChild(linha);

                const botaoExcluir = linha.querySelector(".btn-purple");

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
                            excluirComponente(botaoExcluir);
                        }
                    });
                });

                const botaoEditar = linha.querySelector(".btn-editar")
                botaoEditar.addEventListener("click", () => {
                  modalEditar(botaoEditar)
                })
              }
            });
    }).catch(erro => {
        console.error("Erro ao buscar componentes:", erro);
    });
}

function excluirComponente(botaoExcluir) {
    var idVar = botaoExcluir.getAttribute("data-id");

    fetch("/componentes/excluirComponente", {
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
            excluirComponenteFrio(idVar)
            listarComponente()
            Swal.fire('Excluído', 'Componente excluído com sucesso', 'success')
          } else {
            Swal.fire('Erro', 'Componente não foi excluído com sucesso', 'error')
          }
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
        });     
}

function excluirComponenteFrio(idVar) {
  fetch("/componentes/excluirComponenteFrio", {
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
          listarComponente()
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });     
}

function verificaIdMaquina() {
  var idMaquinaVar = sessionStorage.idMaquinaSelecionada
  console.log(idMaquinaVar)
  if (idMaquinaVar == undefined) {
    window.location.href = "/listadeservidores.html";
  }
}

function modalEditar(botaoEditar) {
  var idVar = botaoEditar.getAttribute("data-id");

  fetch("/componentes/modalUpdate", {
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
    const componente = dados[0]; 
    Swal.fire({
      html: `
            <div class="modal-test">
                <div class="containerCadastroComp">
                    <h3>Editar Pedido</h3>
                    <label>Componente: ${componente.tipo}</label>
                    <label>Medida: ${componente.medida}</label>
                    <label>Modelo: <input id="iptModelo" value="${componente.modelo}"></label>
                    <label>Limite critico: <input id="iptLimiteC" value="${componente.limiteCritico}"></label>
                    <label>Limite atenção: <input id="iptLimiteAtencao" value="${componente.limiteAtencao}"></label>
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
        updatePedido(idVar);
        listarComponente()
      }
    });
    listarComponente();
  })
  .catch(function (error) {
    console.error("Erro ao realizar fetch:", error);
  });
}

function updatePedido(idVar) {
  var modelo = iptModelo.value;
  var limiteC = iptLimiteC.value;
  var limiteA = iptLimiteAtencao.value;

  if (modelo == '' || !limiteC || !limiteA) {
    Swal.fire('Erro!', 'Por favor, preencha todos os campos corretamente.', 'error');
    return;
  }

  fetch("/componentes/updatePedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      idServer: idVar,
      modeloServer: modelo,
      limiteCServer: limiteC,
      limiteAServer: limiteA,
    }),
    })
      .then(async function (resposta) {
        console.log("resposta: ", resposta);
        if (resposta.ok) {
          listarFabricas()
          Swal.fire('Sucesso!', 'Pedido editado com sucesso!', 'success');
        } else {
          Swal.fire('Erro!', 'Falha ao editar o Pedido.', 'error');
        }
      })
      .catch(function (erro) {
        console.error("Erro ao enviar dados:", erro);
      });
      return false;
}