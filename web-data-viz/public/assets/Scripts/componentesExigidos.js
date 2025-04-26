const ctxComponente = document.getElementById('componenteChart').getContext('2d');


const dataComponente = {
    labels: ['CPU', 'RAM', 'REDE'],
        datasets: [{
            data: [77, 40, 20],
            backgroundColor: [
                '#01232D',  
                '#04708D',  
                '#A9A9A9'   
            ],
        }]
};

const configComponentes = {
    type: 'pie',
    data: dataComponente,
    options: {
        responsive: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
}
new Chart(ctxComponente, configComponentes)