#!/bin/bash
# Install Google Cloud SDK in dev container
# Run: chmod +x install-gcloud.sh && ./install-gcloud.sh

set -e

echo "🔧 Installing Google Cloud SDK..."

# Add Cloud SDK repo
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# Install apt-transport-https
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates gnupg curl

# Import Google Cloud public key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg

# Install gcloud CLI
sudo apt-get update && sudo apt-get install -y google-cloud-cli

# Verify installation
gcloud --version

echo ""
echo "✅ Google Cloud SDK installed successfully!"
echo ""
echo "Next steps:"
echo "1. Authenticate: gcloud auth login"
echo "2. Set project: gcloud config set project rangisnet-production"
echo "3. Deploy: ./deploy-gcloud.sh"
echo ""
echo "Or run all setup steps:"
echo "  gcloud auth login && \\"
echo "  gcloud config set project rangisnet-production && \\"
echo "  ./deploy-gcloud.sh"
