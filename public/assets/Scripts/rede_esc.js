const ctxRede_Esc = document.getElementById('redeChart-esc').getContext('2d');


const dataRede_Esc = {
    value: 79,
    max: 100,
    label: "Taxa de Leitura"
};

const configRede_Esc = {
    type: 'doughnut',
    data: {
        labels: [dataRede_Esc.label],
        datasets: [{
            data: [dataRede_Esc.value, dataRede_Esc.max - dataRede_Esc.value],
            backgroundColor: ['#011F27', '#FFFCFC'],
            borderWidth: 5,
            borderColor: '#011F27'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        rotation: -90,
        circumference: 180,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
    }
};

new Chart(ctxRede_Esc, configRede_Esc);