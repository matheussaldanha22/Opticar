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
  document.getElementById("infoData").innerHTML = obterData()
}

document.addEventListener("DOMContentLoaded", () => {
  carregaPagina();
});

//NOME KPI


//EXIBE DATA
const nomeDias = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado"
]

const nomeMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];


function obterData() {
  let data = new Date();
  return `${nomeDias[data.getDay()]} - ${data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

function mostrarData() {
  setInterval(() => {
    document.getElementById("dataInfo").innerHTML = obterData()
  }, 1000);
}



function abrirModal(componente, idDestino) {
  Swal.fire({
    title: `Filtrar gráfico <u style="color:#2C3E50;">${componente}</u>`,
    html: `
      <div class="modal-test">
        <div class="containerVisualizacao">
          <h3>Mudar visualização</h3>
          <p class="labelSlt"><b>Visualização em:
            <select id="sltFiltrar">
              <option value="geral">Geral (Média aos anos)</option>
              <option value="anual">Anual (Média aos meses)</option>
            </select></b>
          </p>
          <div id="containerAno" style="display:none; margin-top:10px;">
            <label for="sltAno"><b>Escolha o ano:</b></label>
            <select id="sltAno" class="sltRoxo">
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025" selected>2025</option>
            </select>
          </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: "Fechar",
    confirmButtonText: "Confirmar",
    confirmButtonColor: '#2C3E50',
    customClass: "alertaModal"
  }).then((result) => {
    if (result.isConfirmed) {
      const sltFiltrar = document.getElementById("sltFiltrar");
      const sltAno = document.getElementById("sltAno");

      const tipoFiltro = document.getElementById(`tipoFiltro-${idDestino}`);
      const descFiltro = document.getElementById(`periodo-${idDestino}`);

      if (sltFiltrar && tipoFiltro && descFiltro) {
        if (sltFiltrar.value === "anual") {
          tipoFiltro.innerHTML = "Anual";
          descFiltro.innerHTML = sltAno.value;
        } else {
          tipoFiltro.innerHTML = "Geral";
          descFiltro.innerHTML = "Todos os anos";
        }
      }
    }
  });

  // Mostrar/esconder o select de ano enquanto o usuário interage
  setTimeout(() => {
    const sltFiltrar = document.getElementById("sltFiltrar");
    const containerAno = document.getElementById("containerAno");

    sltFiltrar.addEventListener("change", function () {
      if (this.value === "anual") {
        containerAno.style.display = "block";
      } else {
        containerAno.style.display = "none";
      }
    });
  }, 100);
}


//GRAF VALORES
let data2 = new Date;
let mesAtual = data2.getMonth()
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

//GRAF USO
function renderGraficoUso(periodo = 'ano') {
  const usoPorPeriodo = {
    ano: {
      categorias: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      dados: [52, 61, 60, 45, 100, 80, 50, 55, 28, 53, 55, 12]
    },
    '6m': {
      categorias: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      dados: [50, 55, 28, 53, 55, 12]
    },
    '3m': {
      categorias: ['Out', 'Nov', 'Dez'],
      dados: [53, 55, 12]
    }
  };

  const parametroAlerta = 70;
  const { categorias, dados } = usoPorPeriodo[periodo];
  const options = {
    chart: { type: 'line', height: 300, toolbar: { show: false } },
    series: [
      { name: 'Uso médio (%)', data: dados },
      { name: 'Parâmetro de alerta', data: new Array(categorias.length).fill(parametroAlerta), stroke: { dashArray: 5 } }
    ],
    xaxis: { categories: categorias, labels: { style: { colors: '#000' } } },
    yaxis: { max: 100, labels: { style: { colors: '#000' } } },
    colors: ['#000', '#e63946'],
    stroke: { curve: 'smooth', width: [3, 2] },
    legend: { labels: { colors: '#000' } },
    tooltip: { theme: 'light' },
    grid: { borderColor: '#ccc' }
  };

  if (window.chartUso) {
    window.chartUso.destroy();
  }

  window.chartUso = new ApexCharts(document.querySelector("#graficoUsoComponente"), options);
  window.chartUso.render();
}

//GRAF DISTRIBUIÇÃO
function renderSeveridade(periodo = 'mensal') {
  const dados = chartData.severidade[periodo];
  const options = {
    chart: { type: 'bar', stacked: true, height: 300 },
    series: [
      { name: 'Crítico', data: dados.critico },
      { name: 'Atenção', data: dados.atencao }
    ],
    xaxis: { categories: dados.categorias, labels: { style: { colors: '#000' } } },
    colors: ['#011f4b', '#0077b6'],
    legend: { labels: { colors: '#000' } },
    tooltip: { theme: 'light' }
  };

  if (window.chartSeveridade) window.chartSeveridade.destroy();
  window.chartSeveridade = new ApexCharts(document.querySelector("#distribuicaoSeveridade"), options);
  window.chartSeveridade.render();
}

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
    titleElement.innerText = `Probabilidade de Sobrecarga - CPU (Próx.Semestre)`;
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

renderGraficoUso();
renderSeveridade();
renderChart("alertas");




