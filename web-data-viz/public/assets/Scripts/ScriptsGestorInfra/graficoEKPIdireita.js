 const bobPredicao = document.querySelector(".bobPredicao");

bobPredicao.addEventListener("click", () => {
  Swal.fire({
    html: `
      <div class="modal-bob">
        <div class="containerBob">
          <h3>Relatório de Previsão</h3>
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
      visualizarHistorico();
    }
  }).then((result) => {
    if (result.isConfirmed) {
      if (document.getElementById('novo').checked) {
        bobCorrelacaoRelatorio();
      } else {
        var relatorioNome = document.getElementById('select_relatorio').value;
        if (relatorioNome) {
          baixarHistorico(relatorioNome);
        }
      }
    }
  });
});

var respostas;

async function bobPredicaoRelatorio() {
  document.getElementById('bobP').classList.add('loader');
  var agora = new Date();
  var ano = agora.getFullYear();
  var mes = String(agora.getMonth() + 1).padStart(2, '0');
  var dia = String(agora.getDate()).padStart(2, '0');
  var hora = String(agora.getHours()).padStart(2, '0');
  var minuto = String(agora.getMinutes()).padStart(2, '0');
  var tipo = `Correlação_${ano}-${mes}-${dia}_${hora}-${minuto}.pdf`;
  try {
    var perguntas = ``;

    const response = await fetch("http://localhost:5000/perguntar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        perguntaServer: perguntas,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.status);
    }
    respostas = await response.text();
    console.log(respostas);
    pdf(respostas, tipo);
  } catch (erro) {
    console.error(`Erro: ${erro}`);
    Swal.fire('Erro!', 'Erro ao tentar formular relatório', 'error')
  } finally {
    document.getElementById('bobP').classList.remove('loader');
  }
}

async function pdf(respostas, tipo) {
  try {
    const resposta = await fetch("http://localhost:5000/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        respostaBOB: respostas,
        nomeArquivo: tipo,
      }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao gerar PDF: " + resposta.status);
    }

    const blob = await resposta.blob();
    console.log(blob);
    relatorioClient(blob, tipo)

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${tipo}`;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (erro) {
    console.error("Erro ao baixar PDF:", erro);
    Swal.fire('Erro!', 'Erro ao baixar PDF', 'error')
  }
}

async function relatorioClient(blob, tipo) {
  const formData = new FormData();
  formData.append("relatorioCliente", blob, "relatorio.pdf")
  formData.append("tipo", tipo);

  try {
    const resposta = await fetch("http://localhost:5000/aws/relatorioClient", {
      method: "POST",
      body: formData
    });

    if (!resposta.ok) {
      throw new Error("Erro ao enviar relatório para a aws" + resposta.status)
    }
  } catch (erro) {
    console.error("Erro ao enviar relatório:", erro);
    Swal.fire('Erro!', 'Erro ao enviar relatório', 'error')
  }
}

async function visualizarHistorico() {
  try {
    const resposta = await fetch("http://localhost:5000/aws/visualizarHistorico", {
      method: "GET",
      headers: { "Content-Type": "application/json"}
    });

    if (!resposta.ok) {
      throw new Error("Erro ao visualizar histórico")
    }

    var dados = await resposta.json()

    const slt = document.getElementById('select_relatorio');
    dados.forEach((options) => {
      var option = document.createElement("option");
      option.value = options;
      option.textContent = options;
      slt.appendChild(option)
    })
    
    console.log("estou no visualizarHistorico")
    console.log(resposta)
  } catch (erro) {
    console.error(erro)
  }
}

async function baixarHistorico(relatorioNome) {
  try {
    const resposta = await fetch(`http://localhost:5000/aws/baixarHistorico/${relatorioNome}`, {
      method: "GET",
      headers: {"Content-Type": "application/pdf"}
    });

    if (!resposta.ok) {
      throw new Error("Erro ao baixar histórico")
    }
    console.log("Estou no baixar histórico")
    console.log(resposta)

    const blob = await resposta.blob()

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${relatorioNome}`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (erro) {
    console.error(erro)
  }
}
 
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


    
        