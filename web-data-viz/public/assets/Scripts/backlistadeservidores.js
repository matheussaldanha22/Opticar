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




function carregarServidores() {
    fetch("/listadeservidores/carregarServidores", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resposta => resposta.json())
      .then(servidores => {
        listadeservidores = [];
        listadeservidores.push(servidores);
        
        

        const tabela = document.querySelector(".componentesContainer table");
        tabela.innerHTML = "";
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
                <td>${servidor.componentes}<button class='bx bx-plus' style="cursor:pointer; background:linear-gradient(270deg, #012027, #04708D); border-radius:10px; margin-left: 8px;">
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
        });
    }).catch(erro => {
        console.error("Erro ao buscar servidor:", erro);
    });
}




  