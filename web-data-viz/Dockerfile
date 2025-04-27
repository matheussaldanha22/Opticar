FROM node:22.11.0

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

ENTRYPOINT ["npm", "start"]