const ctxDisco_Ler = document.getElementById('discoChart-ler').getContext('2d');
const valor_ler_disco = document.getElementById('id_valor-ler-disco');

const dataDisco_Ler = {
    value: 50,
    max: 100,
    label: "Taxa de Leitura"
};

const configDisco_Ler = {
    type: 'doughnut',
    data: {
        labels: [dataDisco_Ler.label],
        datasets: [{
            data: [dataDisco_Ler.value, dataDisco_Ler.max - dataDisco_Ler.value],
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

valor_ler_disco.innerHTML= "<span>" + dataDisco_Ler.value + "</span>" +" MB/s" + "<br>Taxa de Leitura";
new Chart(ctxDisco_Ler, configDisco_Ler);