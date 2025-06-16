# Use uma imagem base do Node.js
FROM node:20-slim

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Mude para o usuário root para instalar dependências
USER root

# Instale as dependências do sistema necessárias para PhantomJS
RUN apt-get update && apt-get install -y \
    libfontconfig \
    libfreetype6 \
    libx11-6 \
    libxext6 \
    libxrender1 \
    libjpeg62-turbo \
    libxtst6 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    wget \
    bzip2 \
    && rm -rf /var/lib/apt/lists/*

# Baixe e instale o PhantomJS manualmente
RUN wget https://github.com/Medium/phantomjs/releases/download/v2.1.1/phantomjs-2.1.1-linux-x86_64.tar.bz2 \
    && tar -xjf phantomjs-2.1.1-linux-x86_64.tar.bz2 \
    && mv phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/ \
    && chmod +x /usr/local/bin/phantomjs \
    && rm -rf phantomjs-2.1.1-linux-x86_64*

# Copie os arquivos de dependência e instale
COPY package*.json ./
RUN npm install

# Copie o código da aplicação
COPY . .

# Mude para usuário não-privilegiado
USER node

# Comando para iniciar a aplicação
CMD [ "node", "app.js" ]