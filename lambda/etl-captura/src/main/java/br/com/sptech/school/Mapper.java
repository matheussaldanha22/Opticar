package br.com.sptech.school;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

public class Mapper {
    public List<Monitoramento> map(InputStream inputStream) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        // Primeiro lê COMO UM objeto simples:
        Monitoramento monitoramento = mapper.readValue(inputStream, Monitoramento.class);
        // Depois encapsula numa lista de 1 elemento:
        return Collections.singletonList(monitoramento);
    }
}
