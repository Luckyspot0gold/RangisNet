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
#!/bin/bash
set -e

echo "RANGISNET FUJI LAUNCH SEQUENCE INITIATED — 432Hz"

# Fund check
if [ -z "$FUJI_PK" ]; then
  echo "Add FUJI_PK to .env first!"
  exit 1
fi

# Create + deploy subnet
avalanche subnet create rangis --fuji --force
avalanche subnet deploy rangis --fuji --config-dir config/

# Add yourself as validator (MVP single validator)
avalanche subnet add-validator rangis --stake-amount 1000000000000000000000 --fuji

# Deploy contracts
forge script scripts/Deploy.s.sol:DeployScript \
  --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key $FUJI_PK \
  --broadcast --verify

# Final output
SUBNET_RPC=$(avalanche subnet describe rangis --fuji | grep RPC | awk '{print $2}')
echo ""
echo "RANGISNET SUBNET LIVE"
echo "RPC: $SUBNET_RPC"
echo "ChainID: 99999"
echo "Token: ANGI"
echo "Explorer: https://subnets.avax.network/rangis"
echo "Save this RPC — this is your golden ticket"
