package br.com.sptech.school;

import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class TransacaoMapper {
    public static Transacao toTransacao(TransacaoJsonDTO transacaoSuja){
        Transacao transacao = new Transacao();

        String dataCompleta = transacaoSuja.getAnoMes();
        String ano = dataCompleta.substring(0,4);
        String mes = dataCompleta.substring(4,6);


        transacao.setValor(transacaoSuja.getValor());
        transacao.setQuantidade(transacaoSuja.getQuantidade());
        transacao.setAno(ano);
        transacao.setMes(mes);

        return transacao;

    }
}
