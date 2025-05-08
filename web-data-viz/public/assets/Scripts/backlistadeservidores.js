function excluirServidor(botao) {
    const id = botao.getAttribute("data-id");

    fetch(`/listadeservidores/excluirServidor/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (res.ok) {
            Swal.fire("Excluído!", "O servidor foi excluído com sucesso.", "success");
            excluirServidorFrio(id)
            carregarServidores(); 
        } else {
            Swal.fire("Erro!", "Erro ao excluir o servidor.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao excluir servidor:", err);
        Swal.fire("Erro!", "Erro inesperado ao excluir.", "error");
    });
}

function excluirServidorFrio(id) {
    fetch(`/listadeservidores/excluirServidorFrio/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (res.ok) {
            Swal.fire("Excluído!", "O servidor foi excluído com sucesso.", "success");
        } else {
            Swal.fire("Erro!", "Erro ao excluir o servidor.", "error");
        }
    })
    .catch(err => {
        console.error("Erro ao excluir servidor:", err);
        Swal.fire("Erro!", "Erro inesperado ao excluir.", "error");
    });
}




function carregarServidores() {
    var idFabricaVar = sessionStorage.FABRICA_ID
    fetch("/listadeservidores/carregarServidores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        idFabricaServer: idFabricaVar,
    }),
    }).then(resposta => resposta.json())
      .then(servidores => {
        listadeservidores = [];
        listadeservidores.push(servidores);
        
    
        const quantidade = servidores.length;
        sessionStorage.setItem("quantidadeServidores", quantidade);    

        const tabela = document.querySelector(".componentesContainer table");
        tabela.innerHTML = `<thead>
                                <tr>
                                    <td>Servidor</td>
                                    <td>Componente(s)</td>
                                    <td>IP</td>
                                    <td>Ações</td>
                                </tr>
                           </thead>`
                           ;

        servidores.forEach(servidor => {
            const linha = document.createElement("tr");
            linha.innerHTML = ""; 
            linha.innerHTML += `
                <tbody>
                    <td data-label = "Servidor">SV00${servidor.idMaquina}</td>
                    <td data-label = "Componente(s)">${servidor.componentes}<button class='bx bx-plus' data-id="${servidor.idMaquina}" style="cursor:pointer; background:linear-gradient(270deg, #012027, #04708D); border-radius:10px; margin-left: 8px;">
                    </button></td>
                    <td data-label = "IP">${servidor.ip}</td>
                    <td data-label = "Ações"><button class="btn-editar" data-id="${servidor.idMaquina}"><i class='bx bx-edit' ></i>
                    <button class="btn-purple" data-id="${servidor.idMaquina}"><i class='bx bxs-trash'></i></button></td>
                </tbody>
            `;
            tabela.appendChild(linha);

            botaoEditar.addEventListener("click", () => {
                abrirModal(botaoEditar)
              })

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
                        excluirServidor(botaoExcluir);
                    }
                });
            });

            const botaoComponente = linha.querySelector(".bx-plus");

botaoComponente.addEventListener("click", () => {
    const idservidorlinha = botaoComponente.getAttribute("data-id");
    sessionStorage.setItem("idMaquinaSelecionada", idservidorlinha);//salva o id do serverpra puxar la 

    window.location.href = "/componentes.html";
    
    

});



        });
    }).catch(erro => {
        console.error("Erro ao buscar servidor:", erro);
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
      const servidor = dados[0]; 
      Swal.fire({
        html: `
           <div class="modal-test">
                <div class="containerCadastroServ">
                    <h3>Cadastrar Parâmetro Servidor</h3>
                    <label>Limite Atenção: <input value="${servidor.limiteAtencao}" id="iptLimiteA" ></label>
                    <label>Limite Grave: <input value="${servidor.limiteGrave}" id="iptLimiteG" ></label>
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
          updateServidor(idVar);
        }
      });
  
      carregarServidores(); 
    })
    .catch(function (error) {
      console.error("Erro ao realizar fetch:", error);
    });
  }

function updateServidor(idVar) {
    var limiteA = Number(iptLimiteA.value)
    var limiteG = Number(iptLimiteG.value)
  
    if (limiteA == '' || limiteG ==  '') {
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
        limiteAServer: limiteA,
        limiteGServer: limiteG,
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

function cadastrarParametro() {
    var limiteAVar = iptLimiteAtencao.value
    var limiteGVar = iptLimiteGrave.value


    if (!limiteAVar || !limiteGVar) {
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



  