const ctxCargos = document.getElementById('graficoCargos').getContext('2d');

const dataCargo = {
    labels: ['', '', ''],
    datasets: [{
        label: ['Engenheiro de Manutenção', "Analista de Sistemas", "Gerente de Fábrica"],
        data: [10, 6, 4],
        backgroundColor: ['#011F27', '#A9A9A9', '#04708D'], 
        borderRadius: 8, 
        barThickness: 40, 
        borderWidth: 2
    }]
};

const configCargo = {
    type: 'bar',
    data: dataCargo,
    options: {
        indexAxis: 'y', 
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 18
                    },
                    color: "#333"
                },
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    font: {
                        size: 18
                    },
                    color: "#333",
                    display: false 
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const cargos = ['Engenheiro de Manutenção', 'Analista de Sistemas', 'Gerente de Fábrica'];
                        return `${cargos[context.dataIndex]}: ${context.raw}`;
                    }
                }
            },
            legend: {
                display: false 
            }
        }
    }
};

new Chart(ctxCargos, configCargo);
