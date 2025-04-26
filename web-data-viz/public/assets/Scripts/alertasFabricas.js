const ctxFabrica = document.getElementById('fabricaChart').getContext('2d');

const dataFabrica = {
    labels: ['FB-01', 'FB-02', 'FB-03', 'FB-04', 'FB-05', 'FB-06'],
    datasets: [{
        label: 'Uso da CPU',
        data: [50, 60, 60, 45, 100, 80],
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
                beginAtZero: false,
                suggestedMin: 30,
                suggestedMax: 100,
                ticks: { color: 'white', font: { size: 12 } }
            },
            x: {
                ticks: { color: 'white', font: { size: 12 } }
            }
        }
    }
};

new Chart(ctxFabrica, configFabrica);