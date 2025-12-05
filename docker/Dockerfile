# RangisNet Backend - Multi-Stage Docker Build
# For local development and testnet deployment

FROM node:22-alpine AS base

# Install Python for PTE engine
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copy package files
COPY ../Web/package*.json ./
RUN npm install

# Copy source code
COPY ../Web/src ./src
COPY ../Web/tsconfig.json ./

# Build TypeScript
RUN npm run build || echo "No build script, skipping"

# Production stage
FROM node:22-alpine

RUN apk add --no-cache python3

WORKDIR /app

# Copy from build stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/src ./src
COPY --from=base /app/package*.json ./

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Run PTE engine server (placeholder - implement as needed)
CMD ["node", "-e", "console.log('RangisNet PTE Backend Ready on port 8000'); require('http').createServer((req, res) => { res.writeHead(200); res.end('RangisNet PTE Engine'); }).listen(8000);"]
