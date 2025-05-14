// BARRA LATERAL
function expand(){
    if(div_menu.classList.contains('menu-expand')){
        div_menu.style.animation = 'diminui 0.2s linear';

    }else{
        div_menu.style.animation = 'expandir 0.2s linear';

    }
    div_menu.classList.toggle('menu-expand')
    ul_links.classList.toggle('nav-links-expanded')
}

//MODAL FILTRAR
function abrirModal(componente){
    Swal.fire({
title: `Filtrar gráfico <u style="color:#2C3E50;">${componente}</u>`,
html: `
    <div class="modal-test">
        <div class="containerPeriodo">
            <h3>Escolha o período especifico:</h3>
            <p class="labelSlt"><b>De:</b> <input type="text" class="iptFiltrar" placeholder="Ex:10/10/2023"></p>
            <p class="labelSlt"><b>Até:</b><input type="text" class="iptFiltrar" placeholder="Ex:10/10/2023"></p>
           
        </div>

        <div class="containerVisualizacao">
            <h3>Mudar visualização</h3>
            <p class="labelSlt"><b>Visualização em:
                <select name="" id="sltFiltrar">
                    <option value="">Geral (Média aos anos)</option>
                    <option value="">Anual (Média aos meses)</option>
                </select></b>
            </p>

        </div>
  </div>
`,
showCancelButton: true,
cancelButtonText: "Fechar",
customClass: "alertaModal",
confirmButtonColor: '#2C3E50',
})
}

//PLOTAR GRAF CPU
const ctxCPU = document.getElementById('cpuChart').getContext('2d');

const dataCPU = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho','Agosto','Setembro','Novembro','Dezembro'],
    datasets: [
        {
            label: 'Uso da CPU',
            data: [50, 60, 60, 45, 100, 80,50,60,23,55,12,55],
            borderColor: '#FFFFFF',
            borderWidth: 2,
            fill: false,
            pointBackgroundColor: '#FFFFFF',
            pointRadius: 5,
            tension: 0.3
        },
        {
            label: 'Alerta',
            data: Array(12).fill(50), // linha parametro
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
        }
    ]
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

//PLOTAR GRAF DISCO
const ctxDisco = document.getElementById('discoChart').getContext('2d');

const dataDisco = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho','Agosto','Setembro','Novembro','Dezembro'],
    datasets: [{
        label: 'Uso do Disco',
        data: [50, 60, 60, 45, 100, 80,50,60,23,55,12,55],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: '#FFFFFF',
        pointRadius: 5,
        tension: 0.3
    },
    {
        label: 'Alerta',
        data: Array(12).fill(50), // linha parametro
        borderColor: 'red',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
    }]
};

const configDisco = {
    type: 'line',
    data: dataDisco,
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

new Chart(ctxDisco, configDisco);

//PLOTAR GRAF RAM
const ctxRAM = document.getElementById('ramChart').getContext('2d');

const dataRAM = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho','Agosto','Setembro','Novembro','Dezembro'],
    datasets: [{
        label: 'Uso da RAM',
        data: [50, 60, 60, 45, 100, 80,50,60,23,55,12,55],
        borderColor: '#000000',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: '#000000',
        pointRadius: 5,
        tension: 0.3
    },
    {
        label: 'Alerta',
        data: Array(12).fill(50), // linha parametro
        borderColor: 'red',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
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

//PLOTAR GRAF REDE
const ctxRede = document.getElementById('redeChart').getContext('2d');

const dataRede = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho','Agosto','Setembro','Novembro','Dezembro'],
    datasets: [{
        label: 'Uso da Rede',
        data: [50, 60, 60, 45, 100, 80,50,60,23,55,12,55],
        borderColor: '#000000',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: '#000000',
        pointRadius: 5,
        tension: 0.3
    },
    {
        label: 'Alerta',
        data: Array(12).fill(50), // linha parametro
        borderColor: 'red',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
    }]
};

const configRede = {
    type: 'line',
    data: dataRede,
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

new Chart(ctxRede, configRede);

//PLOTAR GRAF ALERTAS
const ctx2 = document.getElementById('alertasChart');

const data2 = {
    labels: ["CPU", "RAM", "DISCO", "REDE"],
    datasets: [{
        label: "Quantidade de alertas",
        data: [30, 20, 15, 6],
        backgroundColor: ["#012027", "#04708D", "#D9D9D9", "#0084FF"],
        borderRadius: 8,
        barPercentage: 1,
        categoryPercentage: 0.5
    }]
};

const config2 = {
    type: "bar",
    data: data2,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false 
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#000", 
                    font: {
                        size: 14
                    }
                },
                grid: {
                    color: "#ddd" 
                }
            },
            x: {
                ticks: {
                    color: "#000",
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    display: false // remove linhas verticais (opcional)
                }
            }
        }
    }
};

new Chart(ctx2, config2);
