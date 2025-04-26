df <- read.csv("dadosCaptura.csv")

#TRATAMENTO - Retirar colunas inutilizadas e transformar o df em colunar de acordo com medidas
df$MAC_ADDRESS <- NULL
df$DATA_ATUAL <- NULL

cpuPorc <- df[df$COMPONENTE == "Cpu" & df$MEDIDA == "Porcentagem", "VALOR"]
ramPorc <- df[df$COMPONENTE == "Ram" & df$MEDIDA == "Porcentagem", "VALOR"]
redeEnvi <- df[df$COMPONENTE == "Rede" & df$MEDIDA == "Enviada", "VALOR"]
qtdProcesso <- df[df$COMPONENTE == "Sistema" & df$MEDIDA == "Qtd Processos Ativos", "VALOR"]

dfColunar <- data.frame(
  cpuPorcentagem = cpuPorc,
  ramPorcentagem = ramPorc,
  redeEnviada = redeEnvi,
  qtdProcessos = qtdProcesso
)

#CORRELAÇÕES - Plotando a correlação entre as variaveis
cor_ram_qtd <- cor(dfColunar$ramPorcentagem, dfColunar$qtdProcessos)
cor_cpu_qtd <- cor(dfColunar$cpuPorcentagem, dfColunar$qtdProcessos)

cat("Correlação RAM (%) vs Qtd Processos ativos:", cor_ram_qtd, "\n")
cat("Correlação CPU (%) vs Qtd Processos ativos:", cor_cpu_qtd, "\n")


#CRIAÇÃO DOS MODELOS LINEARES - Regressão linear
modelo_ram <- lm(ramPorcentagem ~ qtdProcessos, data = dfColunar)
modelo_cpu <- lm(cpuPorcentagem ~ qtdProcessos, data = dfColunar)

library(ggplot2)

#GRAFICO ENTRE RAM E QTD PROCESSOS
grafico_ram <- ggplot(dfColunar, aes(x = qtdProcessos, y = ramPorcentagem)) +
  geom_point() +
  geom_smooth(method = "lm", color = "blue") +
  geom_hline(yintercept = mean(dfColunar$ramPorcentagem), color = "green") +
  labs(title = "Uso de RAM (%) vs Qtd de Processos ativos", x = "Qtd Processos ativos", y = "Uso de RAM (%)") +
  geom_segment(aes(
    x = qtdProcessos,
    y = ramPorcentagem,
    xend = qtdProcessos,
    yend = predict(modelo_ram)
  ), color = "red")

grafico_ram


#GRAFICO ENTRE CPU E QTD PROCESSOS
grafico_cpu <- ggplot(dfColunar, aes(x = qtdProcessos, y = cpuPorcentagem)) +
  geom_point() +
  geom_smooth(method = "lm", color = "blue") +
  geom_hline(yintercept = mean(dfColunar$cpuPorcentagem), color = "green") +
  labs(title = "Uso de CPU (%) vs Qtd de Processos ativos", x = "Qtd Processos ativos", y = "Uso de CPU (%)") +
  geom_segment(aes(
    x = qtdProcessos,
    y = cpuPorcentagem,
    xend = qtdProcessos,
    yend = predict(modelo_cpu)
  ), color = "red")

grafico_cpu


#COEFICIENTE DE DETERMINAÇÃO - Quanto os dados são explicados pelo modelo
SQt_ram <- sum((dfColunar$ramPorcentagem - mean(dfColunar$ramPorcentagem))^2)
SQres_ram <- sum((dfColunar$ramPorcentagem - predict(modelo_ram))^2)
R2_ram <- (SQt_ram - SQres_ram) / SQt_ram

SQt_cpu <- sum((dfColunar$cpuPorcentagem - mean(dfColunar$cpuPorcentagem))^2)
SQres_cpu <- sum((dfColunar$cpuPorcentagem - predict(modelo_cpu))^2)
R2_cpu <- (SQt_cpu - SQres_cpu) / SQt_cpu


cat(round(R2_ram * 100, 2), "% da variação no uso de RAM pode ser explicada pela quantidade de processos ativos\n")
cat(round(R2_cpu * 100, 2), "% da variação no uso de CPU pode ser explicada pela quantidade de processos ativos\n")
