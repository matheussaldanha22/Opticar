var icRelatorio = []

var alertaP = []

var alertaR = []

var alertaCategorias = []

var usoCategorias = []

var usoY = []

const bobPredicao = document.querySelector(".bobPredicao")
const API_URL = "http://23.23.103.208"

bobPredicao.addEventListener("click", () => {
  Swal.fire({
    html: `
      <div class="modal-bob">
        <div class="containerBob">
          <h3>Relatório de Predição</h3>
          <div style="margin: 20px 0;">
            <label><input type="radio" id="novo" name="opcao" value="novo" checked> Gerar novo</label><br>
            <label><input type="radio" id="antigo" name="opcao" value="antigo"> Baixar anterior</label>
          </div>
          <select id="select_relatorio" style="width: 100%; padding: 8px; margin-top: 10px;">
            <option value="">Selecione...</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Baixar",
    confirmButtonColor: "#2C3E50",
    background: "#fff",
    customClass: "addModal",
    didOpen: () => {
      visualizarHistorico()
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (document.getElementById("novo").checked) {
        bobPredicaoRelatorio()
      } else {
        var relatorioNome = document.getElementById("select_relatorio").value
        if (relatorioNome) {
          baixarHistorico(relatorioNome)
        }
      }
    }
  })
})

// CÓDIGO PARA CONTROLE DA BARRA LATERAL RESPONSIVA
function expand() {
  const menu = document.getElementById("div_menu")
  const ul_links = document.getElementById("ul_links")
  const linha1 = document.getElementById("linha1")
  const linha2 = document.getElementById("linha2")
  const linha3 = document.getElementById("linha3")

  // VERIFICA SE A TELA É DE CELULAR (menor que 702px)
  if (window.innerWidth < 702) {
    // Comportamento no Celular: Abrir/Fechar menu lateral
    menu.classList.toggle("menu-aberto-celular")
    linha1.classList.toggle("linha1-active")
    linha2.classList.toggle("linha2-active")
    linha3.classList.toggle("linha3-active")
  } else {
    // Comportamento no Desktop: Expandir/Diminuir menu (seu código original)
    if (menu.classList.contains("menu-expand")) {
      menu.style.animation = "diminui 0.2s linear"
    } else {
      menu.style.animation = "expandir 0.2s linear"
    }
    menu.classList.toggle("menu-expand")
    ul_links.classList.toggle("nav-links-expanded")
  }
}

function carregaPagina() {
  mostrarData()
  listarServidores()
  atualizarDados()
}

document.addEventListener("DOMContentLoaded", () => {
  carregaPagina()
})

//-----------------------------DADOS UTEIS PARA GRAFICOS E KPIS
const nomeDias = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
]

const nomeMeses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

let data = new Date()
let mesAtual = data.getMonth()

//-----------------------------FUNÇÃO PLOTAR DATAS
function obterData() {
  let dataExibir = new Date()
  return `${nomeDias[dataExibir.getDay()]} - ${dataExibir.toLocaleString(
    "pt-BR",
    { timeZone: "America/Sao_Paulo" }
  )}`
}

function mostrarData() {
  setInterval(() => {
    document.getElementById("dataInfo").innerHTML = obterData()
  }, 1000)
}

//-----------------------------CARREGAR SERVIDORES NO SLT
function listarServidores() {
  const servidores = JSON.parse(sessionStorage.getItem("SERVIDORES"))
  const selectServidores = document.getElementById("sltServidor")

  if (servidores && servidores.length > 0) {
    servidores.forEach((servidor) => {
      const option = document.createElement("option")
      option.value = servidor.idMaquina
      option.textContent = `SV${servidor.idMaquina}`
      selectServidores.appendChild(option)
    })
  } else {
    console.log("Sem servidores no sessionstorage")
  }
}

//-----------------------------KPIS

//KPI % ALERTA
function obterAlertasMes(idMaquina, componente) {
  return fetch(`/dashComponentes/obterAlertasMes/${idMaquina}/${componente}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((alertaMes) => {
      console.log("Alertas do mês:", alertaMes)
      let totalAlertas = alertaMes.totalAlertas
      let alertasCriticos = Number(alertaMes.alertasCriticos)
      let porcentagemCritico = parseFloat(
        (alertasCriticos / totalAlertas) * 100
      ).toFixed(2)

      //se nao conseguir calcular = 0%
      if (isNaN(porcentagemCritico)) {
        document.getElementById("probFalha").innerHTML = `0%`
      } else {
        document.getElementById(
          "probFalha"
        ).innerHTML = `${porcentagemCritico}%`
      }

      if (porcentagemCritico < 40) {
        document.getElementById("probFalha").style.color = "limegreen"
      } else if (porcentagemCritico < 70) {
        document.getElementById("probFalha").style.color = "#FFD700"
      } else {
        document.getElementById("probFalha").style.color = "red"
      }

      document.getElementById("qtdAlertasTotal").innerHTML = totalAlertas
    })
    .catch((erro) => {
      console.error("Erro ao buscar alertas:", erro)
    })
}

//KPI MEDIA USO
function obterMediaUso(idMaquina, componente) {
  return fetch(`/dashComponentes/obterMediaUso/${idMaquina}/${componente}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((resultado) => {
      let usoMesAtual = resultado[0].media_uso
      let usoMesPassado = resultado[1].media_uso
      let comparacao

      document.getElementById("usoMedio").innerHTML = `${usoMesAtual}%`

      if (usoMesAtual <= usoMesPassado) {
        comparacao = usoMesPassado - usoMesAtual
        document.getElementById(
          "comparacaoUso"
        ).innerHTML = `-${comparacao.toFixed(2)}%`
        document.getElementById("comparacaoUso").style.color = "limegreen"
      } else {
        comparacao = usoMesAtual - usoMesPassado
        document.getElementById(
          "comparacaoUso"
        ).innerHTML = `+${comparacao.toFixed(2)}%`
        document.getElementById("comparacaoUso").style.color = "red"
      }
    })
    .catch((erro) => {
      console.error("Erro ao buscar USO:", erro)
    })
}

//KPI MTBF
function obterTempoMtbf(idMaquina, componente) {
  return fetch(`/dashComponentes/obterTempoMtbf/${idMaquina}/${componente}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((tempos) => {
      console.log("Desempenho:", tempos)
      let minOperacao = tempos.minutos_operacao
      let qtdAlertas = tempos.qtd_alertas
      let mtbf = Math.floor(minOperacao / qtdAlertas)

      let metrica = "Min"

      //validação descobrir faixa
      if (mtbf < 60) {
        document.getElementById("classificacaoMtbf").innerHTML = `Ruim`
        document.getElementById("classificacaoMtbf").style.color = "red"
      } else if (mtbf < 240) {
        document.getElementById("classificacaoMtbf").innerHTML = `Atenção`
        document.getElementById("classificacaoMtbf").style.color = "#FFD700"
      } else {
        document.getElementById("classificacaoMtbf").innerHTML = `Ótimo`
        document.getElementById("classificacaoMtbf").style.color = "limegreen"
      }

      // se tiver mais de 60 min ele vira hora
      if (mtbf > 60) {
        mtbf = Math.floor(minOperacao / 60 / qtdAlertas)
        metrica = "Hrs"
      }

      document.getElementById("mtbf").innerHTML = `${mtbf} ${metrica}`
    })
    .catch((erro) => {
      console.error("Erro ao buscar MTBF:", erro)
    })
}

//KPI CONFIABILIDADE
async function calcularConfiabilidade(idMaquina, componente) {
  try {
    // espera as KPIs popularem o HTML
    await Promise.all([
      obterAlertasMes(idMaquina, componente),
      obterMediaUso(idMaquina, componente),
      obterTempoMtbf(idMaquina, componente),
    ])

    // --- P1: Percentual de Alertas Críticos
    const porcCritico =
      parseInt(document.getElementById("probFalha").innerHTML) || 0
    const p1 = 100 - porcCritico

    // --- P2: Variação do uso médio
    const variacao =
      parseInt(document.getElementById("comparacaoUso").innerHTML) || 0
    let p2

    //validar se uso aumentou em relação ao mês passado ai sim calcula
    if (variacao > 0) {
      p2 = 100 - variacao
    } else {
      p2 = 100 // ficou igual ou superior = bom
    }

    // --- P3: MTBF atribuindo faixas
    const mtbfTexto = document.getElementById("mtbf").innerHTML
    const [valor, medidaTempo] = mtbfTexto.split(" ")
    let minutosMtbf = 0

    //validando se ta exibindo em hora ou min
    if (medidaTempo.toLowerCase() === "hrs") {
      minutosMtbf = parseInt(valor) * 60
    } else {
      minutosMtbf = parseInt(valor)
    }

    let p3
    if (minutosMtbf < 60) {
      p3 = 33
    } else if (minutosMtbf < 240) {
      p3 = 66
    } else {
      p3 = 100
    }

    const ic = ((p1 + p2 + p3) / 3).toFixed(0)

    console.log(
      `IC calculado: ${ic} (P1=${p1.toFixed(0)} | P2=${p2.toFixed(
        0
      )} | P3=${p3})`
    )

    return parseFloat(ic)
  } catch (error) {
    console.error("erro ao calcular o IC:", error)
    return null
  }
}

//-----------------------------MODAL FILTRO USO

let anoVar //variaveis global para levar pro atualiza dados
let mesVar
let filtroGraf = "mensal"

// ------------- VARIAVEIS FILTRO ALERTA
let anoVarAlerta
let filtroGrafAlerta = "anual"

//caso nao escolha vai mostrar o ano atual ---- Texto filtro
document.getElementById("tipoFiltro-uso").innerHTML = "Mensal"
document.getElementById("periodo-uso").innerHTML = ` ${data.getFullYear()}`

document.getElementById("tipoFiltro-alertas").innerHTML = "Anual"
document.getElementById("periodo-alertas").innerHTML = ` Todos os anos`

function filtrarUso() {
  let idMaquina = sltServidor.value
  let componente = sltComponente.value

  Swal.fire({
    title: `Filtrar gráfico <u style="color:#2C3E50;">Uso</u>`,
    html: `
      <div class="modal-test">
        <div class="containerVisualizacao" style="gap:10px">
          <h3>Mudar visualização</h3>
          <p class="labelSlt"><b>Visualização em:
            <select id="sltFiltrar">
            <option value="mensal">Mensal (Dentro de um ano)</option>
            <option value="semanal">Semanal (Dentro de um mês)</option>
            </select></b>
          </p>
          
          <div style="display:flex; gap:5px;">
          <label for="sltAno"><b>Escolha o ano:</b></label>
            <select id="sltAno" class="sltRoxo">
            </select>
          </div>

          <div id="containerMes" style="display:none;">
            <label for="sltMes"><b>Escolha o Mês:</b></label>
            <select id="sltMes" class="sltRoxo">
            </select>
          </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Fechar",
    confirmButtonText: "Confirmar",
    confirmButtonColor: "#2C3E50",
    customClass: "alertaModal",
    didOpen: () => {
      //#############EXECUTA OS COMANDOS ASSIM Q MODAL ABRE SWEETALERT

      selectAno = document.getElementById("sltAno")
      selectMes = document.getElementById("sltMes")

      fetch(
        `/dashComponentes/obterAnosDisponiveis/${idMaquina}/${componente}`,
        {
          //fetch para add anos nos selects
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          res.forEach((item) => {
            const option = document.createElement("option")
            option.value = item.ano
            option.textContent = item.ano
            selectAno.appendChild(option)
          })
        })
        .catch((erro) => {
          console.error("Erro ao buscar anos", erro)
        })

      //#######FETCH QUE POR PADRÃO LISTA OS MESES DO ANO ATUAL
      let ano = data.getFullYear()
      fetch(
        `/dashComponentes/obterMesesDisponiveis/${idMaquina}/${componente}/${ano}`,
        {
          //fetch para add anos nos selects
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          selectMes.innerHTML = ""
          res.forEach((item) => {
            const option = document.createElement("option")
            option.value = item.mes
            option.textContent = `${nomeMeses[item.mes - 1]}`
            selectMes.appendChild(option)
          })
        })
        .catch((erro) => {
          console.error("Erro ao buscar meses", erro)
        })

      //#######EVENTO NO SELECT PARA OBTER MESES CORRESPONDENTES DO MES
      selectAno.addEventListener("change", function () {
        //fetch nos meses quando muda o ano

        let ano = selectAno.value
        fetch(
          `/dashComponentes/obterMesesDisponiveis/${idMaquina}/${componente}/${ano}`,
          {
            //fetch para add anos nos selects
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            selectMes.innerHTML = ""
            res.forEach((item) => {
              const option = document.createElement("option")
              option.value = item.mes
              option.textContent = `${nomeMeses[item.mes - 1]}`
              selectMes.appendChild(option)
            })
          })
          .catch((erro) => {
            console.error("Erro ao buscar meses", erro)
          })
      })
    },
  }).then((res) => {
    if (res.isConfirmed) {
      const tipoFiltro = document.getElementById("tipoFiltro-uso")
      const periodo = document.getElementById("periodo-uso")

      const sltFiltrar = document.getElementById("sltFiltrar")
      const sltAno = document.getElementById("sltAno")
      const sltMes = document.getElementById("sltMes")

      if (sltFiltrar && sltAno && sltMes) {
        if (sltFiltrar.value === "semanal") {
          tipoFiltro.innerHTML = "Semanal"
          periodo.innerHTML = `${nomeMeses[sltMes.value - 1]} de ${
            sltAno.value
          }`
          filtroGraf = sltFiltrar.value
        } else {
          tipoFiltro.innerHTML = "Mensal"
          periodo.innerHTML = sltAno.value
          filtroGraf = sltFiltrar.value
        }
      }

      anoVar = sltAno.value
      mesVar = sltMes.value

      atualizarDados()
    }
  })

  setTimeout(() => {
    const sltFiltrar = document.getElementById("sltFiltrar")
    const containerMes = document.getElementById("containerMes")

    sltFiltrar.addEventListener("change", function () {
      if (this.value === "semanal") {
        containerMes.style.display = "block"
      } else {
        containerMes.style.display = "none"
      }
    })
  }, 100)
}

//FILTRAR GRAFICO ALERTA
function filtrarAlerta() {
  let idMaquina = sltServidor.value
  let componente = sltComponente.value

  Swal.fire({
    title: `Filtrar gráfico <u style="color:#2C3E50;">Alerta</u>`,
    html: `
      <div class="modal-test">
        <div class="containerVisualizacao">
          <h3>Mudar visualização</h3>
          <p class="labelSlt"><b>Visualização em:
            <select id="sltFiltrar">
            <option value="anual">Anual (Todos os anos)</option>
            <option value="mensal">Mensal (Dentro de um ano)</option>
            </select></b>
          </p>

          <div id="containerAno" style="display:none; margin-top:10px;">
          <label for="sltAno"><b>Escolha o ano:</b></label>
            <select id="sltAno" class="sltRoxo">
            </select>
          </div>

        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Fechar",
    confirmButtonText: "Confirmar",
    confirmButtonColor: "#2C3E50",
    customClass: "alertaModal",
    didOpen: () => {
      //#############EXECUTA OS COMANDOS ASSIM Q MODAL ABRE SWEETALERT

      selectAno = document.getElementById("sltAno")

      fetch(
        `/dashComponentes/obterAnosDisponiveis/${idMaquina}/${componente}`,
        {
          //fetch para add anos nos selects
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          res.forEach((item) => {
            const option = document.createElement("option")
            option.value = item.ano
            option.textContent = item.ano
            selectAno.appendChild(option)
          })
        })
        .catch((erro) => {
          console.error("Erro ao buscar anos", erro)
        })
    },
  }).then((res) => {
    if (res.isConfirmed) {
      const tipoFiltro = document.getElementById("tipoFiltro-alertas")
      const periodo = document.getElementById("periodo-alertas")

      const sltFiltrar = document.getElementById("sltFiltrar")
      const sltAno = document.getElementById("sltAno")

      if (sltFiltrar && sltAno) {
        if (sltFiltrar.value === "anual") {
          tipoFiltro.innerHTML = "Anual"
          periodo.innerHTML = `Todos os anos`
          filtroGrafAlerta = sltFiltrar.value
        } else {
          tipoFiltro.innerHTML = "Mensal"
          periodo.innerHTML = sltAno.value
          filtroGrafAlerta = sltFiltrar.value
        }
      }

      anoVarAlerta = sltAno.value

      atualizarDados()
    }
  })

  setTimeout(() => {
    const sltFiltrar = document.getElementById("sltFiltrar")
    const containerAno = document.getElementById("containerAno")

    sltFiltrar.addEventListener("change", function () {
      if (this.value === "mensal") {
        containerAno.style.display = "block"
      } else {
        containerAno.style.display = "none"
      }
    })
  }, 100)
}

//-----------------------------CHARTS

// #######CHART USO
function obterParametroComponente(idMaquina, componente) {
  return fetch(
    `/dashComponentes/obterParametrosComponente/${idMaquina}/${componente}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res.limiteCritico
    })
    .catch((erro) => {
      console.error("Erro ao buscar parâmetros", erro)
    })
}

function dadosGraficoUso(idMaquina, componente, anoEscolhido, mesEscolhido) {
  obterParametroComponente(idMaquina, componente) // BUSCA OS PARAMETROS DO GRAFICO E SÓ DEPOIS BUSCA OS DADOS
    .then((parametro) => {
      let categorias = []
      let dados = []

      if (filtroGraf === "semanal") {
        fetch(
          `/dashComponentes/dadosGraficoUsoSemanal/${idMaquina}/${componente}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anoEscolhido, mesEscolhido }),
          }
        )
          .then((res) => res.json())
          .then((informacoes) => {
            informacoes.forEach((item) => {
              categorias.push(`Semana ${item.semana_do_mes}`)
              dados.push(item.media_utilizacao)
            })
            renderGraficoUso(categorias, dados, parametro) // EXECUTA A FUNÇÃO COM OS DADOS E PARAMETRO
          })
      } else {
        fetch(
          `/dashComponentes/dadosGraficoUsoMensal/${idMaquina}/${componente}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anoEscolhido }),
          }
        )
          .then((res) => res.json())
          .then((informacoes) => {
            informacoes.forEach((item) => {
              categorias.push(`${nomeMeses[item.mes - 1].slice(0, 3)}`)
              dados.push(item.media_utilizacao)
            })
            renderGraficoUso(categorias, dados, parametro) // EXECUTA A FUNÇÃO COM OS DADOS E PARAMETRO
          })
      }
    })
    .catch((erro) => console.error("Erro:", erro))
}

function renderGraficoUso(categorias, dados, parametro) {
  console.log("parametro do componente:", parametro)

  const options = {
    chart: { type: "line", height: 250, toolbar: { show: false } },
    series: [
      { name: "Uso médio (%)", data: dados },
      {
        name: "Limite crítico",
        data: new Array(categorias.length).fill(parametro),
        stroke: { dashArray: 5 },
      },
    ],
    xaxis: {
      categories: categorias,
      labels: {
        style: {
          colors: "#000",
          fontSize: "12px",
          fontFamily: "Montserrat",
          fontWeight: "bold",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Tamanho aumentado
          fontFamily: "Montserrat",
          colors: "#000",
        },
      },
    },
    colors: ["#000", "#e63946"],
    stroke: { curve: "smooth", width: [3, 2] },
    legend: { fontSize: "15px" },
  }

  if (window.chartUso) {
    //se já tiver um grafico destroi p plotar o outro
    window.chartUso.destroy()
  }

  window.chartUso = new ApexCharts(
    document.querySelector("#graficoUsoComponente"),
    options
  )
  window.chartUso.render()
}

// #######CHART ALERTA
function dadosGraficoAlerta(idMaquina, componente, anoEscolhido) {
  let categorias = []
  let dadosCritico = []
  let dadosMedio = []

  if (filtroGrafAlerta === "anual") {
    fetch(
      `/dashComponentes/dadosGraficoAlertaAnual/${idMaquina}/${componente}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((informacoes) => {
        informacoes.forEach((item) => {
          categorias.push(`${item.ano}`)
          dadosCritico.push(item.alertasCriticos)
          dadosMedio.push(item.alertasMedios)
        })
        renderGraficoAlerta(categorias, dadosCritico, dadosMedio)
      })
  } else {
    fetch(
      `/dashComponentes/dadosGraficoAlertaMensal/${idMaquina}/${componente}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anoEscolhido }),
      }
    )
      .then((res) => res.json())
      .then((informacoes) => {
        informacoes.forEach((item) => {
          categorias.push(`${nomeMeses[item.mes - 1].slice(0, 3)}`)
          dadosCritico.push(item.alertasCriticos)
          dadosMedio.push(item.alertasMedios)
        })
        console.log("dados", informacoes)
        console.log("ano do fetch", anoEscolhido)
        renderGraficoAlerta(categorias, dadosCritico, dadosMedio) // EXECUTA A FUNÇÃO COM OS DADOS E PARAMETRO
      })
  }
}

function renderGraficoAlerta(categorias, dadosCritico, dadosMedio) {
  const options = {
    chart: {
      type: "bar",
      stacked: true,
      height: 250,
      toolbar: { show: false },
    },
    series: [
      { name: "Crítico", data: dadosCritico },
      { name: "Médio", data: dadosMedio },
    ],
    xaxis: {
      categories: categorias,
      labels: {
        style: {
          colors: "#000",
          fontSize: "11px",
          fontFamily: "Montserrat",
          fontWeight: "bold",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "14px", // Tamanho aumentado
          fontFamily: "Montserrat",
          colors: "#000",
        },
      },
    },
    colors: ["#011f4b", "#0077b6"],
    legend: { fontSize: "15px" },
  }

  if (window.chartSeveridade) window.chartSeveridade.destroy()
  window.chartSeveridade = new ApexCharts(
    document.querySelector("#distribuicaoSeveridade"),
    options
  )
  window.chartSeveridade.render()
}

// const a = document.getElementById("sltServidor");
// const b = document.getElementById("sltComponente");
// const sltPredicao = document.getElementById("slt_predicao")

// sltPredicao.addEventListener("change", () => {
//   executarPredicao(a, b)
// })

function executarPredicao(idMaquina, componente) {
  const tituloGrafico = document.querySelector("#chartTitle")
  const sltPredicao = document.getElementById("slt_predicao")
  let valorSlt = sltPredicao.value

  if (valorSlt === "uso") {
    tituloGrafico.innerHTML = "Tendência de Crescimento de Uso (Prox. Mês) - "
    predicaoUso(idMaquina, componente)
  } else {
    tituloGrafico.innerHTML = "Número de Alertas Previstos (Prox. Mês) -  "
    predicaoAlerta(idMaquina, componente)
  }
}

function predicaoAlerta(idMaquina, componente) {
  usoCategorias = []
  usoY = []
  alertaP = []
  alertaR = []
  fetch(
    `/dashComponentes/dadosPredicaoAlertaSemanal/${idMaquina}/${componente}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((res) => res.json())
    .then((informacoes) => {
      // transforma dados em vetores, ss precisa disso [semana,alerta]
      const dadosSemanais = informacoes.map((item) => [
        item.semana_do_mes,
        item.quantidade_alertas,
      ])

      // gera o modelo de regressao
      const modeloRegressao = ss.linearRegression(dadosSemanais)

      // predicao
      const previsao = ss.linearRegressionLine(modeloRegressao)

      // preve os alertas dividindo por semana
      const alertasPrevistos = []
      for (let semana = 0; semana < informacoes.length; semana++) {
        const predito = Math.round(previsao(semana))
        alertasPrevistos.push(Math.max(0, predito)) // arredonda para inteiro
      }

      //vetor para pegar vetor dos alertas real
      const alertasReais = informacoes.map((item) => item.quantidade_alertas)

      //pegar categorias(semanas da previsao)
      const categorias = informacoes.map(
        (item) => `Semana ${item.semana_do_mes}`
      )
      console.log("categoriaAlerta", categorias)
      console.log("PrevisaoAlerta", alertasPrevistos)
      alertaP.push(alertasPrevistos)
      alertaR.push(alertasReais)
      alertaCategorias.push(categorias)
      renderGrafPredicao("alerta", alertasReais, alertasPrevistos, categorias)
    })
}

function predicaoUso(idMaquina, componente) {
  let anoAtual = data.getFullYear()
  let mesAtual = data.getMonth() + 1
  console.log(anoAtual, mesAtual)
  usoCategorias = []
  usoY = []
  alertaP = []
  alertaR = []

  fetch(`/dashComponentes/dadosGraficoUsoSemanal/${idMaquina}/${componente}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ anoEscolhido: anoAtual, mesEscolhido: mesAtual }),
  })
    .then((res) => res.json())
    .then((informacoes) => {
      const dadosSemanais = informacoes.map((item) => [
        item.semana_do_mes,
        item.media_utilizacao,
      ])

      // gera o modelo de regressao
      const modeloRegressao = ss.linearRegression(dadosSemanais)

      // predicao
      const previsao = ss.linearRegressionLine(modeloRegressao)

      // preve os alertas dividindo por semana
      const usoPrevisto = []
      for (let semana = 0; semana < informacoes.length; semana++) {
        const predito = Math.round(previsao(semana))
        usoPrevisto.push(Math.max(0, predito)) // arredonda para inteiro
      }

      //vetor para pegar vetor dos alertas real
      const usoReal = informacoes.map((item) => item.media_utilizacao)

      //pegar categorias(semanas da previsao)
      const categorias = informacoes.map(
        (item) => `Semana ${item.semana_do_mes}`
      )
      console.log("Previsao uso", usoPrevisto)

      usoY.push(usoPrevisto)
      usoCategorias.push(categorias)

      renderGrafPredicao("uso", usoReal, usoPrevisto, categorias)
    })
}

function renderGrafPredicao(tipo, valoresReais, valoresPrevistos, categorias) {
  let options
  const data = new Date()

  if (tipo === "alerta") {
    options = {
      chart: {
        type: "line",
        height: 320,
        toolbar: { show: false },
      },
      series: [
        {
          name: `Alertas ${nomeMeses[data.getMonth()]}(Atual)`,
          data: valoresReais,
        },
        {
          name: `Alertas ${nomeMeses[data.getMonth() + 1]} (Previsão)`,
          data: valoresPrevistos,
        },
      ],
      xaxis: {
        categories: categorias,
        labels: {
          style: {
            colors: "#000",
            fontSize: "15px",
            fontFamily: "Montserrat",
            fontWeight: "bold",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "14px", // Tamanho aumentado
            fontFamily: "Montserrat",
            colors: "#000",
          },
        },
      },
      colors: ["#333", "#0077b6"],
      legend: { fontSize: "20px" },
      stroke: {
        width: [4, 4],
        curve: "smooth",
        dashArray: [0, 8],
      },
    }
  } else {
    options = {
      chart: {
        type: "area",
        height: 320,
        toolbar: { show: false },
      },
      series: [
        {
          name: `Média do uso em ${nomeMeses[data.getMonth() + 1]}`,
          data: valoresPrevistos,
        },
      ],
      xaxis: {
        categories: categorias,
        labels: {
          style: {
            colors: "#000",
            fontSize: "15px",
            fontFamily: "Montserrat",
            fontWeight: "bold",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "14px", // Tamanho aumentado
            fontFamily: "Montserrat",
            colors: "#000",
          },
        },
      },
      colors: ["#011f4b"],
      legend: { fontSize: "20px" },
      stroke: {
        width: 5,
        curve: "smooth",
      },
    }
  }

  // destroi
  if (
    window.grafPredicao &&
    typeof window.grafPredicao.destroy === "function"
  ) {
    window.grafPredicao.destroy()
  }

  // ✅ Criar e renderizar novo gráfico
  window.grafPredicao = new ApexCharts(
    document.querySelector("#grafPredicao"),
    options
  )
  window.grafPredicao.render()
}

//GRAF VALORES

const mesesSeguintes = []
for (let i = 1; i <= 6; i++) {
  mesesSeguintes.push(nomeMeses[(mesAtual + i) % 12])
}
document.getElementById("kpiMes").innerHTML = `(${nomeMeses[mesAtual]})`
document.getElementById("kpiMes2").innerHTML = `(${nomeMeses[mesAtual]})`

const chartData = {
  alertas: [3, 5, 6, 8, 10],
  risco: {
    data: [30, 10, 34, 12, 33, 11],
  },
  tendencia: [65, 67, 70, 72, 74, 77, 80],
  severidade: {
    mensal: {
      critico: [4, 7, 3, 8, 2, 10, 3, 7, 6, 5, 10, 20],
      atencao: [5, 2, 7, 2, 4, 2, 8, 2, 1, 2, 11, 12],
      categorias: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
    },
    semanal: {
      critico: [2, 3],
      atencao: [1, 2],
      categorias: ["Semana Atual", "Semana Anterior"],
    },
  },
}

// -----------------------TROCA DE COMPONENTE
//FUNÇÃO PARA ATUALIZAR DADOS DE ACORDO COM O FILTRO SLTS
const sltServidor = document.getElementById("sltServidor")
const sltComponente = document.getElementById("sltComponente")
const sltPredicao = document.getElementById("slt_predicao")

function atualizarDados() {
  const idMaquina = sltServidor.value
  const componente = sltComponente.value
  let anoEscolhidoUso = anoVar
  let mesEscolhidoUso = mesVar

  let anoEscolhidoAlerta = anoVarAlerta

  //atualizar nome dos componentes no gráfico
  const nomesComponente = document.querySelectorAll(".nomeComponente")
  nomesComponente.forEach((i) => {
    i.innerHTML = componente.toUpperCase()
  })

  //atribuindo que se nao filtrar por padrão puxa o mes e ano atual --USO
  if (!anoEscolhidoUso || !mesEscolhidoUso) {
    anoEscolhidoUso = data.getFullYear()
    mesEscolhidoUso = data.getMonth() + 1
  }

  //se filtro for anual
  if (!anoEscolhidoAlerta) {
    anoEscolhidoAlerta = data.getFullYear()
  }

  if (idMaquina && componente) {
    obterAlertasMes(idMaquina, componente)
    obterMediaUso(idMaquina, componente)
    obterTempoMtbf(idMaquina, componente)
    dadosGraficoUso(idMaquina, componente, anoEscolhidoUso, mesEscolhidoUso)
    dadosGraficoAlerta(idMaquina, componente, anoEscolhidoAlerta)
    executarPredicao(idMaquina, componente)

    calcularConfiabilidade(idMaquina, componente)
      .then((indiceConfiabilidade) => {
        if (indiceConfiabilidade !== null) {
          icRelatorio = []
          console.log(`O IC do ${componente} é: ${indiceConfiabilidade}`)
          document.getElementById(
            "confiabilidade"
          ).innerHTML = `${indiceConfiabilidade}/100`
          icRelatorio.push(indiceConfiabilidade)
          console.log("AAAAAAAAAAAAA", indiceConfiabilidade)
        } else {
          console.log("calculo do IC falhou.")
        }

        const faixa = document.getElementById("faixaConfiabilidade")
        if (indiceConfiabilidade < 40) {
          faixa.innerHTML = "Crítico"
          faixa.style.color = "red"
        } else if (indiceConfiabilidade < 70) {
          faixa.innerHTML = "Atenção"
          faixa.style.color = "#FFD700"
        } else {
          faixa.innerHTML = "Estável"
          faixa.style.color = "limegreen"
        }
      })
      .catch((erro) => {
        console.error("erro calcularConfiabilidade:", erro)
      })
  }
}

sltServidor.addEventListener("change", atualizarDados)
sltComponente.addEventListener("change", atualizarDados)
sltPredicao.addEventListener("change", () => {
  const idMaquina = sltServidor.value
  const componente = sltComponente.value
  executarPredicao(idMaquina, componente)
})

var respostas

async function bobPredicaoRelatorio() {
  document.getElementById("bobP").classList.add("loader")
  var agora = new Date()
  var ano = agora.getFullYear()
  var mes = String(agora.getMonth() + 1).padStart(2, "0")
  var dia = String(agora.getDate()).padStart(2, "0")
  var hora = String(agora.getHours()).padStart(2, "0")
  var minuto = String(agora.getMinutes()).padStart(2, "0")
  var pasta = "RelatorioPredição"

  var tipo = `Predição_${ano}-${mes}-${dia}_${hora}-${minuto}.pdf`
  try {
    var perguntas

    if (alertaP.length > 0 && alertaR.length > 0) {
      perguntas = `Você é analista de dados da empresa OptiCars, especializada em monitoramento de hardware SCADA em fábricas automotivas. Gere um relatório técnico e visual, com análise e recomendações, sobre o componente ${sltComponente.value} do servidor ${sltServidor.value}, com base nos dados da dashboard de risco.
      Na Seção 1, analise o índice de confiabilidade (0 a 100), calculado pela média de três KPIs: P1 (percentual de alertas críticos no mês), P2 (variação do uso médio do componente em relação ao mês anterior – aumento é negativo, redução é positivo) e P3 (MTBF – tempo médio até falha, sendo <60 min crítico, entre 60 e 240 atenção, >240 estável). Use a fórmula (P1 + P2 + P3) / 3 = ${icRelatorio}. Classifique o índice com base nas faixas: 0 a 40 = Crítico 🔴 (vermelho), 41 a 70 = Atenção 🟡 (amarelo), 71 a 100 = Estável 🟢 (verde). Explique a fórmula, os valores usados, destaque a faixa atual com a cor correspondente e identifique o KPI mais problemático. Indique se são necessárias ações corretivas.
      Na Seção 2, analise o gráfico de predição de alertas baseado em regressão linear. Ele mostra os dados reais (${alertaR}) do mês com linha contínua, a previsão (${alertaP}) com linha tracejada, e o eixo X com as semanas (${alertaCategorias}). Avalie se há tendência de aumento ou queda nos alertas, relacione com o índice de confiabilidade atual (${icRelatorio}) e indique se o cenário é preocupante ou aceitável. Sugira ações, se necessário.
      O objetivo do relatório é apresentar as informações de forma clara, usando cores para indicar o status do componente, explicando a situação com base nos dados históricos e preditivos, e recomendando ações baseadas em evidências para apoiar a tomada de decisão por gestores e técnicos.`
    } else {
      perguntas = `Você é analista de dados da OptiCars, responsável por monitorar o risco de componentes em servidores SCADA de fábricas automotivas. Atualmente, você está analisando o componente ${sltComponente.value} do servidor ${sltServidor.value}.
      Sua dashboard apresenta um índice de confiabilidade (0 a 100) que mede o desempenho do componente com base em três KPIs: P1 – percentual de alertas críticos no mês; P2 – variação da média de uso do componente em relação ao mês anterior (+ indica aumento e risco, - indica redução e melhora); P3 – MTBF (tempo médio até alerta), onde <60 min é crítico, 60 a 240 min é atenção e >240 min é estável. O índice é calculado pela média simples (P1 + P2 + P3) / 3 = ${icRelatorio}, e classificado em faixas: 0-40 Crítico 🔴, 41-70 Atenção 🟡, 71-100 Estável 🟢. Explique o cálculo, destaque a faixa e avalie o status do componente.
      Além disso, há um gráfico de predição do uso do componente baseado em regressão linear. O eixo X (${usoCategorias}) representa as semanas do mês (até 5) e a linha de previsão (${usoY}) mostra a média projetada do uso para o próximo mês. Analise como a previsão foi calculada, indique se o uso está crescendo ou diminuindo e avalie se essa tendência é preocupante considerando o índice de confiabilidade atual.
      Produza uma análise clara, técnica e visual, com cores para indicar o status do componente, que ajude gestores e técnicos a entender rapidamente o risco e a necessidade de ações.`
    }

    const response = await fetch(`${API_URL}:5000/perguntar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        perguntaServer: perguntas,
      }),
    })

    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.status)
    }
    respostas = await response.text()
    console.log(respostas)
    pdf(respostas, tipo, pasta)
  } catch (erro) {
    console.error(`Erro: ${erro}`)
    Swal.fire("Erro!", "Erro ao tentar formular relatório", "error")
  } finally {
    document.getElementById("bobP").classList.remove("loader")
  }
}

async function pdf(respostas, tipo, pasta) {
  try {
    const resposta = await fetch(`${API_URL}:5000/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        respostaBOB: respostas,
        nomeArquivo: tipo,
      }),
    })

    if (!resposta.ok) {
      throw new Error("Erro ao gerar PDF: " + resposta.status)
    }

    const blob = await resposta.blob()
    console.log(blob)
    relatorioClient(blob, tipo, pasta)

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = `${tipo}`

    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (erro) {
    console.error("Erro ao baixar PDF:", erro)
    Swal.fire("Erro!", "Erro ao baixar PDF", "error")
  }
}

async function relatorioClient(blob, tipo, pasta) {
  const formData = new FormData()
  formData.append("relatorioCliente", blob, "relatorio.pdf")
  formData.append("tipo", tipo)
  formData.append("pasta", pasta)

  try {
    const resposta = await fetch(`${API_URL}:5000/aws/relatorioClient`, {
      method: "POST",
      body: formData,
    })

    if (!resposta.ok) {
      throw new Error("Erro ao enviar relatório para a aws" + resposta.status)
    }
  } catch (erro) {
    console.error("Erro ao enviar relatório:", erro)
    Swal.fire("Erro!", "Erro ao enviar relatório", "error")
  }
}

async function visualizarHistorico() {
  var pasta = "RelatorioPredição"
  try {
    const resposta = await fetch(
      `${API_URL}:5000/aws/visualizarHistorico/${pasta}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )

    if (!resposta.ok) {
      throw new Error("Erro ao visualizar histórico")
    }

    var dados = await resposta.json()

    const slt = document.getElementById("select_relatorio")
    dados.forEach((options) => {
      var option = document.createElement("option")
      option.value = options
      option.textContent = options
      slt.appendChild(option)
    })

    console.log("estou no visualizarHistorico")
    console.log(resposta)
  } catch (erro) {
    console.error(erro)
  }
}

async function baixarHistorico(relatorioNome) {
  var pasta = "RelatorioPredição"
  try {
    const resposta = await fetch(
      `${API_URL}:5000/aws/baixarHistorico/${relatorioNome}/${pasta}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/pdf" },
      }
    )

    if (!resposta.ok) {
      throw new Error("Erro ao baixar histórico")
    }
    console.log("Estou no baixar histórico")
    console.log(resposta)

    const blob = await resposta.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = `${relatorioNome}`
    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (erro) {
    console.error(erro)
  }
}
