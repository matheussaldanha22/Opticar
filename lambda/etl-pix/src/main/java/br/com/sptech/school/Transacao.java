package br.com.sptech.school;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Transacao {

    @JsonProperty("AnoMes")
    private int anoMes;

    @JsonProperty("PAG_PFPJ")
    private String pagPfPj;

    @JsonProperty("REC_PFPJ")
    private String recPfPj;

    @JsonProperty("PAG_REGIAO")
    private String pagRegiao;

    @JsonProperty("REC_REGIAO")
    private String recRegiao;

    @JsonProperty("PAG_IDADE")
    private String pagIdade;

    @JsonProperty("REC_IDADE")
    private String recIdade;

    @JsonProperty("FORMAINICIACAO")
    private String formaIniciacao;

    @JsonProperty("NATUREZA")
    private String natureza;

    @JsonProperty("FINALIDADE")
    private String finalidade;

    @JsonProperty("VALOR")
    private double valor;

    @JsonProperty("QUANTIDADE")
    private int quantidade;

    // Getters e Setters

    public int getAnoMes() {
        return anoMes;
    }

    public void setAnoMes(int anoMes) {
        this.anoMes = anoMes;
    }

    public String getPagPfPj() {
        return pagPfPj;
    }

    public void setPagPfPj(String pagPfPj) {
        this.pagPfPj = pagPfPj;
    }

    public String getRecPfPj() {
        return recPfPj;
    }

    public void setRecPfPj(String recPfPj) {
        this.recPfPj = recPfPj;
    }

    public String getPagRegiao() {
        return pagRegiao;
    }

    public void setPagRegiao(String pagRegiao) {
        this.pagRegiao = pagRegiao;
    }

    public String getRecRegiao() {
        return recRegiao;
    }

    public void setRecRegiao(String recRegiao) {
        this.recRegiao = recRegiao;
    }

    public String getPagIdade() {
        return pagIdade;
    }

    public void setPagIdade(String pagIdade) {
        this.pagIdade = pagIdade;
    }

    public String getRecIdade() {
        return recIdade;
    }

    public void setRecIdade(String recIdade) {
        this.recIdade = recIdade;
    }

    public String getFormaIniciacao() {
        return formaIniciacao;
    }

    public void setFormaIniciacao(String formaIniciacao) {
        this.formaIniciacao = formaIniciacao;
    }

    public String getNatureza() {
        return natureza;
    }

    public void setNatureza(String natureza) {
        this.natureza = natureza;
    }

    public String getFinalidade() {
        return finalidade;
    }

    public void setFinalidade(String finalidade) {
        this.finalidade = finalidade;
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
