# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./
COPY bun.lockb* ./

# Instala dependências
RUN npm ci

# Copia código fonte
COPY . .

# Build da aplicação
# VITE_API_URL será injetado no build time via ARG
# Coolify pode injetar ARGs automaticamente, então precisamos tratar valores vazios
ARG VITE_API_URL
# Define ENV com fallback seguro - se ARG estiver vazio, usa valor padrão
ENV VITE_API_URL=${VITE_API_URL:-https://api-unifecaf.aguicoder.com}

# Debug e build
RUN echo "Building with VITE_API_URL=$VITE_API_URL" && npm run build

# Stage 2: Serve static files
FROM python:3.12-slim

WORKDIR /app

# Copia apenas arquivos buildados
COPY --from=builder /app/dist ./dist

# Expõe porta 8080
EXPOSE 8080

# Comando para servir arquivos estáticos usando Python http.server
CMD ["python", "-m", "http.server", "8080", "--directory", "dist"]

