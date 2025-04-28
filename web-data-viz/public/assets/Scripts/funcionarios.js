const itensPorPagina = 10
let paginaAtual = 1
let listaFuncionarios = [] // Armazenamento dos dados recebidos do backend
let listaFabricas = []

document.addEventListener("DOMContentLoaded", () => {
  const cargo = sessionStorage.getItem("CARGO")

  if (cargo === "GestorEmpresa") {
    listarFuncionariosEmpresa()
  } else if (cargo === "GestorFabrica") {
    listarFuncionariosFabrica()
  }
})

function renderTabela(pagina) {
  const tabela = document.getElementById("tabela-alertas")
  tabela.innerHTML = ` <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Cargo</th>    
                        <th>Fabrica</th>    
                        <th>Editar</th>
                    </tr>`

  const inicio = (pagina - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const paginaDados = listaFuncionarios.slice(inicio, fim)

  paginaDados.forEach((funcionario) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${funcionario.idusuario}</td>
      <td>${funcionario.nome}</td>
      <td>${funcionario.email}</td>
      <td>${funcionario.cpf}</td>
      <td>${funcionario.cargo}</td>
      <td>${funcionario.nomeFabrica}</td>
      <td><i class='bx bxs-edit btn' onclick="abrirModal(${funcionario.idusuario})"></i></td>
    `
    tabela.appendChild(tr)
  })
}

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
  const funcionarios = listaFuncionarios.find((item) => item.idusuario === id)

  if (!funcionarios) {
    return Swal.fire("Erro", "Usuário não encontrado", "error")
  }

  Swal.fire({
    title: ` ${funcionarios.nome}`,
    html: `
      <div class="modal-test">
        <div class="containerCadastroFunc">
            <h3>Editar funcionário</h3>
            <label>Nome <input value="${funcionarios.nome}" id="inpNomeAtt"></label>
            <label>Email <input value="${funcionarios.email}" id="inpEmailAtt"></label>
            <label>CPF <input value="${funcionarios.cpf}" id="inpCpfAtt"></label>
            <label>Cargo
              <select name="cargo" id="sltCargo">
              </select>
            </label>
              <label id='fabricaContainer'>Fabrica
                <select name="fabrica" id="sltFabrica">
                <option value="0">Selecione a fábrica</option>
              </select>
            </label>
        </div>

      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Salvar",
    cancelButtonText: "Fechar",
    customClass: "alertaModal",
    didOpen: () => {
      const cargo = sessionStorage.getItem("CARGO")
      if (cargo === "GestorEmpresa") {
        const selectCargo = document.getElementById("sltCargo")
        const selectFabrica = document.getElementById("sltFabrica")
        selectCargo.innerHTML = `
          <option value="0">Selecione o cargo</option>
          <option value="GestorFabrica">Gestor fábrica</option>
        `
        document.querySelector(
          'select[name="cargo"]'
        ).value = `${funcionarios.cargo}`

        const idEmpresa = sessionStorage.getItem("EMPRESA")
        fetch(
          `http://localhost:3333/fabricas/listarFabricasEmpresa/${idEmpresa}`,
          { method: "GET" }
        ).then((resposta) => {
          if (resposta.ok) {
            resposta.json().then((resultado) => {
              console.log(resultado)
              resultado.forEach((fabrica) => {
                selectFabrica.innerHTML += `
                <option value="${fabrica.idfabrica}">${fabrica.nome}</option>
              `
                // console.log(`ID fabrica: ${fabrica.idfabrica}`)
                document.querySelector(
                  'select[name="fabrica"]'
                ).value = `${fabrica.idfabrica}`
              })
            })
          }
        })
      } else if (cargo === "GestorFabrica") {
        const selectCargo = document.getElementById("sltCargo")
        const selectFabrica = document.getElementById("fabricaContainer")
        selectFabrica.style.display = "none"
        selectCargo.innerHTML = `
          <option value="0">Selecione o cargo</option>
          <option value="EngenheiroManutencao">Engenheiro de Manutenção</option>
          <option value="AnalistaDados">Analista de Dados</option>
          <option value="OperadorMaquina">Operador de Máquina</option>
        `

        document.querySelector(
          'select[name="cargo"]'
        ).value = `${funcionarios.cargo}`

        // const idEmpresa = sessionStorage.getItem("EMPRESA")
        // fetch(
        //   `http://localhost:3333/fabricas/listarFabricasEmpresa/${idEmpresa}`,
        //   { method: "GET" }
        // ).then((resposta) => {
        //   if (resposta.ok) {
        //     resposta.json().then((resultado) => {
        //       console.log(resultado)
        //       resultado.forEach((fabrica) => {
        //         selectFabrica.innerHTML += `
        //         <option value="${fabrica.idfabrica}">${fabrica.nome}</option>

        //       `
        //         document.querySelector(
        //           'select[name="fabrica"]'
        //         ).value = `${fabrica.idfabrica}`
        //       })
        //     })
        //   }
        // })
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const idUsuario = id
      const nome = document.getElementById("inpNomeAtt").value
      const email = document.getElementById("inpEmailAtt").value
      const cpf = document.getElementById("inpCpfAtt").value
      const cargo = document.getElementById("sltCargo").value
      const fabrica = document.getElementById("sltFabrica").value
      console.log(idUsuario)
      console.log(nome)
      console.log(email)
      console.log(cpf)
      console.log(cargo)
      console.log(fabrica)

      if (
        nome == "" ||
        email == "" ||
        cpf == "" ||
        cargo == "" ||
        fabrica == ""
      ) {
        return Swal.fire("Erro", "Preencha todos os campos!", "error")
      }

      if (sessionStorage.getItem("CARGO") == "GestorFabrica") {
        fetch(`http://localhost:3333/usuarios/atualizarUsuario`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idUsuario: idUsuario,
            nome: nome,
            email: email,
            cpf: cpf,
            cargo: cargo,
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json()
            } else {
              console.log(result)
              // throw new Error("Erro ao cadastrar funcionário")
            }
          })
          .then((res) => {
            if (res) {
              console.log("Funcionário atualizado com sucesso!")
              Swal.fire({
                title: "Sucesso",
                text: "Funcionário atualizado com sucesso!",
                icon: "success",
                confirmButtonText: "OK",
              })
              // listarFuncionariosEmpresa()
              listarFuncionariosFabrica()
            }
          })
      } else if (sessionStorage.getItem("CARGO") == "GestorEmpresa") {
        fetch(`http://localhost:3333/usuarios/atualizarUsuarioFabrica`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idUsuario: idUsuario,
            nome: nome,
            email: email,
            cpf: cpf,
            cargo: cargo,
            idFabrica: fabrica,
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json()
            } else {
              console.log(result)
              // throw new Error("Erro ao cadastrar funcionário")
            }
          })
          .then((res) => {
            if (res) {
              console.log("Funcionário atualizado com sucesso!")
              Swal.fire({
                title: "Sucesso",
                text: "Funcionário atualizado com sucesso!",
                icon: "success",
                confirmButtonText: "OK",
              })
              // listarFuncionariosFabrica()
              listarFuncionariosEmpresa()
            }
          })
      }
    }
  })
}

async function abrirModalCriar() {
  let fkFabrica = 0
  const result = await Swal.fire({
    title: `Cadastrar funcionário`,
    html: `
      <div class="modal-test">
        <div class="containerCadastroFunc">
            <label>Nome <input type="text" id="inpNome"></label>
            <label>Email <input type="email" id="inpEmail"></label>
            <label>Cpf <input type="number" id="inpCpf"></label>
            <label>Cargo
              <select name="" id="sltCargo">
              </select>
            </label>
            <label class="registrarFabricas">Fabrica
              <select name="fabrica" id="sltFabrica">
              <option value="0">Selecione a fábrica</option>
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
      popup: "funcModal",
    },
    didOpen: () => {
      const cargo = sessionStorage.getItem("CARGO")
      const idEmpresa = sessionStorage.getItem("EMPRESA")
      console.log(`idEmpresa: ${idEmpresa}`)

      if (cargo !== "GestorEmpresa") {
        document.querySelectorAll(".registrarFabricas").forEach(function (el) {
          el.style.display = "none"
        })
      }

      if (cargo === "GestorEmpresa") {
        const selectCargo = document.getElementById("sltCargo")
        const selectFabrica = document.getElementById("sltFabrica")
        selectCargo.innerHTML = `
          <option value="0">Selecione o cargo</option>
          <option value="GestorFabrica">Gestor fábrica</option>
        `

        fetch(
          `http://localhost:3333/fabricas/listarFabricasEmpresa/${idEmpresa}`,
          {
            method: "GET",
          }
        ).then((resposta) => {
          if (resposta.ok) {
            resposta.json().then((dados) => {
              listaFabricas = dados

              listaFabricas.forEach((fabrica) => {
                console.log(fabrica)
                selectFabrica.innerHTML += `
                  <option value="${fabrica.idfabrica}">${fabrica.nome}</option>
                  `
              })
            })
          }
        })
      } else if (cargo === "GestorFabrica") {
        const selectCargo = document.getElementById("sltCargo")
        selectCargo.innerHTML = `
          <option value="0">Selecione o cargo</option>
          <option value="EngenheiroManutencao">Engenheiro de Manutenção</option>
          <option value="AnalistaDados">Analista de Dados</option>
          <option value="OperadorMaquina">Operador de Máquina</option>
        `
      }
    },
  })
  if (result.isConfirmed) {
    const nome = document.getElementById("inpNome").value
    const email = document.getElementById("inpEmail").value
    const cpf = document.getElementById("inpCpf").value
    const cargo = document.getElementById("sltCargo").value
    const senha = document.getElementById("inpSenha").value
    // const fkFabrica = sessionStorage.getItem("FABRICA_ID")
    const cargoAtual = sessionStorage.getItem("CARGO")

    if (cargoAtual === "GestorEmpresa") {
      fkFabrica = document.getElementById("sltFabrica").value
    } else {
      fkFabrica = sessionStorage.getItem("FABRICA_ID")
    }

    if (nome == "" || email == "" || cpf == "" || cargo == "" || senha == "") {
      return Swal.fire("Erro", "Preencha todos os campos!", "error")
    }

    // if (!fkFabrica) {
    //   return Swal.fire(
    //     "Erro",
    //     "ID da fábrica não encontrado na sessão!",
    //     "error"
    //   )
    // }

    fetch(`http://localhost:3333/usuarios/cadastrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome,
        email: email,
        cpf: cpf,
        cargo: cargo,
        senha: senha,
        fkFabrica: fkFabrica,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          console.log(res.json())
          // throw new Error("Erro ao cadastrar funcionário")
        }
      })
      .then((res) => {
        // Se o backend retorna um objeto com sucesso
        if (res) {
          console.log("Funcionário cadastrado com sucesso!")
          Swal.fire({
            title: "Sucesso",
            text: "Funcionário cadastrado com sucesso!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "./funcionarios.html"
          })
        } else {
          console.log("Erro ao cadastrar funcionário")
          Swal.fire({
            title: "Erro",
            text: "Erro ao cadastrar funcionário",
            icon: "error",
            confirmButtonText: "OK",
          })
        }
      })
  }

  // let ultimoGestorEmpresa = listaFuncionarios
  //   .filter((f) => f.cargo === "GestorEmpresa")
  //   .pop()?.idusuario

  // fetch(
  //   `http://localhost:3333/fabricas/cadastrarGestorFabrica/${ultimoGestorEmpresa}`,
  //   {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       fkFabrica: fkFabrica,
  //     }),
  //   }
  // ).then((res) => {
  //   if (res.ok) {
  //     return res.json()
  //   } else {
  //     console.log(res.json())
  //     // throw new Error("Erro ao cadastrar funcionário")
  //   }
  // })
}

function listarFuncionariosEmpresa() {
  const idEmpresa = sessionStorage.getItem("EMPRESA")

  if (!idEmpresa) {
    swal.fire({
      title: "Erro",
      text: "Empresa inválida",
      icon: "error",
      confirmButtonText: "OK",
    })
  }

  fetch(`http://localhost:3333/usuarios/listarPorEmpresa/${idEmpresa}`, {
    method: "GET",
  })
    .then((resposta) => {
      if (resposta.ok) {
        resposta.json().then((resultado) => {
          listaFuncionarios = resultado
          renderTabela(paginaAtual)
          renderPaginacao()
        })
      } else {
        console.error("Erro ao listar funcionários:", resposta.statusText)
      }
    })
    .catch((erro) => {
      console.error("Erro ao listar funcionários:", erro)
    })
}

function listarFuncionariosFabrica() {
  const idFabrica = sessionStorage.getItem("FABRICA_ID")

  if (!idFabrica) {
    swal.fire({
      title: "Erro",
      text: "Fabrica inválida",
      icon: "error",
      confirmButtonText: "OK",
    })
  }

  fetch(`http://localhost:3333/usuarios/listarPorFabrica/${idFabrica}`, {
    method: "GET",
  })
    .then((resposta) => {
      if (resposta.ok) {
        resposta.json().then((resultado) => {
          listaFuncionarios = resultado
          renderTabela(paginaAtual)
          renderPaginacao()
        })
      } else {
        console.error("Erro ao listar funcionários:", resposta.statusText)
      }
    })
    .catch((erro) => {
      console.error("Erro ao listar funcionários:", erro)
    })
}

let cadastro = document.getElementById("btnCadastro")
cadastro.addEventListener("click", () => {
  let cargo = sessionStorage.getItem("CARGO")
  abrirModalCriar()
})
