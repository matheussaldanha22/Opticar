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


        //----------------------------------------------------------------------------------------

        // Gráfico de Linha - Previsão de Gastos com CPU
var lineOptions = {
    series: [{
        name: 'Gastos com CPU',
        data: [7500, 12000, 12000, 12000, 9000, 7000, 15000]
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
    colors: ['#14589c'],
    dataLabels: { enabled: false },
    stroke: {
        curve: 'smooth',
        width: 3,
        dashArray: 6 // 👈 isso torna a linha pontilhada
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
        categories: ['Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Janeiro'],
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








         //----------------------------------------------------------------------------------------


        // Gráfico de Barras Empilhadas - Alertas Resolvidos vs Não Resolvidos por Dia

var barOptions = {
    series: [{
        name: 'Alertas totais',
        data: [6, 12, 5, 10, 7]  // mocado dps desmoca
    }, {
        name: 'Não Resolvidos',
        data: [3, 2, 3, 2, 2]  // mema coisa
        
    }],
    chart: {
        type: 'bar',
        height: 280,
        stacked: true,
        toolbar: { show: false },
        fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif'
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '50%',
            borderRadius: 3
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '13px'
        }
    },
    colors: ["#2D3748", "#E53E3E", "#3182CE", "#805AD5"],
    xaxis: {
        categories: ['20/05', '21/05', '22/05', '23/05', '24/05'], // mocado, NO fetch desmoca
        labels: {
            style: {
                colors: '#666',
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        title: {
            text: 'Quantidade de Alertas',
            style: {
                color: '#666',
                fontSize: '12px'
            }
        },
        labels: {
            style: {
                colors: '#666',
                fontSize: '12px'
            }
        }
    },
    tooltip: {
        y: {
            formatter: val => val + " alertas"
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'center',
        labels: {
            colors: '#666'
        }
    },
    fill: {
        opacity: 1
    }
};





//grafico de barras
// Faz a requisição e atualiza os dados no gráfico

//################################################################################# por função

var grafico = null;
function carregarComponente(componente) {
    componenteAtual = componente;

    fetch(`http://localhost:3333/gestorInfra/dados-${componente.toUpperCase()}`)
        .then(res => res.json())
        .then(dados => {
            if (grafico !== null) {
                grafico.destroy();
            }

            barOptions.series = [
                { name: 'Alertas totais', data: dados.totais.slice(-5) },
                { name: 'Não Resolvidos', data: dados.toDos.slice(-5) },
                { name: 'Resolvidos', data: dados.Done.slice(-5) },
                { name: 'Em progresso', data: dados.InProgress.slice(-5) }
            ];
            barOptions.xaxis.categories = dados.categorias;

            grafico = new ApexCharts(document.querySelector("#bar-chart"), barOptions);
            grafico.render();
        })
        .catch(err => {
            console.error("Erro ao carregar dados do gráfico:", err);
        });

    
    
}


//############################################################################# por função



function atualizarServidorComMaisCriticos(componente) {
    fetch(`http://localhost:3333/gestorInfra/servidor-com-mais-criticos/${componente.toLowerCase()}`)//o lower, pq sem ta dando bo
        .then(res => res.json())
        .then(data => {
            document.querySelector(".textovalor2").textContent = data.mensagem;
        })
        .catch(err => {
            console.error(`Erro ao obter servidor com mais alertas críticos (${componente}):`, err);
        });
}


var componenteAtual = 'CPU'; // Começa com CPU

window.addEventListener('DOMContentLoaded', () => {
    carregarComponente(componenteAtual);
    atualizarServidorComMaisCriticos(componenteAtual); // Atualiza dependendo do jhonis
    
    setInterval(() => {
        carregarComponente(componenteAtual);
        atualizarServidorComMaisCriticos(componenteAtual);
    }, 9000);
});



// PRATROCAR O JHONIS de cima 
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        componenteAtual = tab.textContent.trim(); // Atualiza variável pra deixar o comp
        carregarComponente(componenteAtual);
        atualizarServidorComMaisCriticos(componenteAtual);
    });
});















   

         //----------------------------------------------------------------------------------------


         

        // Gráfico Gauge - Precisão do preço de CPU
        var gaugeOptions = {
            series: [67],
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
            stroke: {
                lineCap: 'round'
            },
            labels: ['precisão de']
        };

        
        new ApexCharts(document.querySelector("#line-chart"), lineOptions).render();
    
        new ApexCharts(document.querySelector("#gauge-chart"), gaugeOptions).render();
    });