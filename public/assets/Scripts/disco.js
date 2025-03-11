const ctxDisco = document.getElementById('discoChart').getContext('2d');
const valor = document.getElementById('id_valor-disc');

const gradient_blue = ctxDisco.createLinearGradient(0, 0, 0, 300);
gradient_blue.addColorStop(0, "#012027");
gradient_blue.addColorStop(1, "#04708D");

const gradient_red = ctxDisco.createLinearGradient(0, 0, 0, 300);
gradient_red.addColorStop(0, "#893627");
gradient_red.addColorStop(1, "#991700");

var data = [30, 70];

const dataDisco = {
    datasets: [{
        data: data,
        backgroundColor: [gradient_red, gradient_blue],
        borderWidth: 0
    }],
    value: data[0]
}

const configDisco = {
type: 'doughnut',
    data: dataDisco,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
}

valor.innerHTML = "<span>"+dataDisco.value+"</span>" + "%";

new Chart(ctxDisco, configDisco);