FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json .

ENV NODE_ENV=development

RUN npm ci

COPY . .

RUN npm run build


FROM node:20-alpine AS prod

WORKDIR /app

COPY package*.json .
COPY .env .

ENV NODE_ENV=production

RUN npm ci --only=production

COPY --from=dev /app/dist ./dist