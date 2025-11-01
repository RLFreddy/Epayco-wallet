# Etapa 1: Build
FROM node:24.11.0-alpine3.22 AS build

# Setea el directorio de trabajo
WORKDIR /usr/src/app

# Copia solo package.json y pnpm-lock.yaml para instalar dependencias
COPY package*.json ./

# Instala pnpm
RUN npm i -g pnpm

# Instala dependencias
RUN pnpm install

# Copia el código fuente
COPY . .

# Compila la app con Vite
RUN pnpm build

# --------------------------------------
# Etapa 2: Servir la app
FROM node:24.11.0-alpine3.22

WORKDIR /usr/src/app

# Instala serve para servir archivos estáticos
RUN npm i -g serve

# Copia los archivos de la build desde la etapa anterior
COPY --from=build /usr/src/app/dist ./dist

# Expone el puerto 4173 (por defecto Vite serve) o 3000 si quieres
EXPOSE 4173

# Comando para iniciar la app
CMD ["serve", "-s", "dist", "-l", "4173"]
