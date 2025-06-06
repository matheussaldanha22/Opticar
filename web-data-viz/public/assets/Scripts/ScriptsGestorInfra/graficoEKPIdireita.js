 document.addEventListener('DOMContentLoaded', function () {
        
        var tabs = document.querySelectorAll('.tab');
        var arrowLeft = document.querySelector('.arrow-left');
        var arrowRight = document.querySelector('.arrow-right');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                var activeTab = document.querySelector('.tab.active');
                if (activeTab) activeTab.classList.remove('active');
                tab.classList.add('active');
               
            });
        });

        if (arrowLeft) {
            arrowLeft.addEventListener('click', () => {
                var activeTab = document.querySelector('.tab.active');
                var activeIndex = Array.from(tabs).indexOf(activeTab);
                if (activeIndex > 0) {
                    tabs[activeIndex - 1].click();
                }
            });
        }

        if (arrowRight) {
            arrowRight.addEventListener('click', () => {
                var activeTab = document.querySelector('.tab.active');
                var activeIndex = Array.from(tabs).indexOf(activeTab);
                if (activeIndex < tabs.length - 1) {
                    tabs[activeIndex + 1].click();
                }
            });
        }

    });

        //----------------------------------------------------------------------------------------


      
// puxa do bucket o bglh de json
var dados = {
  "precos_mensais": [
    { "mes": "Dez", "ano": "2024", "preco_medio": 15500.00 },
    { "mes": "Jan", "ano": "2025", "preco_medio": 16000.00 },
    { "mes": "Fev", "ano": "2025", "preco_medio": 17250.00 },
    { "mes": "Mar", "ano": "2025", "preco_medio": 16500.00 },
    { "mes": "Abr", "ano": "2025", "preco_medio": 18000.00 },
    { "mes": "Mai", "ano": "2025", "preco_medio": 17500.00 }
  ]
};

// Função para gerar os da prev
function gerarProximosMeses(mesAtual, anoAtual, quantidade = 3) {
  var meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  var indice = meses.indexOf(mesAtual);
  var ano = parseInt(anoAtual);

  var futuros = [];

  for (var i = 0; i < quantidade; i++) {
    indice++;
    if (indice >= 12) {
      indice = 0;
      ano++;
    }
    futuros.push({ mes: meses[indice], ano: ano.toString() });
  }

  return futuros;
}

// Preparar dados da regressão
var x = dados.precos_mensais.map((_, i) => i + 1);
var y = dados.precos_mensais.map(item => item.preco_medio);

// Regressão linear
var regressao = ss.linearRegression(x.map((xi, i) => [xi, y[i]]));
var prever = ss.linearRegressionLine(regressao);

// Prever os próximos 3 valores
var novosX = [x.length + 1, x.length + 2, x.length + 3];
var previsoes = novosX.map(prever);
var previsoesPositivas = previsoes.map(v => Math.max(0, v));

// R²
var r2 = ss.rSquared(x.map((xi, i) => [xi, y[i]]), prever);
var r2Porcentagem = parseFloat((r2 * 100).toFixed(2));

// Categorias do gráfico
var mesesHistoricos = dados.precos_mensais.map(item => `${item.mes}/${item.ano.slice(-2)}`);
var ultimo = dados.precos_mensais[dados.precos_mensais.length - 1];
var futuros = gerarProximosMeses(ultimo.mes, ultimo.ano);
var mesesFuturos = futuros.map(item => `${item.mes}/${item.ano.slice(-2)}`);

var todasAsCategorias = [...mesesHistoricos, ...mesesFuturos];
var previsaoGrafico = [...y, ...previsoesPositivas];
var dashArrayConfig = Array(previsaoGrafico.length - 3).fill(0).concat(Array(3).fill(6));

var lineOptions = {
  series: [{
    name: 'Previsão de preços por mês',
    data: previsaoGrafico
  }],
  chart: {
    height: 280,
    type: 'line',
    zoom: { enabled: true },
    toolbar: { show: true },
    fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
    dropShadow: {
      enabled: true,
      opacity: 0.2,
      blur: 5,
      left: 0,
      top: 5
    }
  },
  forecastDataPoints: {
          count: 3
        },
  colors: ['#14589c'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3,
    dashArray: dashArrayConfig // Aplicando apenas nos últimos três pontos
  },
  title: {
    text: 'Previsão de Gastos com CPU',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 500,
      color: '#14589c'
    }
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    }
  },
  xaxis: {
    categories: todasAsCategorias,
    labels: {
      style: {
        colors: '#666',
        fontSize: '12px'
      }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    title: {
      text: 'Valor (R$)',
      style: {
        color: '#666',
        fontSize: '12px',
        fontWeight: 400
      }
    },
    labels: {
      formatter: val => 'R$ ' + val.toLocaleString('pt-BR'),
      style: {
        colors: '#666',
        fontSize: '12px'
      }
    },
    min: 0,
    max: 20000
  },
  markers: {
    size: 5,
    colors: ['#14589c'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: { size: 7 }
  },
  tooltip: {
    y: {
      formatter: val => 'R$ ' + val.toLocaleString('pt-BR')
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
};

// Configuração do gráfico Gauge com R²
var gaugeOptions = {
  series: [r2Porcentagem],
  chart: {
    height: 150,
    type: 'radialBar',
    fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
    toolbar: { show: true }
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        margin: 0,
        size: '70%',
        background: '#fff',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.24
        }
      },
      track: {
        background: '#fff',
        strokeWidth: '67%',
        dropShadow: {
          enabled: true,
          top: -3,
          left: 0,
          blur: 4,
          opacity: 0.35
        }
      },
      dataLabels: {
        show: true,
        name: {
          offsetY: -10,
          show: true,
          color: '#011f27',
          fontSize: '17px'
        },
        value: {
          formatter: val => parseInt(val) + '%',
          color: '#011f27',
          fontSize: '36px',
          show: true
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#011f27'],
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  stroke: { lineCap: 'round' },
  labels: ['Precisão de']
};

    

    // Renderização
    new ApexCharts(document.querySelector("#line-chart"), lineOptions).render();
    new ApexCharts(document.querySelector("#gauge-chart"), gaugeOptions).render();


















 //grafico de gauge


    
        