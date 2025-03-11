const ctxDisco_Esc = document.getElementById('discoChart-esc').getContext('2d');
const valor_esc_disco = document.getElementById('id_valor-esc-disco');

const dataDisco_Esc = {
    value: 79,
    max: 100,
    label: "Taxa de Leitura"
};

const configDisco_Esc = {
    type: 'doughnut',
    data: {
        labels: [dataDisco_Esc.label],
        datasets: [{
            data: [dataDisco_Esc.value, dataDisco_Esc.max - dataDisco_Esc.value],
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

valor_esc_disco.innerHTML= "<span>" + dataDisco_Esc.value + "</span>" +" MB/s" + "<br>Taxa de Escrita";
new Chart(ctxDisco_Esc, configDisco_Esc);