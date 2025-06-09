package br.com.sptech.school;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Transacao {

    private String ano;
    private String mes;
    private double valor;
    private int quantidade;

    public Transacao(String ano, String mes, double valor, int quantidade) {
        this.ano = ano;
        this.mes = mes;
        this.valor = valor;
        this.quantidade = quantidade;
    }

    public Transacao() {
    }

    public String getMes() {
        return mes;
    }

    public void setMes(String mes) {
        this.mes = mes;
    }

    public String getAno() {
        return ano;
    }

    public void setAno(String ano) {
        this.ano = ano;
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
        return "Transacao{" +
                "ano='" + ano + '\'' +
                ", mes='" + mes + '\'' +
                ", valor=" + valor +
                ", quantidade=" + quantidade +
                '}';
    }
}
