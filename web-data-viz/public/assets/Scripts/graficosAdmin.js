const fabricasG = Array.from({ length: 10 }, (_, i) => `Fábrica ${i + 1}`);
const larguraGrafico = Math.max(fabricasG.length * 105, 400);

//GRÁFICO ALERTAS
var optionsBar = {
  chart: {
    height: 430,
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
      data: Array.from({ length: fabricasG.length }, () =>
        Math.floor(Math.random() * 100)
      ),
      color: "#22B4D1",
    },
    {
      name: "Alertas em Andamento",
      data: Array.from({ length: fabricasG.length }, () =>
        Math.floor(Math.random() * 50)
      ),
      color: "#04708D",
    },
  ],
  xaxis: {
    categories: fabricasG,
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

const modalPredicao = document.querySelector(".modalPredicao");
const cliqueAqui = document.querySelector("#cliqueAqui");
const fechar = document.querySelector('.fechar');

cliqueAqui.addEventListener("click", () => {
  modalPredicao.classList.add("ativo");
});

fechar.addEventListener("click", () => {
  modalPredicao.classList.remove("ativo");
});

//GRÁFICO PREDIÇÃO

var options = {
  chart: {
    type: "line",
    height: 350,
    width: 1300,
    toolbar: {
      show: true,
    },
    background: "#f8f9fa",  
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
    width: 3,  
  },
  colors: ["#4ecdc4", "#6c8ebf"], 
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    labels: {
      style: {
        colors: "#555555",  
        fontSize: "14px",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#555555", 
        fontSize: "14px",
      },
    },
  },
  grid: {
    borderColor: "#e0e0e0", 
    strokeDashArray: 4,
  },
  markers: {
    size: 5,
    colors: ["#4ecdc4", "#6c8ebf"],  
    strokeColors: "#FFFFFF",  
    strokeWidth: 2,
  },
  dataLabels: {
    enabled: false, 
    style: {
      fontSize: "12px",
      colors: ["#555555"],
    },
    background: {
      enabled: true,
      foreColor: "#555555",
      borderRadius: 2,
      padding: 4,
      opacity: 0.9,
      borderWidth: 1,
      borderColor: "#e0e0e0",
    },
  },
  tooltip: {
    theme: "light", 
    marker: {
      show: true,
    },
  },
  theme: {
    mode: "light", 
  }
};

var chartPred = new ApexCharts(
  document.querySelector("#graficoPredicao"),
  options
);
chartPred.render();

const fabricasPorPagina = 12;

let paginaAtual = 1;

const fabricas = [];

for (let i = 1; i <= 131; i++) {
  fabricas.push({
    id: i,
    nome: "Fábrica " + i, 
    critica: Math.random() < 0.3,
  });
}

function mostrarFabricas() {
  const grade = document.getElementById("grade-fabricas");

  grade.innerHTML = "";

  const inicio = (paginaAtual - 1) * fabricasPorPagina;
  const fim = inicio + fabricasPorPagina;

  for (let i = inicio; i < fim && i < fabricas.length; i++) {
    const fabrica = fabricas[i];

    const divFabrica = document.createElement("div");
    divFabrica.className = "fabrica";

    if (fabrica.critica) {
      divFabrica.classList.add("fabrica-critica");
    }

    const divNome = document.createElement("div");
    divNome.className = "nome-fabrica";
    divNome.textContent = fabrica.nome;
    divFabrica.appendChild(divNome);

    const divId = document.createElement("div");
    divId.className = "id-fabrica";
    divId.textContent = "ID: " + fabrica.id;
    divFabrica.appendChild(divId);

    divFabrica.addEventListener("click", function () {
      if (divFabrica.classList.contains("div-selecionada")) {
        divFabrica.classList.remove("div-selecionada")
      } else {
        divFabrica.classList.add("div-selecionada")
      }
    });

    grade.appendChild(divFabrica);
  }
}

function criarBotoesPaginacao() {
  const paginacao = document.getElementById("paginacao");
  
  paginacao.innerHTML = "";
  
  const totalPaginas = Math.ceil(fabricas.length / fabricasPorPagina);
  
  const btnAnterior = document.createElement("button");
  btnAnterior.className = "botao-pagina";
  btnAnterior.textContent = "Anterior";
  btnAnterior.disabled = paginaAtual === 1; 
  btnAnterior.addEventListener("click", function() {
    paginaAtual = paginaAtual - 1;
    mostrarFabricas();
    criarBotoesPaginacao();
  });
  paginacao.appendChild(btnAnterior);
  
  const textoInfo = document.createElement("span");
  textoInfo.style.margin = "0 10px";
  textoInfo.textContent = "Página " + paginaAtual + " de " + totalPaginas;
  paginacao.appendChild(textoInfo);
  
  const btnProximo = document.createElement("button");
  btnProximo.className = "botao-pagina";
  btnProximo.textContent = "Próximo";
  btnProximo.disabled = paginaAtual === totalPaginas; 
  btnProximo.addEventListener("click", function() {
    paginaAtual = paginaAtual + 1;
    mostrarFabricas();
    criarBotoesPaginacao();
  });
  paginacao.appendChild(btnProximo);
}

window.onload = function () {
  mostrarFabricas();
  criarBotoesPaginacao();
};
