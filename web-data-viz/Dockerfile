FROM node:22

COPY  package*.json

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "dev"]

EXPOSE 80