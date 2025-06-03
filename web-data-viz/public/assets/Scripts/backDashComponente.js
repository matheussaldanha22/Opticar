// BARRA LATERAL
function expand() {
  if (div_menu.classList.contains('menu-expand')) {
    div_menu.style.animation = 'diminui 0.2s linear';

  } else {
    div_menu.style.animation = 'expandir 0.2s linear';

  }
  div_menu.classList.toggle('menu-expand')
  ul_links.classList.toggle('nav-links-expanded')
}

function carregaPagina() {
  mostrarData();
  listarServidores();
  atualizarDados();

}

document.addEventListener("DOMContentLoaded", () => {
  carregaPagina();
});


//-----------------------------DADOS UTEIS PARA GRAFICOS E KPIS
const nomeDias = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado"
]

const nomeMeses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

let data = new Date;
let mesAtual = data.getMonth()

//-----------------------------FUNÇÃO PLOTAR DATAS
function obterData() {
  let dataExibir = new Date;
  return `${nomeDias[dataExibir.getDay()]} - ${dataExibir.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

function mostrarData() {
  setInterval(() => {
    document.getElementById("dataInfo").innerHTML = obterData()
  }, 1000);
}


//-----------------------------CARREGAR SERVIDORES NO SLT
function listarServidores() {
  const servidores = JSON.parse(sessionStorage.getItem('SERVIDORES'));
  const selectServidores = document.getElementById("sltServidor");

  if (servidores && servidores.length > 0) {
    servidores.forEach(servidor => {
      const option = document.createElement("option");
      option.value = servidor.idMaquina;
      option.textContent = `SV${servidor.idMaquina}`;
      selectServidores.appendChild(option);
    });
  } else {
    console.log("Sem servidores no sessionstorage");
  }
}



//-----------------------------KPIS

//KPI % ALERTA
function obterAlertasMes(idMaquina, componente) {
  return fetch(`/dashComponentes/obterAlertasMes/${idMaquina}/${componente}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(alertaMes => {
      console.log("Alertas do mês:", alertaMes);
      let totalAlertas = alertaMes.totalAlertas
      let alertasCriticos = Number(alertaMes.alertasCriticos)
      let porcentagemCritico = parseFloat((alertasCriticos / totalAlertas) * 100).toFixed(2)

      //se nao conseguir calcular = 0%
      if (isNaN(porcentagemCritico)) {
        document.getElementById("probFalha").innerHTML = `0%`

      }else{
        document.getElementById("probFalha").innerHTML = `${porcentagemCritico}%`
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
    .catch(erro => {
      console.error("Erro ao buscar alertas:", erro);
    });
}

//KPI MEDIA USO
function obterMediaUso(idMaquina, componente) {
  return fetch(`/dashComponentes/obterMediaUso/${idMaquina}/${componente}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(resultado => {

      let usoMesAtual = resultado[0].media_uso;
      let usoMesPassado = resultado[1].media_uso;
      let comparacao

      document.getElementById('usoMedio').innerHTML = `${usoMesAtual}%`

      if (usoMesAtual <= usoMesPassado) {
        comparacao = usoMesPassado - usoMesAtual
        document.getElementById('comparacaoUso').innerHTML = `-${comparacao}%`
        document.getElementById('comparacaoUso').style.color = 'limegreen'
      } else {
        comparacao = usoMesAtual - usoMesPassado
        document.getElementById('comparacaoUso').innerHTML = `+${comparacao}%`
        document.getElementById('comparacaoUso').style.color = 'red'
      }

    })
    .catch(erro => {
      console.error("Erro ao buscar USO:", erro);
    });
}



//KPI MTBF
function obterTempoMtbf(idMaquina, componente) {
  return fetch(`/dashComponentes/obterTempoMtbf/${idMaquina}/${componente}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(tempos => {
      console.log("Desempenho:", tempos);
      let minOperacao = tempos.minutos_operacao;
      let qtdAlertas = tempos.qtd_alertas;
      let mtbf = Math.floor(minOperacao / qtdAlertas)

      let metrica = "Min"

      //validação descobrir faixa
      if (mtbf < 60) {
        document.getElementById("classificacaoMtbf").innerHTML = `Ruim`
        document.getElementById("classificacaoMtbf").style.color = 'red'
      } else if (mtbf < 240) {
        document.getElementById("classificacaoMtbf").innerHTML = `Atenção`
        document.getElementById("classificacaoMtbf").style.color = '#FFD700'
      } else {
        document.getElementById("classificacaoMtbf").innerHTML = `Ótimo`
        document.getElementById("classificacaoMtbf").style.color = 'limegreen'
      }

      // se tiver mais de 60 min ele vira hora
      if (mtbf > 60) {
        mtbf = Math.floor((minOperacao / 60) / qtdAlertas)
        metrica = "Hrs"
      }



      document.getElementById("mtbf").innerHTML = `${mtbf} ${metrica}`

    })
    .catch(erro => {
      console.error("Erro ao buscar MTBF:", erro);
    });
}

//KPI CONFIABILIDADE
async function calcularConfiabilidade(idMaquina, componente) {
  try {
    // espera as KPIs popularem o HTML
    await Promise.all([
      obterAlertasMes(idMaquina, componente),
      obterMediaUso(idMaquina, componente),
      obterTempoMtbf(idMaquina, componente)
    ]);

    // --- P1: Percentual de Alertas Críticos
    const porcCritico = parseInt(document.getElementById("probFalha").innerHTML) || 0;
    const p1 = 100 - porcCritico;

    // --- P2: Variação do uso médio
    const variacao = parseInt(document.getElementById("comparacaoUso").innerHTML) || 0;
    let p2;

    //validar se uso aumentou em relação ao mês passado ai sim calcula
    if (variacao > 0) {
      p2 = 100 - variacao;
    } else {
      p2 = 100; // ficou igual ou superior = bom 
    }

    // --- P3: MTBF atribuindo faixas
    const mtbfTexto = document.getElementById("mtbf").innerHTML;
    const [valor, medidaTempo] = mtbfTexto.split(" ");
    let minutosMtbf = 0;

    //validando se ta exibindo em hora ou min
    if (medidaTempo.toLowerCase() === "hrs") {
      minutosMtbf = parseInt(valor) * 60;
    } else {
      minutosMtbf = parseInt(valor);
    }



    let p3

    if (minutosMtbf < 60) {
      p3 = 33;
    } else if (minutosMtbf < 240) {
      p3 = 66;
    } else {
      p3 = 100;
    }


    const ic = ((p1 + p2 + p3) / 3).toFixed(0);

    console.log(`IC calculado: ${ic} (P1=${p1.toFixed(0)} | P2=${p2.toFixed(0)} | P3=${p3})`);

    return parseFloat(ic);

  } catch (error) {
    console.error("erro ao calcular o IC:", error);
    return null;
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
    confirmButtonColor: '#2C3E50',
    customClass: "alertaModal",
    didOpen: () => { //#############EXECUTA OS COMANDOS ASSIM Q MODAL ABRE SWEETALERT


      selectAno = document.getElementById("sltAno")
      selectMes = document.getElementById("sltMes")

      fetch(`/dashComponentes/obterAnosDisponiveis/${idMaquina}/${componente}`, { //fetch para add anos nos selects
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(res => {

          res.forEach(item => {
            const option = document.createElement("option");
            option.value = item.ano;
            option.textContent = item.ano;
            selectAno.appendChild(option);
          });


        })
        .catch(erro => {
          console.error("Erro ao buscar anos", erro);
        });

      //#######FETCH QUE POR PADRÃO LISTA OS MESES DO ANO ATUAL
      let ano = data.getFullYear()
      fetch(`/dashComponentes/obterMesesDisponiveis/${idMaquina}/${componente}/${ano}`, { //fetch para add anos nos selects
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(res => {
          selectMes.innerHTML = ''
          res.forEach(item => {
            const option = document.createElement("option");
            option.value = item.mes;
            option.textContent = `${nomeMeses[item.mes - 1]}`;
            selectMes.appendChild(option);
          });


        })
        .catch(erro => {
          console.error("Erro ao buscar meses", erro);
        });


      //#######EVENTO NO SELECT PARA OBTER MESES CORRESPONDENTES DO MES
      selectAno.addEventListener("change", function () { //fetch nos meses quando muda o ano

        let ano = selectAno.value
        fetch(`/dashComponentes/obterMesesDisponiveis/${idMaquina}/${componente}/${ano}`, { //fetch para add anos nos selects
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => res.json())
          .then(res => {
            selectMes.innerHTML = ''
            res.forEach(item => {
              const option = document.createElement("option");
              option.value = item.mes;
              option.textContent = `${nomeMeses[item.mes - 1]}`;
              selectMes.appendChild(option);
            });


          })
          .catch(erro => {
            console.error("Erro ao buscar meses", erro);
          });
      });

    }
  }).then((res) => {
    if (res.isConfirmed) {
      const tipoFiltro = document.getElementById("tipoFiltro-uso")
      const periodo = document.getElementById("periodo-uso")

      const sltFiltrar = document.getElementById("sltFiltrar");
      const sltAno = document.getElementById("sltAno");
      const sltMes = document.getElementById("sltMes");

      if (sltFiltrar && sltAno && sltMes) {
        if (sltFiltrar.value === "semanal") {
          tipoFiltro.innerHTML = "Semanal";
          periodo.innerHTML = `${nomeMeses[sltMes.value - 1]} de ${sltAno.value}`
          filtroGraf = sltFiltrar.value
        } else {
          tipoFiltro.innerHTML = "Mensal";
          periodo.innerHTML = sltAno.value
          filtroGraf = sltFiltrar.value
        }
      }

      anoVar = sltAno.value
      mesVar = sltMes.value

      atualizarDados()
    }
  });

  setTimeout(() => {
    const sltFiltrar = document.getElementById("sltFiltrar");
    const containerMes = document.getElementById("containerMes");

    sltFiltrar.addEventListener("change", function () {
      if (this.value === "semanal") {
        containerMes.style.display = "block";
      } else {
        containerMes.style.display = "none";
      }
    });
  }, 100);
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
    confirmButtonColor: '#2C3E50',
    customClass: "alertaModal",
    didOpen: () => { //#############EXECUTA OS COMANDOS ASSIM Q MODAL ABRE SWEETALERT


      selectAno = document.getElementById("sltAno")

      fetch(`/dashComponentes/obterAnosDisponiveis/${idMaquina}/${componente}`, { //fetch para add anos nos selects
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(res => {

          res.forEach(item => {
            const option = document.createElement("option");
            option.value = item.ano;
            option.textContent = item.ano;
            selectAno.appendChild(option);
          });


        })
        .catch(erro => {
          console.error("Erro ao buscar anos", erro);
        });

    }
  }).then((res) => {
    if (res.isConfirmed) {
      const tipoFiltro = document.getElementById("tipoFiltro-alertas")
      const periodo = document.getElementById("periodo-alertas")

      const sltFiltrar = document.getElementById("sltFiltrar");
      const sltAno = document.getElementById("sltAno");

      if (sltFiltrar && sltAno) {
        if (sltFiltrar.value === "anual") {
          tipoFiltro.innerHTML = "Anual";
          periodo.innerHTML = `Todos os anos`
          filtroGrafAlerta = sltFiltrar.value
        } else {
          tipoFiltro.innerHTML = "Mensal";
          periodo.innerHTML = sltAno.value
          filtroGrafAlerta = sltFiltrar.value
        }
      }

      anoVarAlerta = sltAno.value

      atualizarDados()
    }
  });

  setTimeout(() => {
    const sltFiltrar = document.getElementById("sltFiltrar");
    const containerAno = document.getElementById("containerAno");

    sltFiltrar.addEventListener("change", function () {
      if (this.value === "mensal") {
        containerAno.style.display = "block";
      } else {
        containerAno.style.display = "none";
      }
    });
  }, 100);
}


//-----------------------------CHARTS

// #######CHART USO
function obterParametroComponente(idMaquina, componente) {
  return fetch(`/dashComponentes/obterParametrosComponente/${idMaquina}/${componente}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(res => {
      return res.limiteCritico;
    })
    .catch(erro => {
      console.error("Erro ao buscar parâmetros", erro);
    });
}

function dadosGraficoUso(idMaquina, componente, anoEscolhido, mesEscolhido) {
  obterParametroComponente(idMaquina, componente) // BUSCA OS PARAMETROS DO GRAFICO E SÓ DEPOIS BUSCA OS DADOS
    .then((parametro) => {
      let categorias = [];
      let dados = [];

      if (filtroGraf === "semanal") {
        fetch(`/dashComponentes/dadosGraficoUsoSemanal/${idMaquina}/${componente}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anoEscolhido, mesEscolhido })
        })
          .then(res => res.json())
          .then(informacoes => {
            informacoes.forEach(item => {
              categorias.push(`Semana ${item.semana_do_mes}`);
              dados.push(item.media_utilizacao);
            });
            renderGraficoUso(categorias, dados, parametro); // EXECUTA A FUNÇÃO COM OS DADOS E PARAMETRO
          });
      } else {
        fetch(`/dashComponentes/dadosGraficoUsoMensal/${idMaquina}/${componente}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anoEscolhido })
        })
          .then(res => res.json())
          .then(informacoes => {
            informacoes.forEach(item => {
              categorias.push(`${nomeMeses[item.mes - 1]}`);
              dados.push(item.media_utilizacao);
            });
            renderGraficoUso(categorias, dados, parametro); // EXECUTA A FUNÇÃO COM OS DADOS E PARAMETRO
          });
      }
    })
    .catch(erro => console.error("Erro:", erro));
}

function renderGraficoUso(categorias, dados, parametro) {
  console.log("parametro do componente:", parametro);

  const options = {
    chart: { type: 'line', height: 300, toolbar: { show: true } },
    series: [
      { name: 'Uso médio (%)', data: dados },
      { name: 'Limite crítico', data: new Array(categorias.length).fill(parametro), stroke: { dashArray: 5 } }
    ],
    xaxis: { categories: categorias },
    yaxis: { max: 100 },
    colors: ['#000', '#e63946'],
    stroke: { curve: 'smooth', width: [3, 2] }
  };

  if (window.chartUso) { //se já tiver um grafico destroi p plotar o outro
    window.chartUso.destroy()
  };

  window.chartUso = new ApexCharts(document.querySelector("#graficoUsoComponente"), options);
  window.chartUso.render();
}

// #######CHART ALERTA
function dadosGraficoAlerta(idMaquina, componente, anoEscolhido) {

  let categorias = [];
  let dadosCritico = [];
  let dadosMedio = [];

  if (filtroGrafAlerta === "anual") {
    fetch(`/dashComponentes/dadosGraficoAlertaAnual/${idMaquina}/${componente}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(informacoes => {
        informacoes.forEach(item => {
          categorias.push(`${item.ano}`);
          dadosCritico.push(item.alertasCriticos);
          dadosMedio.push(item.alertasMedios);

        });
        renderGraficoAlerta(categorias, dadosCritico, dadosMedio);
      });
  } else {
    fetch(`/dashComponentes/dadosGraficoAlertaMensal/${idMaquina}/${componente}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anoEscolhido })
    })
      .then(res => res.json())
      .then(informacoes => {
        informacoes.forEach(item => {
          categorias.push(`${nomeMeses[item.mes - 1]}`);
          dadosCritico.push(item.alertasCriticos);
          dadosMedio.push(item.alertasMedios);
        });
        console.log("dados", informacoes)
        console.log("ano do fetch", anoEscolhido)
        renderGraficoAlerta(categorias, dadosCritico, dadosMedio); // EXECUTA A FUNÇÃO COM OS DADOS E PARAMETRO
      });
  }
}

function renderGraficoAlerta(categorias, dadosCritico, dadosMedio) {
  const options = {
    chart: { type: 'bar', stacked: true, height: 300, toolbar: { show: true } },
    series: [
      { name: 'Crítico', data: dadosCritico },
      { name: 'Médio', data: dadosMedio }
    ],
    xaxis: { categories: categorias, labels: { style: { colors: '#000' } } },
    colors: ['#011f4b', '#0077b6'],
    legend: { labels: { colors: '#000' } },
    tooltip: { theme: 'light' }
  };

  if (window.chartSeveridade) window.chartSeveridade.destroy();
  window.chartSeveridade = new ApexCharts(document.querySelector("#distribuicaoSeveridade"), options);
  window.chartSeveridade.render();
}

function predicaoAlerta(idMaquina,componente){

}


//GRAF VALORES

const mesesSeguintes = [];
for (let i = 1; i <= 6; i++) {
  mesesSeguintes.push(nomeMeses[(mesAtual + i) % 12]);
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
      categorias: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    },
    semanal: {
      critico: [2, 3],
      atencao: [1, 2],
      categorias: ['Semana Atual', 'Semana Anterior']
    }
  }
};

// -----------------------TROCA DE COMPONENTE
//FUNÇÃO PARA ATUALIZAR DADOS DE ACORDO COM O FILTRO SLTS
const sltServidor = document.getElementById("sltServidor");
const sltComponente = document.getElementById("sltComponente");

function atualizarDados() {
  const idMaquina = sltServidor.value;
  const componente = sltComponente.value;
  let anoEscolhidoUso = anoVar;
  let mesEscolhidoUso = mesVar;

  let anoEscolhidoAlerta = anoVarAlerta


  const nomesComponente = document.querySelectorAll('.nomeComponente')
  nomesComponente.forEach(i => { i.innerHTML = componente });

  //atribuindo que se nao filtrar por padrão puxa o mes e ano atual --USO
  if (!anoEscolhidoUso || !mesEscolhidoUso) {
    anoEscolhidoUso = data.getFullYear()
    mesEscolhidoUso = data.getMonth() + 1
  }

  //se filtro for anual 
  if (!anoEscolhidoAlerta) {
    anoEscolhidoAlerta = data.getFullYear();
  }

  if (idMaquina && componente) {
    obterAlertasMes(idMaquina, componente);
    obterMediaUso(idMaquina, componente)
    obterTempoMtbf(idMaquina, componente);
    dadosGraficoUso(idMaquina, componente, anoEscolhidoUso, mesEscolhidoUso);
    dadosGraficoAlerta(idMaquina, componente, anoEscolhidoAlerta)


    calcularConfiabilidade(idMaquina, componente)
      .then(indiceConfiabilidade => {
        if (indiceConfiabilidade !== null) {
          console.log(`O IC do ${componente} é: ${indiceConfiabilidade}`);
          document.getElementById('confiabilidade').innerHTML = `${indiceConfiabilidade}/100`
        } else {
          console.log("calculo do IC falhou.");
        }

        const faixa = document.getElementById('faixaConfiabilidade');

        if (indiceConfiabilidade < 40) {
          faixa.innerHTML = "Crítico"
          faixa.style.color = 'red'
        } else if (indiceConfiabilidade < 70) {
          faixa.innerHTML = "Atenção"
          faixa.style.color = '#FFD700'
        } else {
          faixa.innerHTML = 'Estável'
          faixa.style.color = 'limegreen'
        }

      })
      .catch(erro => {
        console.error("erro calcularConfiabilidade:", erro);
      });
  }
}

sltServidor.addEventListener("change", atualizarDados);
sltComponente.addEventListener("change", atualizarDados);







//PREDICAO
let currentChart;
const chartElement = document.querySelector("#predictionChart");
const titleElement = document.querySelector("#chartTitle");


function renderChart(tipo) {
  if (currentChart) currentChart.destroy();

  let options;
  if (tipo === 'alertas') {
    titleElement.innerText = `Número de alertas previstos - CPU (Prox. Mês - ${nomeMeses[mesAtual + 1]})`;
    options = {
      chart: { type: 'line', height: 300, toolbar: { show: false } },
      series: [{ name: 'Alertas', data: chartData.alertas }],
      xaxis: {
        categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
        labels: { style: { colors: '#333' } }
      },
      colors: ['#0077b6']
    };
  } else if (tipo === 'risco') {
    titleElement.innerText = `Percentual de alertas críticos - CPU (Próx.Semestre)`;
    const dados = chartData.risco;
    const options = {
      chart: { type: 'bar', stacked: false, height: 300 },
      series: [
        { name: 'Sobrecarga (%)', data: dados.data }
      ],
      xaxis: { categories: mesesSeguintes, labels: { style: { colors: '#000' } } },
      colors: ['#011f4b'],
      legend: { labels: { colors: '#000' } },
      tooltip: { theme: 'light' }
    };

    currentChart = new ApexCharts(chartElement, options);
    currentChart.render();
  }
  else if (tipo === 'tendencia') {
    titleElement.innerText = `Tendência de Crescimento de Uso - CPU (7 dias)`;
    options = {
      chart: { type: 'area', height: 300, toolbar: { show: false } },
      series: [{ name: 'Uso Projetado (%)', data: chartData.tendencia }],
      xaxis: {
        categories: ['Hoje', '+1d', '+2d', '+3d', '+4d', '+5d', '+6d'],
        labels: { style: { colors: '#333' } }
      },
      colors: ['#2196f3']
    };
  }

  currentChart = new ApexCharts(chartElement, options);
  currentChart.render();
}

document.getElementById("tipo").addEventListener("change", () => {
  renderChart(document.getElementById("tipo").value);
});

// renderSeveridade();
renderChart("alertas");




