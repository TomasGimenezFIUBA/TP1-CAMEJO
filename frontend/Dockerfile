# Utiliza una imagen base con Node.js 20
FROM node:20-alpine

# Instala pnpm globalmente
RUN npm install -g pnpm

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias del proyecto utilizando pnpm
RUN pnpm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye el proyecto Astro
RUN pnpm run build

# Expone el puerto 4321 para la aplicación
EXPOSE 4321

# Define el comando por defecto para ejecutar la aplicación
CMD ["pnpm", "start"]
