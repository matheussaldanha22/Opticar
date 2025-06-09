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

async function atualizarGraficoPrevisao(componente) {
  try {
    var res = await fetch(`http://localhost:3334/awsGestorinfra/pegar/${componente}`);
    var dados = await res.json();

    console.log("Dados recebidos para o gráfico:", dados); //se num aparecer n ta funfando o fetch

    // mapearos dados que tão vindo como arrayja
    var x = dados.map((_, i) => i + 1);
    var y = dados.map(item => Number(item.preco_medio));

    var regressao = ss.linearRegression(x.map((xi, i) => [xi, y[i]]));
    var prever = ss.linearRegressionLine(regressao);

    var novosX = [x.length + 1, x.length + 2, x.length + 3];
    var previsoes = novosX.map(prever);
    var previsoesPositivas = previsoes.map(v => Math.max(0, v));

    var r2 = ss.rSquared(x.map((xi, i) => [xi, y[i]]), prever);
    var r2Porcentagem = parseFloat((r2 * 100).toFixed(2));

    var mesesHistoricos = dados.map(item => `${item.mes}/${item.ano}`);
    var ultimo = dados[dados.length - 1];
    var mesesFuturos = gerarProximosMeses(ultimo.mes, ultimo.ano).map(item => `${item.mes}/${item.ano}`);

    var todasAsCategorias = [...mesesHistoricos, ...mesesFuturos];
    var previsaoGrafico = [...y, ...previsoesPositivas];
    var dashArrayConfig = Array(previsaoGrafico.length - 3).fill(0).concat(Array(3).fill(6));

    // ver se tavindo valor direito
    console.log("Categorias:", todasAsCategorias);
    console.log("Dados do gráfico:", previsaoGrafico);
    console.log("R²:", r2Porcentagem);


    // Atualizar gráfico de linha
    var lineOptions = {
  series: [{ name: 'Previsão de preços por mês', data: previsaoGrafico }],
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
  forecastDataPoints: { count: 3 },
  colors: ['#14589c'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3,
    dashArray: dashArrayConfig
  },
  title: {
    text: `Previsão de Gastos com ${componente.toUpperCase()}`,
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
    max: Math.floor(Math.max(...previsaoGrafico) * 2) 
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

    // Limpar e renderizar novos gráficos
    document.querySelector("#line-chart").innerHTML = "";
    document.querySelector("#gauge-chart").innerHTML = "";

    new ApexCharts(document.querySelector("#line-chart"), lineOptions).render();
    new ApexCharts(document.querySelector("#gauge-chart"), gaugeOptions).render();

  } catch (error) {
    console.error("Erro ao buscar dados de previsão:", error);
  }
}

// Inicialização padrão com CPU ao carregar
document.addEventListener("DOMContentLoaded", () => {
  atualizarGraficoPrevisao("CPU");
});










 //grafico de gauge


    
        