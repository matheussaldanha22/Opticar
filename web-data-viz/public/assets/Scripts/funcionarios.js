const itensPorPagina = 10
let paginaAtual = 1
let listaFuncionarios = [] // Armazenamento dos dados recebidos do backend

// document.addEventListener("DOMContentLoaded", () => {
//   fetch("http://localhost:3000/alertas")
//     .then((res) => res.json())
//     .then((dados) => {
//       funcionarios = dados
//       renderTabela(paginaAtual)
//       renderPaginacao()
//     })
//     .catch((err) => {
//       console.error("Erro ao carregar alertas:", err)
//     })
// })

// function renderTabela(pagina) {
//   const tabela = document.getElementById("tabela-alertas")
//   tabela.innerHTML = ` <tr>
//                         <th>Nome</th>
//                         <th>Email</th>
//                         <th>Cargo</th>
//                         <th>Status</th>
//                         <th>Editar</th>
//                     </tr>`

//   const inicio = (pagina - 1) * itensPorPagina
//   const fim = inicio + itensPorPagina
//   const paginaDados = funcionarios.slice(inicio, fim)

//   paginaDados.forEach((funcionario) => {
//     const tr = document.createElement("tr")
//     tr.innerHTML = `
//       <td>${funcionario.nome}</td>
//       <td>${funcionario.email}</td>
//       <td>${funcionario.cargo}</td>
//       <td>${funcionario.status}</td>
//       <td><i class='bx bx-arrow-from-left btn' onclick="abrirModal(${funcionario.id})"></i></td>
//     `
//     tabela.appendChild(tr)
//   })
// }





function renderPaginacao() {
  const paginacao = document.getElementById("paginacao")
  paginacao.innerHTML = ""

  const totalPaginas = Math.ceil(alertas.length / itensPorPagina)

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button")
    btn.textContent = i
    if (i === paginaAtual) btn.classList.add("active")
    btn.addEventListener("click", () => {
      paginaAtual = i
      renderTabela(paginaAtual)
      renderPaginacao()
    })
    paginacao.appendChild(btn)
  }
}

function abrirModal(id) {
  const alerta = alertas.find((item) => item.id === id)

  if (!alerta) {
    return Swal.fire("Erro", "Alerta não encontrado", "error")
  }

  Swal.fire({
    title: `Detalhes do Alerta ${alerta.id}`,
    html: `
      <div class="modal-test">
        <div class="containerConfigAlerta">
            <h3>Configuração alerta</h3>
            <p><b>id:</b> ${alerta.id}</p>
            <p><b>Gravidade:</b> ${alerta.gravidade}</p>
            <p><b>Data:</b> ${alerta.dtAlerta}</p>
        </div>

        <div class="containerComponentes">
            <p><b>Componente: </b> ${alerta.componente}</p>
            <p><b>Servidor: </b> ${alerta.servidor}</p>
            <p><b>Métrica registrada: </b>${alerta.gravidade}</p>
            <p><b>Tipo de Métrica: </b>${alerta.tipoMetrica}</p>
            <p><b>Processos Relacionados: </b></p>  
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Fechar",
    customClass: "alertaModal",
  })
}


function abrirModalCriar() {
  Swal.fire({
    title: `Cadastrar funcionário`,
    html: `
      <div class="modal-test">
        <div class="containerCadastroFunc">
            <label>Nome <input type="text" id="inpNome"></label>
            <label>Email <input type="email" id="inpEmail"></label>
            <label>Cpf <input type="number" id="inpCpf"></label>
            <label>Cargo
              <select name="" id="sltCargo">
                   <option value="0">Selecione o cargo</option>
                   <option value="GestorFabrica">Gestor fábrica</option>
                   <option value="EngenheiroManutencao">Engenheiro de Manutenção</option>
              </select>
            </label>
            <label>Senha <input type="text" id="inpSenha"></label>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Cadastrar",
    cancelButtonText: "Fechar",
    customClass: "alertaModal",
    customClass: {
      popup: 'funcModal'
    }

  }).then((result) => {
    // Verifique se o usuário clicou no botão de "Cadastrar"
    if (result.isConfirmed) {
      const nome = document.getElementById('inpNome').value
      const email = document.getElementById('inpEmail').value
      const cpf = document.getElementById('inpCpf').value
      const cargo = document.getElementById('sltCargo').value
      const senha = document.getElementById('inpSenha').value
      const fkFabrica = sessionStorage.getItem("FABRICA_ID")

      if (nome == "" || email == "" || cpf == "" || cargo == "" || senha == "") {
        return Swal.fire("Erro", "Preencha todos os campos!", "error")
      }

      if (!fkFabrica) {
        return Swal.fire("Erro", "ID da fábrica não encontrado na sessão!", "error")
      }

      fetch(`http://localhost:3333/usuarios/cadastrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: nome,
          email: email, 
          cpf: cpf,
          cargo: cargo,
          senha: senha,
          fkFabrica: fkFabrica
        })
      })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          console.log(res.json())
          // throw new Error("Erro ao cadastrar funcionário")
        }
      }).then((res) => {
        // Se o backend retorna um objeto com sucesso
        if (res) {
          console.log("Funcionário cadastrado com sucesso!")
          Swal.fire({
            title: "Sucesso",
            text: "Funcionário cadastrado com sucesso!",
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            window.location.href = "./funcionarios.html"
          })
        } else {
          console.log("Erro ao cadastrar funcionário")
          Swal.fire({
            title: "Erro",
            text: "Erro ao cadastrar funcionário",
            icon: "error",
            confirmButtonText: "OK"
          })
        }
      })
    }
  })
}
