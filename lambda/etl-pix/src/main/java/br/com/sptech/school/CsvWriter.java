package br.com.sptech.school;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class CsvWriter {

    public ByteArrayOutputStream writeCsv(List<Transacao> transacoes) throws IOException {
        // Criar um CSV em memória utilizando ByteArrayOutputStream
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8));

        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                "AnoMes","PAG_PFPJ", "REC_PFPJ",
                "PAG_REGIAO", "REC_REGIAO", "PAG_IDADE", "REC_IDADE",
                "FORMAINICIACAO", "NATUREZA", "FINALIDADE", "VALOR", "QUANTIDADE"
        ));

        // Processar e escrever cada objeto Transacao no CSV
        for (Transacao transacao : transacoes) {
            csvPrinter.printRecord(
                    transacao.getAnoMes(),
                    transacao.getPagPfPj(),
                    transacao.getRecPfPj(),
                    transacao.getPagRegiao(),
                    transacao.getRecRegiao(),
                    transacao.getPagIdade(),
                    transacao.getRecIdade(),
                    transacao.getFormaIniciacao(),
                    transacao.getNatureza(),
                    transacao.getFinalidade(),
                    transacao.getValor(),
                    transacao.getQuantidade()
            );
        }

        // Fechar o CSV para garantir que todos os dados sejam escritos
        csvPrinter.flush();
        writer.close();

        // Retornar o ByteArrayOutputStream que contém o CSV gerado
        return outputStream;
    }
}
