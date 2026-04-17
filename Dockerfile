# Defterdar Muhasebe - Docker Image
FROM node:18-alpine

LABEL maintainer="CMS Team"
LABEL description="Defterdar Muhasebe - STK Muhasebe Sistemi"

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

# data klasörünü oluştur ve izinleri aç
RUN mkdir -p /app/data && chmod 777 /app/data

EXPOSE 4500

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:4500/health || exit 1

CMD ["node", "server.js"]