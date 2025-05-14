const ctxFabrica = document.getElementById('fabricaChart').getContext('2d');

const dataFabrica = {
    labels: ['FB-Sul', 'FB-Norte'],
    datasets: [{
        label: 'Alertas',
        data: [5, 8],
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: '#FFFFFF',
        pointRadius: 5,
        tension: 0.3
    }]
};

const configFabrica = {
    type: 'bar',
    data: dataFabrica,
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        scales: {
            y: {
                beginAtZero: true, // começa em 0
                ticks: { color: 'white', font: { size: 12 } }
            },
            x: {
                ticks: { color: 'white', font: { size: 12 } }
            }
        }
    }
};

new Chart(ctxFabrica, configFabrica);