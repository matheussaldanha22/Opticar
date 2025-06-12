package org.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.nio.charset.StandardCharsets;

public class CSVparaJSONLambda implements RequestHandler<S3Event, String> {

    private final S3Client s3 = S3Client.create();

    @Override
    public String handleRequest(S3Event event, Context context) {
        try {
            // Info do arquivo recebido
            String bucketName = event.getRecords().get(0).getS3().getBucket().getName();
            String key = event.getRecords().get(0).getS3().getObject().getUrlDecodedKey();

            // 1. Ler CSV do S3
            String csvContent = readCSVFromS3(bucketName, key);

            // 2. Converter para JSON
            String jsonContent = convertCSVtoJSON(csvContent);

            // 3. Escrever JSON em outro bucket (ex: trusted)
            String fileName = key.substring(key.lastIndexOf("/") + 1).replace(".csv", ".json");


            writeJSONToS3("opticar-trusted", "previsao/" + fileName, jsonContent);
            return "Transformação concluída: ";

        } catch (Exception e) {
            e.printStackTrace();
            return "Erro: " + e.getMessage();
        }
    }

    private String readCSVFromS3(String bucket, String key) throws IOException {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
        InputStream inputStream = s3.getObject(getObjectRequest);
        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }

    private void writeJSONToS3(String bucket, String key, String content) {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("application/json")
                .build();
        s3.putObject(putRequest, RequestBody.fromString(content));
    }

    private String convertCSVtoJSON(String csv) {
        String[] linhas = csv.split("\n");
        String[] cabecalhos = linhas[0].trim().split(",");
        JSONArray jsonArray = new JSONArray();

        for (int i = 1; i < linhas.length; i++) {
            String[] valores = linhas[i].trim().split(",");
            if (valores.length != cabecalhos.length) continue;
            JSONObject obj = new JSONObject();
            for (int j = 0; j < cabecalhos.length; j++) {
                obj.put(cabecalhos[j], valores[j]);
            }
            jsonArray.put(obj);
        }
        return jsonArray.toString(2);
    }
}
