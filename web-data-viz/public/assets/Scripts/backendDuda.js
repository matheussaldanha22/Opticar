const switchModal = () => {
    const modal = document.querySelector('.modal')
    const actualStyle = modal.style.display
    if(actualStyle == 'block'){
        modal.style.display == 'none'
    }else{
        modal.style.display = 'block'
    }
}

const button = document.querySelector('.iconeFiltro')
button.addEventListener('click', switchModal)

window.onclick = function(event){
    const modal = document.querySelector('.modal')
    if(event.target == modal){
        switchModal()
    }
}


function listarServidores() {
    const servidores = JSON.parse(sessionStorage.SERVIDORES); 
    for (let i = 0; i < servidores.length; i++) {
        const idServidor = servidores[i].idMaquina;
        
        document.getElementById('slt_servidor').innerHTML += `<option value="${idServidor}">SV${idServidor}</option>`
                            
    }
}
listarServidores()


function listarMes(){
    fetch('/alertas/listarMes', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
    }).then((resultado) => {
       resultado.json().then((json) =>{
        alertaMes = json

        for (let i = 0; i < alertaMes.length; i++) {
            const mes = alertaMes[i].mes;
            const ano = alertaMes[i].ano;

            document.getElementById('slt_mes').innerHTML += `<option value="${mes}/${ano}"> ${mes}/${ano}</option>`
            
        }
       })
    })
}

listarMes()


