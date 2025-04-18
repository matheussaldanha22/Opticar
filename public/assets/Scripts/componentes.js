//MODAL ADD
function abrirModalAdd() {
    Swal.fire({
        html: `
    <div style="display: flex;flex-direction:column; align-items: center;border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); height:5vw;background-color:rgb(235, 234, 234);padding:5px;">
          
        <div style="margin-left: 15px; text-align: left;">
            <h2 style="color:black;margin: 0; font-size: 22px; font-weight: bold;"><i class='bx bx-add-to-queue' style="color: #646363; font-size: 30px; border: 3px solid rgb(138, 136, 136);border-radius: 5px;"></i> Cadastro de componentes</h2>
            <p style="margin: 4px 0 0 0; font-size: 17px;color:black">Cadastre um novo componente que deseja monitorar.</p>
        </div>
       
    </div>

    <div class="modal-content">
    
        <div class="infosCadastro">
            <p class="label">Tipo:</p><select id="sltTipo" class="sltsCad"> <option value="cpu">CPU</option> </select>
        </div>
        <div class="infosCadastro">
            <p class="label">Medida:</p><select id="sltMedida" class="sltsCad"> <option value="cpu">Hz</option> </select>
        </div>
        <div class="infosCadastro">
            <p class="label">Identificador:</p><input class="iptsCad" id="iptIdentificador" placeholder="Ex: CPU001">
        </div>
        <div class="infosCadastro">
            <p class="label">Limite atenção:</p><input class="iptsCad" id="iptLimiteAtencao" placeholder="Ex: 3000">
        </div>
        <div class="infosCadastro" id="infoUltimo">
            <p class="label">Limite grave:</p><input class="iptsCad" id="iptLimiteGrave" placeholder="Ex: 6000">
        </div>

    </div>
  
`,
        showCancelButton: true,
        cancelButtonText: "Fechar",
        background: '#fff',
        confirmButtonColor: '#2C3E50',
        customClass: 'addModal'
    })
}


const itensPorPagina = 10
let paginaAtual = 1
let componentes = [] // Armazenamento dos dados recebidos do backend



//PARTE DE RENDERIZAR E PAGINAR CASO HAJA MUITOS ELEMENTOS DO VITAO alertas.js, PODE SER UTIL(PRECISA IMPLEMENTAR)
function renderTabela(pagina) {
    const tabela = document.getElementById("tabela-alertas")
    tabela.innerHTML = ` <tr>
                          <th>Servidor</th>
                          <th>Componente</th>
                          <th>Data</th>
                          <th>Gravidade</th>
                          <th>Status</th>
                          <th>Visualizar</th>
                      </tr>`
  
    const inicio = (pagina - 1) * itensPorPagina
    const fim = inicio + itensPorPagina
    const paginaDados = componentes.slice(inicio, fim)
  
    paginaDados.forEach((alerta) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${alerta.servidor}</td>
        <td>${alerta.componente}</td>
        <td>${alerta.dtAlerta}</td>
        <td>${alerta.gravidade}</td>
        <td>${alerta.status}</td>
        <td><i class='bx bx-arrow-from-left btn' onclick="abrirModal(${alerta.id})"></i></td>
      `
      tabela.appendChild(tr)
    })
  }

function renderPaginacao() {
  const paginacao = document.getElementById("paginacao")
  paginacao.innerHTML = ""

  const totalPaginas = Math.ceil(componentes.length / itensPorPagina)

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