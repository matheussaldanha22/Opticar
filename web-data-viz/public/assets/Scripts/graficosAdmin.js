const fabricas = Array.from({ length: 100}, (_, i) => `Fábrica ${i + 1}`);
const larguraGrafico = Math.max(fabricas.length * 60, 100);

//GRÁFICO ALERTAS
var optionsBar = {
  chart: {
    height: 350,
    width: larguraGrafico,
    type: "bar",
    toolbar: {  
      show: true,
    },
    zoom: {
      enabled: true,
    },
    stacked: true,
  },
  plotOptions: {
    bar: {
      columnWidth: "30%",
      horizontal: false,
    },
  },
  series: [
    {
      name: "Alertas em Aberto",
      data: Array.from({ length: fabricas.length }, () =>
        Math.floor(Math.random() * 100)
      ),
      color: "#01232D",
    },
    {
      name: "Alertas em Andamento",
      data: Array.from({ length: fabricas.length }, () =>
        Math.floor(Math.random() * 50)
      ),
      color: "#04708D", 
    },
    {
      name: "Alertas Finalizados",
      data: Array.from({ length: fabricas.length }, () =>
        Math.floor(Math.random() * 30)
      ),
      color: "#007FFF", 
    },
  ],
  xaxis: {
    categories: fabricas,
  },
  fill: {
    opacity: 1,
  },
};

var chartBar = new ApexCharts(
  document.querySelector("#graficoAlertaFabricas"),
  optionsBar
);

chartBar.render();

//GRÁFICO PREDIÇÃO

var options = {
  chart: {
    type: "line",
    height: 350,
    width: 600,
    toolbar: {
      show: true,
    },
    // background: "#1f3a4d", // Fundo mais escuro para contraste
  },
  series: [
    {
      name: "Série 1",
      data: [10, 15, 7, 30, 25, 40, 20],
    },
    {
      name: "Série 2",
      data: [20, 25, 15, 35, 30, 45, 30],
    },
  ],
  stroke: {
    curve: "smooth",
    width: 4, // Aumenta a espessura das linhas
  },
  colors: ["#FFFFFF", "#000000"],
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    labels: {
      style: {
        colors: "#FFFFFF",
        fontSize: "14px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#FFFFFF",
        fontSize: "14px",
      },
    },
  },
  grid: {
    borderColor: "#CCCCCC", // Grade mais clara
    strokeDashArray: 4,
  },
  markers: {
    size: 5,
    colors: ["#FFFFFF", "#000000"],
    strokeColors: "#CCCCCC",
    strokeWidth: 2,
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "14px",
      colors: ["#FFFFFF"],
    },
  },
};

var chartPred = new ApexCharts(document.querySelector("#graficoPredicao"), options);
chartPred.render();

//GRÁFICO TEMPO RESOLUÇÃO

var options = {
  series: [
    {
      name: "Tempo Médio (min)",
      data: [45, 30, 60, 20, 50], 
    },
  ],
  chart: {
    type: "bar",
    height: 350,
    width: 600,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [
      "Fábrica 1",
      "Fábrica 2",
      "Fábrica 3",
      "Fábrica 4",
      "Fábrica 5",
    ],
    title: {
      text: "Tempo Médio de Resolução (minutos)",
    },
  },
  title: {
    text: "Tempo Médio de Resolução por Fábrica",
    align: "center",
  },
};

var chartTempo = new ApexCharts(document.querySelector("#graficoTempoResolucao"), options);
chartTempo.render();