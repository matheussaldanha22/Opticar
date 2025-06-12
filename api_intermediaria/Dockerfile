# 1. Use uma imagem base do Node.js (escolha a versão adequada para seu projeto)
FROM node:20-slim

# 2. Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# 3. Mude para o usuário root TEMPORARIAMENTE para instalar dependências
USER root

# 4. Instale o Chromium e todas as suas dependências de uma só vez
#    - '--no-install-recommends' evita instalar pacotes desnecessários
#    - 'rm -rf /var/lib/apt/lists/*' limpa o cache para manter a imagem menor
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libasound2 \
    libnss3 \
    && rm -rf /var/lib/apt/lists/*

# 5. Copie os arquivos de dependência do seu projeto e instale-os
COPY package*.json ./
RUN npm install

# 6. Copie o restante do código da sua aplicação para o contêiner
COPY . .

# 7. Mude de volta para um usuário não-privilegiado por segurança
#    A imagem 'node' já vem com um usuário 'node' criado para isso.
USER node

# 8. Comando para iniciar sua aplicação
CMD [ "node", "seu-arquivo-principal.js" ]