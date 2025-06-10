FROM node:22.11.0-slim AS production
WORKDIR /app

COPY . .

ENV NODE_ENV=production

EXPOSE 5000
CMD ["npm", "start"]