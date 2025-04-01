#CSV1
capturaMaq <- read.csv("c:/users/dudac/Documents/capturaMaq1.csv",
                     sep = ";")
capturaMaq  

#CSV2
capturaMaq2 <- read.csv("c:/users/dudac/Documents/dadosVitor.csv",
                        sep = ";")
capturaMaq2

#idCapturaMaq1       mac_address cpu_percent cpu_freq ram_percent   ram_byte disk_percent    disk_byte download upload

#PORCENTAGEM MAQ1
dadosCpuPorcentagem <- capturaMaq$cpu_percent
dadosCpuPorcentagem

#MEDIAS DADOS
dadosCpuFreq <- capturaMaq$cpu_freq
mean(dadosCpuFreq)

dadosRamPercentagem <- capturaMaq$ram_percent
dadosRamPercentagem


dadosRamByte <- capturaMaq$ram_byte
mean(dadosRamByte)

dadosDiscoPorcentagem <- capturaMaq$disk_percent

dadosDiscoByte <- capturaMaq$disk_byte
mean(dadosDiscoByte)

dadosDownload <- capturaMaq$download
mean(dadosDownload)

dadosUpload <- capturaMaq$upload
mean(dadosUpload)

#SOMA PORCENTAGEM MAQ1
somaCpuPorcent <- sum(dadosCpuPorcentagem)
somaCpuPorcent

#SOMA RAM MAQ1
somaRamPercentagem <- sum(dadosRamPercentagem)
somaRamPercentagem

somaRamByte <- sum(dadosRamByte)
somaRamByte

#SOMA DISCO MAQ1
somaDiscoPercent <- sum(dadosDiscoPorcentagem)
somaDiscoPercent

somaDiscoByte <- sum(dadosDiscoByte)
somaDiscoByte

#MEDIA MAQ1 - CPU
mediaCpu <- mean(dadosCpuPorcentagem)
mediaCpu

#MEDIA MAQ1 - RAM
mediaRam <- mean(dadosRamPercentagem)
mediaRam

#MEDIA MAQ1 - DISCO
mediaDisco <- mean(dadosDiscoPorcentagem)
mediaDisco




#PORCENTAGEM MAQ2
dadosCpuPorcentagem2 <- capturaMaq2$cpu_percent
dadosCpuPorcentagem2

dadosRamPorcentagem2 <- capturaMaq2$ram_percent
mediaRam2 <- mean(dadosRamPorcentagem2)
mediaRam2

dadosDiscoPorcentagem2 <- capturaMaq2$disk_percent
mediaDisco2 <- mean(dadosDiscoPorcentagem2)
mediaDisco2

#MEDIA MAQ2 - CPU
media2 <-mean(dadosCpuPorcentagem2)
media2



media<-mean(dadosCpuPorcentagem)
media

#COMPARAÇÃO DE MEDIAS ENTRE (MAQ1, MAQ2)
medias <- c(media, media2)
names(medias) <- c("MediaCpu1", "MediaCpu2")
pie(medias,col = rainbow(2),main = "Comparação de Cpu entre maquinas")


#COMPARACAO DE MEDIAS ENTRE (MAQ1,MAQ2) - COMPONENTES
mediaComponentes <- c(media,mediaRam,mediaDisco,media2,mediaRam2,mediaDisco2)
names(mediaComponentes) <- c("cpu1", "ram1", "disco1", "cpu2", "ram2", "disco2")
pie(mediaComponentes, col = rainbow(6), main = "Comparação de Componentes entre Máquinas")

graficoCpuPorcentagem2 <- abs(round(rnorm(dadosCpuPorcentagem2, media2, 2),2))
graficoCpuPorcentagem2

graficoCpuPorcentagem <- abs(round(rnorm(dadosCpuPorcentagem, media, 2),2))
graficoCpuPorcentagem


graficos <- c(graficoCpuPorcentagem, graficoCpuPorcentagem2)

#COMPARACÃO ENTRE MEDIAS POR HISTOGRAMA (MAQ1, MAQ2)
hist(
  graficos,
  main = "Dados porcentagem Total de Máquinas",
  ylab = "Quantidade", 
  xlab= "Porcentagem",
  col = "pink"
  
)

#DISTRIBUIÇÃO MAQ1 
plot(dadosCpuPorcentagem,
     xlab = capturaMaq$data_hora
     )

dadosHoras <- capturaMaq$data_hora
dadosHoras

#DISTRIBUIÇÃO
plot(dadosCpuPorcentagem)
plot(dadosDiscoPorcentagem)
plot(dadosRamPercentagem)

#GRAFICO LINHAS PORCENTAGEM CPU,RAM,DISCO
plot(dadosCpuPorcentagem)
plot(dadosCpuPorcentagem, type = "l", col = "blue")
plot(dadosRamPercentagem, type = "l",col = "red" )
plot(dadosDiscoPorcentagem, type = "l")

#HISTOGRAMA PORCENTAGEM CPU MAQ1
graficoCpuPorcentagem <- abs(round(rnorm(dadosCpuPorcentagem, mediaCpu, 2), 2))
graficoCpuPorcentagem

hist(
  graficoCpuPorcentagem,
  main = "Dados porcentagem",
  ylab = "Quantidade",
  xlab = "Porcentagem",
  col = 'lightblue',
  border = 'red'
)
  
#HISTOGRAMA PORCENTAGEM RAM MAQ1
graficoRamPorcentagem <- abs(round(rnorm(dadosRamPercentagem, mediaRam,2),2))
hist(
  graficoRamPorcentagem,
  main = "Dados Porcentagem Ram",
  ylab = "Quantidade",
  xlab = "Porcentagem",
  col = "orange"
)

#HISTOGRAMA PORCENTAGEM DISCO MAQ1
graficoDiscoPorcentagem <- abs(round(rnorm(dadosDiscoPorcentagem, mediaDisco,2),2))
hist(
  graficoDiscoPorcentagem,
  main = "Dados Porcentagem Disco",
  ylab = "Quantidade",
  xlab = "Porcentagem",
  col = "green"
)

#Análise de picos:
picoPercentCpu <- max(dadosCpuPorcentagem)
picoPercentRam <- max(dadosRamPercent)
picoPercentDisco <- max(dadosDiscoPorcentagem)
picoPercentDisco
picoPercentCpu


nomes <- c("Max Cpu",  "Max Ram", "Max Disco")
maxC <- c(picoPercentCpu, picoPercentRam, picoPercentDisco)

barplot(
  maxC,
  names.arg = nomes,
  col = c("lightblue", "gray", "purple"),
  main = "Pico Comp",
  ylab = "Quantidade",
  xlab = "Valores",
  border= "black"
)

#comparação manha
manhaCpu <- head(capturaMaq$cpu_percent,1000)
manhaCpu

tardeCpu <- capturaMaq$cpu_percent[1001:2000]
tardeCpu

manhaRam <- head(capturaMaq$ram_percent,1000)
manhaRam

tardeRam <- capturaMaq$ram_percent[1001:2000]
tardeRam

manhaDisco <- head(capturaMaq$disk_percent,1000)
manhaDisco

tardeDisco <- capturaMaq$disk_percent[1001:2000]
tardeDisco

mediaManhaCpu <- mean(manhaCpu)

mediaManhaRam <- mean(manhaRam)
mediaManhaDisco <- mean(manhaDisco)

mediaTardeCpu <- mean(tardeCpu)
mediaTardeRam <- mean(tardeRam)
mediaTardeDisco <- mean(tardeDisco)

nomes <- c("Cpu",  "Ram", "Disco")
manhaComp <- c(mediaManhaCpu,mediaManhaRam,mediaManhaDisco)
tardeComp <-  c(mediaTardeCpu,mediaTardeRam,mediaTardeDisco)

dotchart(
  manhaComp,
  labels = nomes,
  pch = 20,
  cex = 2,
  main = "Comparação manha",
  col = "red"
)

barplot(
  manhaComp,
  names.arg = nomes,
  col = c("orange", "gray", "purple"),
  main = "Comparação Manha",
  ylab = "Quantidade",
  xlab = "Valores",
  border= "black"
  
)

barplot(
  tardeComp,
  names.arg = nomes,
  col = c("lightblue", "gray", "purple"),
  main = "Comparação Tarde",
  ylab = "Quantidade",
  xlab = "Valores",
  border= "black"
  
)

