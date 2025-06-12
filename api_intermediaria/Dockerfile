# Usando a imagem do Node.js slim como base
FROM node:22.11.0-slim AS production

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Instalar as dependências do Chromium e outras bibliotecas necessárias
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends

# Baixar e instalar o Chromium (certifique-se de usar a versão mais recente)
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb \
    && apt-get -y --fix-broken install

# Copiar o código da aplicação para dentro do container
COPY . .

# Definir variável de ambiente para produção
ENV NODE_ENV=production

# Instalar dependências do Node.js
RUN npm install

# Expor a porta da aplicação
EXPOSE 5000

# Rodar o servidor da aplicação
CMD ["npm", "start"]
