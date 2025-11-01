FROM node:24.11.0-alpine3.22

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install

COPY . .

# Compila TypeScript
RUN pnpm build

# Expone el puerto que definimos en docker-compose
EXPOSE 3000

# Ejecuta la app al iniciar el contenedor
CMD ["pnpm", "start:prod"]
