
    const ctx = document.getElementById('graficoCargos').getContext('2d');

    // Definição dos dados
    const dadosCargos = [1, 2, 3, 8]; 

    // total de funci
    const total = dadosCargos.reduce((acc, val) => acc + val, 0);
    document.getElementById('totalCargos').textContent = total;


    //  gráfico
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Gestor(es) Fabrica', 'Analista(s) de dados', 'Engenheiro(s) Manutenção', 'Operador(es) de maquina'],
            datasets: [{
                label: 'Funcionários',
                data: dadosCargos,
                backgroundColor: ['#D9D9D9', '#D9D9D9', '#D9D9D9','#D9D9D9' ]
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Define a cor da label "Cargos"
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        font: {
                            size: 13// Tamanho da fonte do eixo Y
                        }
                    }
                },
                y: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 13 // Tamanho da fonte do eixo Y
                        }
                    }
                }
            }
        }
    });





























