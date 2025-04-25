package br.com.sptech.school;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class CsvWriter {

    public ByteArrayOutputStream writeCsv(List<Monitoramento> monitoramentos) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8));

        // Definindo os headers do CSV baseado na estrutura de Monitoramento
        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                "MAC_ADDRESS", "DATA_ATUAL", "COMPONENTE", "MEDIDA", "VALOR"
        ));

        // Processar cada Monitoramento e suas leituras
        for (Monitoramento monitoramento : monitoramentos) {
            for (Monitoramento.Leitura leitura : monitoramento.getLeituras()) {
                csvPrinter.printRecord(
                        monitoramento.getMacAddress(),
                        monitoramento.getDataAtual(),
                        leitura.getComponente(),
                        leitura.getMedida(),
                        leitura.getValor() != null ? leitura.getValor() : "null"
                );
            }
        }

        csvPrinter.flush();
        writer.close();

        return outputStream;
    }
}