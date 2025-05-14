const alertas = {
    graves: { resolvidos: 7, total: 10 },
    moderados: { resolvidos: 18, total: 20 }
};

// os tipo
const eficienciaGraves = Math.round((alertas.graves.resolvidos / alertas.graves.total) * 100);
const eficienciaModerados = Math.round((alertas.moderados.resolvidos / alertas.moderados.total) * 100);

// valor do geral 
const totalResolvidos = alertas.graves.resolvidos + alertas.moderados.resolvidos;
const totalAlertas = alertas.graves.total + alertas.moderados.total;
const eficienciaGeral = Math.round((totalResolvidos / totalAlertas) * 100);

//na pagina
document.getElementById("eficienciaGeral").textContent = `${eficienciaGeral}%`;
document.getElementById("eficienciaGraves").textContent = `${eficienciaGraves}%`;
document.getElementById("eficienciaModerados").textContent = `${eficienciaModerados}%`;

// Eficiência Geral
const eficienciaGeralcor = document.getElementById("eficienciaGeral");
if (eficienciaGeral >= 80) {
    eficienciaGeralcor.style.color = "rgb(3, 116, 7)"; 
} else if (eficienciaGeral >= 50) {
    eficienciaGeralcor.style.color = "rgb(147, 132, 3)"; 
} else {
    eficienciaGeralcor.style.color = "rgb(147, 3, 3)"; 
}
eficienciaGeralcor.style.fontWeight = "bold";

// Eficiência Graves
const eficienciaGravescor = document.getElementById("eficienciaGraves");
if (eficienciaGraves >= 80) {
    eficienciaGravescor.style.color = "rgb(3, 116, 7)"; 
} else if (eficienciaGraves >= 50) {
    eficienciaGravescor.style.color = "rgb(147, 132, 3)"; 
} else {
    eficienciaGravescor.style.color = "rgb(147, 3, 3)"; 
}
eficienciaGravescor.style.fontWeight = "bold";

// Eficiência Atenção
const eficienciaModeradoscor = document.getElementById("eficienciaModerados");
if (eficienciaModerados >= 80) {
    eficienciaModeradoscor.style.color = "rgb(3, 116, 7)"; 
} else if (eficienciaModerados >= 50) {
    eficienciaModeradoscor.style.color = "rgb(147, 132, 3)"; 
} else {
    eficienciaModeradoscor.style.color = "rgb(147, 3, 3)"; 
}
eficienciaModeradoscor.style.fontWeight = "bold";
