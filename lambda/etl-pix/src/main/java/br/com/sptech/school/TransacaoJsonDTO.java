package br.com.sptech.school;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransacaoJsonDTO {

    @JsonProperty("AnoMes")
    private String anoMes;

    @JsonProperty("VALOR")
    private double valor;

    @JsonProperty("QUANTIDADE")
    private int quantidade;

    // Getters e Setters

    public String getAnoMes() {
        return anoMes;
    }

    public String setAnoMes() {
        return anoMes;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    @Override
    public String toString() {
        return "TransacaoJsonDTO{" +
                "anoMes='" + anoMes + '\'' +
                ", valor=" + valor +
                ", quantidade=" + quantidade +
                '}';
    }
}
