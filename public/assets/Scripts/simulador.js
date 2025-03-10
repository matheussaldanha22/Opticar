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
        <p><strong>Economia com o monitoramento OptiCar:</strong></p>
        <p>🔹 Economia anual com Downtime: <span class="economia">R$ ${economiaDowntime}</span></p>
        <p>🔹 Economia anual com Hardware: <span class="economia">R$ ${economiaHardware}</span></p>
        <p>✅ <strong>Total economizado:</strong> <span class="economia">R$ ${totalEconomia}</span></p>
        <p>📈 <strong>ROI estimado:</strong> <span class="economia">${roi}%</span></p>
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
                <td><strong>Gasto com Downtime</strong></td>
                <td>R$ ${custoAnualDowntime.toFixed(2)}</td>
                <td>R$ ${(custoAnualDowntime - economiaDowntime).toFixed(2)}</td>
                <td class="positivo">- R$ ${economiaDowntime}</td>
                <td class="positivo">${((economiaDowntime / custoAnualDowntime) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td><strong>Gasto com Hardware</strong></td>
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
                <td><strong>Custo Total</strong></td>
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