FROM node:24.11.0-alpine3.22

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install

COPY . .

# Compila TypeScript
RUN pnpm build

# Expone el puerto que definimos en el docker-compose
EXPOSE 3001

# Copiamos y damos permisos al entrypoint
COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/docker-entrypoint.sh

# Usamos el entrypoint
ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]