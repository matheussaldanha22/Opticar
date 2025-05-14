const componentesProblema = {
    cpu: 3,
    ram: 1,
    disco: 0
};

const seletorComponente = document.getElementById("seletorComponente");
const spanQuantidade = document.getElementById("quantidadeProblemas");

// Função para atualizar o valor exibido na segunda KPI
function atualizarQuantidadeProblemas() {
    const componenteSelecionado = seletorComponente.value;
    const quantidade = componentesProblema[componenteSelecionado];
    
    spanQuantidade.textContent = quantidade !== undefined ? quantidade : "--";
}

//opçoes
seletorComponente.addEventListener("change", atualizarQuantidadeProblemas);

// Inicialização ao carregar a página
document.addEventListener("carregar", atualizarQuantidadeProblemas);