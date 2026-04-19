# DefterdarMuhasebe - Railway Deployment
# Node.js + better-sqlite3 için optimize edilmiş Dockerfile

FROM node:18-alpine

# Python ve build araçlarını yükle (better-sqlite3 için gerekli)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev

# Çalışma dizini
WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Dependencies'i yükle
RUN npm ci --only=production --no-audit --no-fund

# Uygulama dosyalarını kopyala
COPY . .

# Veri klasörü oluştur
RUN mkdir -p /app/data

# Port
EXPOSE 4500

# Environment variables
ENV NODE_ENV=production
ENV PORT=4500
ENV DB_PATH=/app/data/defterdar.db

# Uygulama başlat
CMD ["node", "server.js"]