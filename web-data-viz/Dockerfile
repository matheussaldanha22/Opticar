FROM node:22.11.0-slim AS production
WORKDIR /app

COPY . .

ENV NODE_ENV=production

EXPOSE 3333
CMD ["npm", "start"]
