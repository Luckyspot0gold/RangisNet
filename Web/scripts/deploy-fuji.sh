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
