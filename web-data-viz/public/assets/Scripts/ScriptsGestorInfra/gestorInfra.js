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
                width: 3
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


        // Gráfico de Barras - Alertas
        var barOptions = {
            series: [{
                name: 'Alertas',
                data: [20, 10, 11]
            }],
            chart: {
                type: 'bar',
                height: 280,
                toolbar: { show: false },
                fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    
                    columnWidth: '55%',
                    borderRadius: 1,
                    dataLabels: { position: 'top' }
                }
            },
            colors: ['yellow', 'orange' , 'red'],
            dataLabels: {
                enabled: true,
                formatter: val => val,
                offsetY: -28,
                style: {
                    fontSize: '17px',
                    colors: ["#333"]
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
                categories: ['Leves', 'Moderados', 'Criticos'],
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
                    text: 'Número de alertas',
                    style: {
                        color: '#666',
                        fontSize: '12px',
                        fontWeight: 400
                    }
                },
                labels: {
                    style: {
                        colors: '#666',
                        fontSize: '12px'
                    }
                },
                min: 0,
                max: 25
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    type: "vertical",
                    shadeIntensity: 0.3,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 90, 100]
                }
            },
            tooltip: {
                y: {
                    formatter: val => val + " alertas"
                }
            }
        };




         //----------------------------------------------------------------------------------------


         

        // Gráfico Gauge - Precisão do preço de CPU
        var gaugeOptions = {
            series: [67],
            chart: {
                height: 250,
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
            labels: ['Acertividade no preço']
        };

        
        new ApexCharts(document.querySelector("#line-chart"), lineOptions).render();
        new ApexCharts(document.querySelector("#bar-chart"), barOptions).render();
        new ApexCharts(document.querySelector("#gauge-chart"), gaugeOptions).render();
    });