#!/bin/bash

# Script to copy RangisNet market data proto files to Polygon Cosmos SDK
# Usage: ./copy-to-polygon-sdk.sh /path/to/polygon-cosmos-sdk

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <polygon-cosmos-sdk-path>"
    echo "Example: $0 /home/ubuntu/polygon-cosmos-sdk"
    exit 1
fi

POLYGON_SDK_PATH="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -d "$POLYGON_SDK_PATH" ]; then
    echo "Error: Directory $POLYGON_SDK_PATH does not exist"
    exit 1
fi

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   RangisNet Market Data Module - Polygon SDK Integration  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Create directory structure
echo "Creating proto directory structure..."
mkdir -p "$POLYGON_SDK_PATH/proto/rangisnet/marketdata/v1"

# Copy proto files
echo "Copying proto files..."
cp "$SCRIPT_DIR/proto/marketdata/v1/marketdata.proto" \
   "$POLYGON_SDK_PATH/proto/rangisnet/marketdata/v1/"
cp "$SCRIPT_DIR/proto/marketdata/v1/query.proto" \
   "$POLYGON_SDK_PATH/proto/rangisnet/marketdata/v1/"
cp "$SCRIPT_DIR/proto/marketdata/v1/tx.proto" \
   "$POLYGON_SDK_PATH/proto/rangisnet/marketdata/v1/"

echo "✓ Proto files copied successfully"
echo ""

# Update package names in proto files
echo "Updating package names to rangisnet.marketdata.v1..."
sed -i 's/package marketdata\.v1;/package rangisnet.marketdata.v1;/g' \
    "$POLYGON_SDK_PATH/proto/rangisnet/marketdata/v1"/*.proto

# Update go_package paths
sed -i 's|go_package = ".*"|go_package = "github.com/Luckyspot0gold/RangisNet/x/marketdata/types"|g' \
    "$POLYGON_SDK_PATH/proto/rangisnet/marketdata/v1"/*.proto

echo "✓ Package names updated"
echo ""

# Check if buf.yaml exists
if [ -f "$POLYGON_SDK_PATH/buf.yaml" ]; then
    echo "Found buf.yaml - ready to run 'buf generate'"
else
    echo "⚠ Warning: buf.yaml not found in $POLYGON_SDK_PATH"
    echo "You may need to create a buf configuration file"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                Setup Complete!                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Proto files have been copied to:"
echo "  $POLYGON_SDK_PATH/proto/rangisnet/marketdata/v1/"
echo ""
echo "Next steps:"
echo "1. cd $POLYGON_SDK_PATH"
echo "2. buf generate"
echo "3. Implement the module in x/marketdata/"
echo "4. Register the module in app/app.go"
echo ""
echo "For detailed instructions, see:"
echo "  POLYGON_LAYERZERO_INTEGRATION_GUIDE.md"
