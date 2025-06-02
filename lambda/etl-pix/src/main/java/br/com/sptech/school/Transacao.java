package br.com.sptech.school;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Transacao {

    @JsonProperty("AnoMes")
    private int anoMes;

    @JsonProperty("VALOR")
    private double valor;

    @JsonProperty("QUANTIDADE")
    private int quantidade;

    // Getters e Setters

    public int getAnoMes() {
        return anoMes;
    }

    public int setAnoMes() {
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
}
