package br.com.sptech.school;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main implements RequestHandler<S3Event, String> {


    // Criação do cliente S3 para acessar os buckets
    private final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
    private static final Log log = LogFactory.getLog(Main.class);
    // Bucket de destino para o CSV gerado
    private static final String DESTINATION_BUCKET = "s3-trusted-opticar";


    @Override
    public String handleRequest(S3Event s3Event, Context context) {
        LambdaLogger logger = context.getLogger();

        // Extraímos o nome do bucket de origem e a chave do arquivo JSON
        String sourceBucket = s3Event.getRecords().get(0).getS3().getBucket().getName();
        String sourceKey = s3Event.getRecords().get(0).getS3().getObject().getKey();

        context.getLogger().log("Evento recebido: " + s3Event.toString());
        context.getLogger().log("Bucket de origem: " + sourceBucket);
        context.getLogger().log("Chave do arquivo: " + sourceKey);

            // Leitura do arquivo JSON do bucket de origem
            InputStream s3InputStream = s3Client.getObject(sourceBucket, sourceKey).getObjectContent();
            List<Transacao> transacoesLimpa;
            List<TransacaoJsonDTO> transacoesSuja;

            try {
                Mapper mapper = new Mapper();
                transacoesSuja = mapper.map(s3InputStream);
                transacoesLimpa = new ArrayList<>();
            }
             catch (Exception e) {
                context.getLogger().log("Erro: " + e.getMessage());
                return "Erro no processamento";
            }

            context.getLogger().log("Erro: " + transacoesLimpa);

            for (TransacaoJsonDTO transacao : transacoesSuja) {
                transacoesLimpa.add(TransacaoMapper.toTransacao(transacao));
            }


            List<Transacao> lista = new ArrayList<>();
            List<String> anos = new ArrayList<>();

            for (Transacao transacao : transacoesLimpa) {
                Transacao transacaoBase = new Transacao();
                if(!anos.contains(transacao.getAno())) {
                    anos.add(transacao.getAno());
                }

                transacaoBase.setAno(transacao.getAno());
                transacaoBase.setMes(transacao.getMes());
                transacaoBase.setQuantidade(transacao.getQuantidade());
                transacaoBase.setValor(transacao.getValor());

                lista.add(transacaoBase);
            }

            List<Transacao> envio = new ArrayList<>();
            for (String ano : anos) {
                for (Transacao tr : lista) {
                    if(tr.getAno().equals(ano)) {
                        envio.add(tr);
                    }
                }
                formatarEnvio(envio);
                envio.clear();
            }
            return "Sucesso no processamento";
    }

    public void formatarEnvio(List<Transacao> lista) {
        List<String> meses = new ArrayList<>();
        for(Transacao transacao : lista) {
            if(!meses.contains(transacao.getMes())) {
                meses.add(transacao.getMes());
            }
        }

        String nomeEnviado;
        String json;

            
        for(String mes : meses) {
            List<Transacao> envio = new ArrayList<>();
            Gson gson = new Gson();
            InputStream ipt;
            for(Transacao tr : lista) {
                if(tr.getMes().equals(mes)) {
                    envio.add(tr);
                }
            }


            nomeEnviado = "%s/%s/data.json".formatted(envio.get(0).getAno(), mes);

            json = gson.toJson(envio);
            ipt = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
            s3Client.putObject(DESTINATION_BUCKET, nomeEnviado, ipt, null);

            envio.clear();
        }
    }
}