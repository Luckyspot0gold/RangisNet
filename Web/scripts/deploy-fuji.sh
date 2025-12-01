#!/bin/bash
set -e

# Check/Install CLI
if ! command -v avalanche &> /dev/null; then
  curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh
  source ~/.bashrc  # Reload
fi

# Create subnet locally first
avalanche subnet create rangis --local

# Genesis deploy (use your config/rangis-genesis.json)
avalanche subnet deploy rangis --config-dir config/ --local

# Bootstrap local
avalanche subnet bootstrap rangis --local

echo "Local Subnet Ready! Test RPC: http://127.0.0.1:9650/ext/bc/rangis/rpc"
# ... existing ...
# Switch to Fuji
avalanche config chain --network fuji

# Create/deploy on Fuji
avalanche subnet create rangis --fuji
avalanche subnet deploy rangis --config-dir config/ --fuji

# Add validator (use your Fuji-funded wallet)
avalanche subnet add-validator rangis --signer-key-dir validators/ --fuji

# Bootstrap
avalanche subnet bootstrap rangis --fuji

# Deploy contracts (e.g., HarmonicConcesus)
forge script scripts/Deploy.s.sol --rpc-url https://api.avax-test.network/ext/bc/C/rpc --private-key $FUJI_PK --broadcast

echo "Fuji Subnet Live! RPC: https://subnets.avax.network/rangis/rpc (check explorer)"
