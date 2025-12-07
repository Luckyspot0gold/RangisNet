FROM node:20-alpine  # Light Node for TS/PTE

WORKDIR /app
COPY . .  # All repo (Web/contracts/scripts)
RUN pnpm install  # Deps (mathjs? Native only)
RUN forge install  # Foundry for contracts

# Expose ports (RPC 9650, HTTP 3000 for explorer)
EXPOSE 9650 3000

# Run subnet deploy + app
CMD ["sh", "-c", "./scripts/deploy-fuji.sh && cd Web && pnpm dev"]
