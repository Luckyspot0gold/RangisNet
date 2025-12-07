# RangisNet MVP - Multi-stage Docker build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY Web/package*.json ./
RUN npm ci

# Copy source
COPY Web/ ./

# Build Next.js app
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 8000

# Copy built assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8000

CMD ["node", "server.js"]
