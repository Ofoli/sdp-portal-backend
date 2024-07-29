FROM node:20-alpine as dev

WORKDIR /app

COPY package*.json .

ENV NODE_ENV=development

RUN npm ci

COPY . .

RUN npm run build


FROM node:20-alpine as prod

WORKDIR /app

COPY package*.json .

ENV NODE_ENV=production

RUN npm ci --only=production

COPY --from=dev /app/dist ./dist