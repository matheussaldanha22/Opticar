FROM node:lts-bookworm AS dependencies
WORKDIR /
COPY ./web-data-viz/package.json .
RUN npm install

FROM node:lts-alpine3.20 AS deploy
WORKDIR /
COPY --from=dependencies ./node_modules ./node_modules
COPY ./web-data-viz .
EXPOSE 3333
CMD [ "node", "app.js" ]