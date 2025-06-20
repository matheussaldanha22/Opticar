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
                    <td data-label = "Servidor">SV${servidor.idMaquina}</td>
                    <td data-label = "Componente(s)">${servidor.componentes}<button class='bx bx-plus' data-id="${servidor.idMaquina}" style="cursor:pointer; background:linear-gradient(270deg,rgb(0, 114, 140), #04708D); color: #fff; border-radius:10px; margin-left: 8px; border: 1px solid #eee;">
                    </button></td>
                    <td data-label = "IP">${servidor.ip}</td>
                    <button class="btn-purple" data-id="${servidor.idMaquina}"><i class='bx bxs-trash'></i></button></td>
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



  