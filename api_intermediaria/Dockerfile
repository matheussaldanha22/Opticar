# Use uma imagem base do Node.js
FROM node:20-slim

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Mude para o usuário root para instalar dependências
USER root

# Instale as dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    libfontconfig \
    libfreetype6 \
    libx11-6 \
    libxext6 \
    libxrender1 \
    wget \
    bzip2 \
    && rm -rf /var/lib/apt/lists/*

# Copie os arquivos de dependência
COPY package*.json ./

# Instale as dependências do Node.js (incluindo phantomjs-prebuilt)
RUN npm install

# Copie o código da aplicação
COPY . .

# Mude para usuário não-privilegiado
USER node

# Comando para iniciar a aplicação
CMD [ "node", "app.js" ]