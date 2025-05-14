const ctxServer = document.getElementById('serverChart').getContext('2d');

const dataServer = {
    labels: ['Ativos', 'Inativos'],
    datasets: [{
        label: 'Quantidade de Servidores',
        data: [8, 3], 
        backgroundColor: ['lightgreen', '#FF0000'], 
        borderColor: 'black',
        borderWidth: 2
    }]
};

const configServer = {
    data: dataServer,
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: 'white', font: { size: 20 } }
            },
            x: {
                ticks: { color: 'white', font: { size: 20 } }
            }
        }
    }
};

new Chart(ctxServer, configServer); 