const ctxRAM = document.getElementById('ramChart').getContext('2d');

const dataRAM = {
    labels: ['18:35', '18:35', '18:35', '18:35', '18:35', '18:35'],
    datasets: [{
        label: 'Uso da RAM',
        data: [50, 60, 60, 45, 100, 80],
        borderColor: '#000000',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: '#000000',
        pointRadius: 5,
        tension: 0.3
    }]
};

const configRAM = {
    type: 'line',
    data: dataRAM,
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
                ticks: { color: 'black', font: { size: 12 } }
            },
            x: {
                ticks: { color: 'black', font: { size: 12 } }
            }
        }
    }
};

new Chart(ctxRAM, configRAM);