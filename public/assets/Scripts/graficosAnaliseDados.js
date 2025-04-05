//PLOTAR GRAF CPU
const ctxCPU = document.getElementById('cpuChart').getContext('2d');

const dataCPU = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho','Agosto','Setembro','Novembro','Dezembro'],
    datasets: [{
        label: 'Uso da CPU',
        data: [50, 60, 60, 45, 100, 80,50,60,23,55,12,55],
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
        data: [90, 70, 50, 40],
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
