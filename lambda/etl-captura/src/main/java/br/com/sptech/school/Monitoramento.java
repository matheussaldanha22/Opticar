package br.com.sptech.school;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Monitoramento {

    @JsonProperty("macAdress")
    private long macAddress;

    @JsonProperty("dataAtual")
    private String dataAtual;

    @JsonProperty("leitura")
    private List<Leitura> leituras;

    public long getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(long macAddress) {
        this.macAddress = macAddress;
    }

    public String getDataAtual() {
        return dataAtual;
    }

    public void setDataAtual(String dataAtual) {
        this.dataAtual = dataAtual;
    }

    public List<Leitura> getLeituras() {
        return leituras;
    }

    public void setLeituras(List<Leitura> leituras) {
        this.leituras = leituras;
    }

    public static class Leitura {
        @JsonProperty("componente")
        private String componente;

        @JsonProperty("medida")
        private String medida;

        @JsonProperty("valor")
        private Double valor;

        // Getters e Setters
        public String getComponente() {
            return componente;
        }

        public void setComponente(String componente) {
            this.componente = componente;
        }

        public String getMedida() {
            return medida;
        }

        public void setMedida(String medida) {
            this.medida = medida;
        }

        public Double getValor() {
            return valor;
        }

        public void setValor(Double valor) {
            this.valor = valor;
        }
    }
}