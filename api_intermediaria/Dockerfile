# 1. Use uma imagem base do Node.js (escolha a versão adequada para seu projeto)
FROM node:20-slim

# 2. Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# 3. Mude para o usuário root TEMPORARIAMENTE para instalar dependências
USER root

# 4. Instale o Chromium e todas as suas dependências de uma só vez
#    - '--no-install-recommends' evita instalar pacotes desnecessários

# 5. Copie os arquivos de dependência do seu projeto e instale-os
COPY package*.json ./
RUN npm install

# 6. Copie o restante do código da sua aplicação para o contêiner
COPY . .

# 7. Mude de volta para um usuário não-privilegiado por segurança
#    A imagem 'node' já vem com um usuário 'node' criado para isso.
USER node

# 8. Comando para iniciar sua aplicação
CMD [ "node", "app.js" ]