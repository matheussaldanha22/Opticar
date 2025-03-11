function calcular() {
    let downtime = Number(document.getElementById('ipt_downtime').value) || 0;
    let custoHoraDownTime = Number(document.getElementById('ipt_custoHoraDownTime').value) || 0;
    let custoManutencaoCorretiva = Number(document.getElementById('ipt_custoManutencaoCorretiva').value) || 0;
    
    let custoAnualDowntime = downtime * custoHoraDownTime * 12;
    let custoTotalCorretiva = custoAnualDowntime + custoManutencaoCorretiva;

    let economiaDowntime = (custoAnualDowntime * 0.62).toFixed(2);
    let economiaHardware = (custoManutencaoCorretiva * 0.30).toFixed(2);
    let totalEconomia = (parseFloat(economiaDowntime) + parseFloat(economiaHardware)).toFixed(2);

    let investimentoMensal = 2000;  // Valor fixo do serviço
    let custoComMonitoramento = (investimentoMensal * 12).toFixed(2);
    let custoFinal = (custoTotalCorretiva - totalEconomia + parseFloat(custoComMonitoramento)).toFixed(2);
    let diferencaTotal = (custoTotalCorretiva - custoFinal).toFixed(2);
    // ROI = (receita (Receita gerada pelo investimento) - custo (custo do investimento)) / custo (custo do investimento) - Deve retornar em percentagem
    let roi = (((totalEconomia / custoComMonitoramento) / 100)*100).toFixed(2);

    let economiaPercentual = ((diferencaTotal / custoTotalCorretiva) * 100).toFixed(2);

    document.getElementById('div_resultado').innerHTML = `
        <p class="economia"><strong>Economia com o monitoramento OptiCar:</strong></p>
        <div class="alinhar"><p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M2.047 14.668a.994.994 0 0 0 .465.607l1.91 1.104v2.199a1 1 0 0 0 1 1h2.199l1.104 1.91a1.01 1.01 0 0 0 .866.5c.174 0 .347-.046.501-.135L12 20.75l1.91 1.104a1.001 1.001 0 0 0 1.366-.365l1.103-1.91h2.199a1 1 0 0 0 1-1V16.38l1.91-1.104a1 1 0 0 0 .365-1.367L20.75 12l1.104-1.908a1 1 0 0 0-.365-1.366l-1.91-1.104v-2.2a1 1 0 0 0-1-1H16.38l-1.103-1.909a1.008 1.008 0 0 0-.607-.466.993.993 0 0 0-.759.1L12 3.25l-1.909-1.104a1 1 0 0 0-1.366.365l-1.104 1.91H5.422a1 1 0 0 0-1 1V7.62l-1.91 1.104a1.003 1.003 0 0 0-.365 1.368L3.251 12l-1.104 1.908a1.009 1.009 0 0 0-.1.76zM12 13c-3.48 0-4-1.879-4-3 0-1.287 1.029-2.583 3-2.915V6.012h2v1.109c1.734.41 2.4 1.853 2.4 2.879h-1l-1 .018C13.386 9.638 13.185 9 12 9c-1.299 0-2 .515-2 1 0 .374 0 1 2 1 3.48 0 4 1.879 4 3 0 1.287-1.029 2.583-3 2.915V18h-2v-1.08c-2.339-.367-3-2.003-3-2.92h2c.011.143.159 1 2 1 1.38 0 2-.585 2-1 0-.325 0-1-2-1z"></path></svg> Economia anual com Downtime: <span class="economia">R$ ${economiaDowntime}</span></p></div>
        <div class="alinhar"><p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M2.047 14.668a.994.994 0 0 0 .465.607l1.91 1.104v2.199a1 1 0 0 0 1 1h2.199l1.104 1.91a1.01 1.01 0 0 0 .866.5c.174 0 .347-.046.501-.135L12 20.75l1.91 1.104a1.001 1.001 0 0 0 1.366-.365l1.103-1.91h2.199a1 1 0 0 0 1-1V16.38l1.91-1.104a1 1 0 0 0 .365-1.367L20.75 12l1.104-1.908a1 1 0 0 0-.365-1.366l-1.91-1.104v-2.2a1 1 0 0 0-1-1H16.38l-1.103-1.909a1.008 1.008 0 0 0-.607-.466.993.993 0 0 0-.759.1L12 3.25l-1.909-1.104a1 1 0 0 0-1.366.365l-1.104 1.91H5.422a1 1 0 0 0-1 1V7.62l-1.91 1.104a1.003 1.003 0 0 0-.365 1.368L3.251 12l-1.104 1.908a1.009 1.009 0 0 0-.1.76zM12 13c-3.48 0-4-1.879-4-3 0-1.287 1.029-2.583 3-2.915V6.012h2v1.109c1.734.41 2.4 1.853 2.4 2.879h-1l-1 .018C13.386 9.638 13.185 9 12 9c-1.299 0-2 .515-2 1 0 .374 0 1 2 1 3.48 0 4 1.879 4 3 0 1.287-1.029 2.583-3 2.915V18h-2v-1.08c-2.339-.367-3-2.003-3-2.92h2c.011.143.159 1 2 1 1.38 0 2-.585 2-1 0-.325 0-1-2-1z"></path></svg> Economia anual com Hardware: <span class="economia">R$ ${economiaHardware}</span></p></div>
        <div class="alinhar"><p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M11.488 21.754c.294.157.663.156.957-.001 8.012-4.304 8.581-12.713 8.574-15.104a.988.988 0 0 0-.596-.903l-8.05-3.566a1.005 1.005 0 0 0-.813.001L3.566 5.747a.99.99 0 0 0-.592.892c-.034 2.379.445 10.806 8.514 15.115zM8.674 10.293l2.293 2.293 4.293-4.293 1.414 1.414-5.707 5.707-3.707-3.707 1.414-1.414z"></path></svg> <strong>Total economizado:</strong> <span class="economia">R$ ${totalEconomia}</span></p></div>
        <div class="alinhar"><p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="m10 10.414 4 4 5.707-5.707L22 11V5h-6l2.293 2.293L14 11.586l-4-4-7.707 7.707 1.414 1.414z"></path></svg> <strong>ROI estimado:</strong> <span class="economia">${roi}%</span></p></div>
    `;

    document.getElementById('div_comparativo').innerHTML = `
        <h3>Comparação: Sem Monitoramento vs Com Monitoramento OptiCar</h3>
        <table>
            <tr>
                <th></th>
                <th>Manutenção Corretiva</th>
                <th>Monitoramento Preventivo</th>
                <th>Diferença</th>
                <th>% Economia</th>
            </tr>
            <tr>
                <td><strong>Gasto com Downtime (anual)</strong></td>
                <td>R$ ${custoAnualDowntime.toFixed(2)}</td>
                <td>R$ ${(custoAnualDowntime - economiaDowntime).toFixed(2)}</td>
                <td class="positivo">- R$ ${economiaDowntime}</td>
                <td class="positivo">${((economiaDowntime / custoAnualDowntime) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td><strong>Gasto com Hardware (anual)</strong></td>
                <td>R$ ${custoManutencaoCorretiva.toFixed(2)}</td>
                <td>R$ ${(custoManutencaoCorretiva - economiaHardware).toFixed(2)}</td>
                <td class="positivo">- R$ ${economiaHardware}</td>
                <td class="positivo">${((economiaHardware / custoManutencaoCorretiva) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td><strong>Investimento Anual</strong></td>
                <td>-</td>
                <td>R$ ${custoComMonitoramento}</td>
                <td class="negativo">+ R$ ${custoComMonitoramento}</td>
                <td>-</td>
            </tr>
            <tr>
                <td><strong>Custo Total (anual)</strong></td>
                <td><strong>R$ ${custoTotalCorretiva.toFixed(2)}</strong></td>
                <td><strong>R$ ${custoFinal}</strong></td>
                <td class="positivo"><strong>- R$ ${diferencaTotal}</strong></td>
                <td class="positivo"><strong>${economiaPercentual}%</strong></td>
            </tr>
        </table>
    `;

    document.getElementById('div_comparativo').style.display = 'block';
    document.getElementById('div_beneficios').style.display = 'block';
}