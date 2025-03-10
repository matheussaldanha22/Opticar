const ctxCPU = document.getElementById('cpuChart').getContext('2d');

const dataCPU = {
    labels: ['18:35', '18:35', '18:35', '18:35', '18:35', '18:35'],
    datasets: [{
        label: 'Uso da CPU',
        data: [50, 60, 60, 45, 100, 80],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: '#FFFFFF',
        pointRadius: 5,
        tension: 0.3
    }]
};

const configCPU = {
    type: 'line',
    data: dataCPU,
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

new Chart(ctxCPU, configCPU);