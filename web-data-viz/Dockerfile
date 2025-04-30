FROM node:22.11.0

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

ENTRYPOINT ["npm", "start"]