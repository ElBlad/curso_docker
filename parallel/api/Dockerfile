FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build
COPY src/db/initial-schema.sql dist/db/initial-schema.sql

CMD ["sh", "-c", "npm run db:seed && npm start"]
