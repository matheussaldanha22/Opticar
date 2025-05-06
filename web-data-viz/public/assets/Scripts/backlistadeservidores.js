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
        tabela.innerHTML = `<tr>
                              <th>Servidor</th>
                              <th>Componente(s)</th>
                              <th>IP</th>
                              <th>Visualizar</th>
                              <th></th>
                           </tr>`;

        servidores.forEach(servidor => {
            const linha = document.createElement("tr");
            linha.innerHTML = ""; 
            linha.innerHTML += `
                <th>SV00${servidor.idMaquina}</th>
                <td>${servidor.componentes}<button class='bx bx-plus' data-id="${servidor.idMaquina}" style="cursor:pointer; background:linear-gradient(270deg, #012027, #04708D); border-radius:10px; margin-left: 8px;">
            </button></td>
                <td>${servidor.ip}</td>
                <td><button class="btn-purple" data-id="${servidor.idMaquina}">Excluir</button></td>
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




  