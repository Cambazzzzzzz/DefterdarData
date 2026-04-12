# Defterdar Muhasebe - Docker Image
FROM node:18-alpine

# Metadata
LABEL maintainer="CMS Team"
LABEL description="Defterdar Muhasebe - STK Muhasebe Sistemi"
LABEL version="1.1.0"

# Working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY . .

# Create data directory
RUN mkdir -p data && chmod 755 data

# Create non-root user
RUN addgroup -g 1001 -S defterdar && \
    adduser -S defterdar -u 1001 -G defterdar

# Change ownership
RUN chown -R defterdar:defterdar /app

# Switch to non-root user
USER defterdar

# Expose port
EXPOSE 4500

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4500/api/auth/durum || exit 1

# Start command
CMD ["npm", "start"]