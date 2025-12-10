# RangisNet — Harmonic Economic Cognition Layer 1.5
FROM node:20-alpine AS builder

# Install dependencies
RUN apk add --no-cache git bash

# Set working directory
WORKDIR /app

# Copy Web folder
COPY Web/package*.json Web/
COPY Web/pnpm-lock.yaml* Web/ || true

# Install dependencies
WORKDIR /app/Web
RUN npm install --legacy-peer-deps

# Copy source code
COPY Web/ .

# Build application
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built application
COPY --from=builder /app/Web/.next /app/.next
COPY --from=builder /app/Web/public /app/public
COPY --from=builder /app/Web/package*.json /app/
COPY --from=builder /app/Web/node_modules /app/node_modules

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["npm", "start"]
