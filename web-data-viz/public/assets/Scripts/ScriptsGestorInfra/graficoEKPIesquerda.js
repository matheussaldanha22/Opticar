  // Gráfico de Barras Empilhadas - Alertas Resolvidos vs Não Resolvidos por Dia

var barOptions = {
    series: [{
        name: 'Alertas totais',
        data: [6, 12, 5, 10, 7]  // mocado dps desmoca
    }, {
        name: 'Não Resolvidos',
        data: [3, 2, 3, 2, 2]  // mema coisa
        
    }],
    chart: {
        type: 'bar',
        height: 280,
        stacked: true,
        toolbar: { show: false },
        fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif'
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '50%',
            borderRadius: 3
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '13px'
        }
    },
    colors: ["#011F4B", "#E53E3E", "#0077B6", "#805AD5"],
    xaxis: {
        categories: ['20/05', '21/05', '22/05', '23/05', '24/05'], // mocado, NO fetch desmoca
        labels: {
            style: {
                colors: '#666',
                fontSize: '12px'
            }
        }
    },
    yaxis: {
        title: {
            text: 'Quantidade de Alertas',
            style: {
                color: '#666',
                fontSize: '12px'
            }
        },
        labels: {
            style: {
                colors: '#666',
                fontSize: '12px'
            }
        }
    },
    tooltip: {
        y: {
            formatter: val => val + " alertas"
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'center',
        labels: {
            colors: '#666'
        }
    },
    fill: {
        opacity: 1
    }
};





//grafico de barras
// Faz a requisição e atualiza os dados no gráfico

//################################################################################# por função

var grafico = null;
function carregarComponente(componente) {
    componenteAtual = componente;

    fetch(`http://localhost:3333/gestorInfra/dados-${componente.toUpperCase()}`)
        .then(res => res.json())
        .then(dados => {
            if (grafico !== null) {
                grafico.destroy();
            }

            barOptions.series = [
                { name: 'Alertas totais', data: dados.totais.slice(-5) },
                { name: 'Não Resolvidos', data: dados.toDos.slice(-5) },
                { name: 'Resolvidos', data: dados.Done.slice(-5) },
                { name: 'Em progresso', data: dados.InProgress.slice(-5) }
            ];
            barOptions.xaxis.categories = dados.categorias;

            grafico = new ApexCharts(document.querySelector("#bar-chart"), barOptions);
            grafico.render();
        })
        .catch(err => {
            console.error("Erro ao carregar dados do gráfico:", err);
        });

    
    
}


//############################################################################# por função



function atualizarServidorComMaisCriticos(componente) {
    fetch(`http://localhost:3333/gestorInfra/servidor-com-mais-criticos/${componente.toLowerCase()}`)//o lower, pq sem ta dando bo
        .then(res => res.json())
        .then(data => {
            document.querySelector(".textovalor2").textContent = data.mensagem;
        })
        .catch(err => {
            console.error(`Erro ao obter servidor com mais alertas críticos (${componente}):`, err);
        });
}


var componenteAtual = 'CPU'; // Começa com CPU

window.addEventListener('DOMContentLoaded', () => {
    carregarComponente(componenteAtual);
    atualizarServidorComMaisCriticos(componenteAtual); // Atualiza dependendo do jhonis
    
    setInterval(() => {
        carregarComponente(componenteAtual);
        atualizarServidorComMaisCriticos(componenteAtual);
    }, 9000);
});



// PRATROCAR O JHONIS de cima 
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        componenteAtual = tab.textContent.trim(); // Atualiza variável pra deixar o comp
        carregarComponente(componenteAtual);
        atualizarServidorComMaisCriticos(componenteAtual);
    });
});

new ApexCharts(document.querySelector("bar-chart"), barOptions).render();

