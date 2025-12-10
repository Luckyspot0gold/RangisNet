#!/bin/bash

##############################################################################
# RangisNet Google Cloud Deployment Script
# One-command deployment to production
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-rangisnet-production}"
REGION="us-central1"
SERVICE_NAME="rangisnet-web"

##############################################################################
# Helper Functions
##############################################################################

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

##############################################################################
# Pre-flight Checks
##############################################################################

print_header "Pre-flight Checks"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
print_success "gcloud CLI installed"

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    print_error "Not authenticated with Google Cloud"
    echo "Run: gcloud auth login"
    exit 1
fi
print_success "Authenticated with Google Cloud"

# Check if project exists
if ! gcloud projects describe $PROJECT_ID &> /dev/null; then
    print_warning "Project $PROJECT_ID not found"
    read -p "Create project? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gcloud projects create $PROJECT_ID --name="RangisNet Production"
        print_success "Project created"
    else
        exit 1
    fi
fi
print_success "Project exists: $PROJECT_ID"

# Set active project
gcloud config set project $PROJECT_ID
print_success "Active project set"

##############################################################################
# Enable APIs
##############################################################################

print_header "Enabling Required APIs"

APIS=(
    "cloudbuild.googleapis.com"
    "run.googleapis.com"
    "containerregistry.googleapis.com"
    "secretmanager.googleapis.com"
)

for API in "${APIS[@]}"; do
    if gcloud services list --enabled --filter="name:$API" --format="value(name)" | grep -q "$API"; then
        print_success "$API already enabled"
    else
        print_info "Enabling $API..."
        gcloud services enable $API
        print_success "$API enabled"
    fi
done

##############################################################################
# Setup Secrets
##############################################################################

print_header "Setting Up Secrets"

setup_secret() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2
    local ENV_VAR=$3
    
    # Check if secret exists
    if gcloud secrets describe $SECRET_NAME &> /dev/null; then
        print_success "Secret $SECRET_NAME already exists"
        return
    fi
    
    # Try to get from environment
    if [ -n "$SECRET_VALUE" ]; then
        echo -n "$SECRET_VALUE" | gcloud secrets create $SECRET_NAME --data-file=-
        print_success "Secret $SECRET_NAME created"
    elif [ -n "${!ENV_VAR}" ]; then
        echo -n "${!ENV_VAR}" | gcloud secrets create $SECRET_NAME --data-file=-
        print_success "Secret $SECRET_NAME created from $ENV_VAR"
    else
        print_warning "Secret $SECRET_NAME not created (no value provided)"
    fi
}

# Setup secrets
setup_secret "thirdweb-client-id" "$THIRDWEB_CLIENT_ID" "NEXT_PUBLIC_THIRDWEB_CLIENT_ID"
setup_secret "thirdweb-secret-key" "$THIRDWEB_SECRET_KEY" "THIRDWEB_SECRET_KEY"
setup_secret "deepinfra-api-key" "$DEEPINFRA_API_KEY" "DEEPINFRA_API_KEY"

##############################################################################
# Grant Permissions
##############################################################################

print_header "Granting Permissions"

# Get Cloud Build service account
CLOUDBUILD_SA=$(gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.role:roles/cloudbuild.builds.builder" \
    --format="value(bindings.members)" | grep @cloudbuild || true)

if [ -z "$CLOUDBUILD_SA" ]; then
    print_warning "Cloud Build service account not found (will be created on first build)"
else
    print_success "Cloud Build service account: $CLOUDBUILD_SA"
    
    # Grant secret access
    for SECRET in "thirdweb-client-id" "thirdweb-secret-key" "deepinfra-api-key"; do
        if gcloud secrets describe $SECRET &> /dev/null; then
            gcloud secrets add-iam-policy-binding $SECRET \
                --member="$CLOUDBUILD_SA" \
                --role="roles/secretmanager.secretAccessor" \
                --quiet &> /dev/null || true
            print_success "Granted $CLOUDBUILD_SA access to $SECRET"
        fi
    done
fi

##############################################################################
# Build & Deploy
##############################################################################

print_header "Building & Deploying"

# Get commit SHA
COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "manual")
print_info "Commit SHA: $COMMIT_SHA"

# Submit build
print_info "Submitting build to Cloud Build..."
print_info "This will take 10-15 minutes for first build..."

gcloud builds submit \
    --config=cloudbuild.yaml \
    --substitutions=COMMIT_SHA=$COMMIT_SHA \
    .

print_success "Build completed!"

##############################################################################
# Get Service URL
##############################################################################

print_header "Deployment Complete!"

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region=$REGION \
    --format="value(status.url)" 2>/dev/null || echo "")

if [ -n "$SERVICE_URL" ]; then
    print_success "Service deployed at: $SERVICE_URL"
    
    # Test health endpoint
    print_info "Testing health endpoint..."
    if curl -sf "$SERVICE_URL/api/health" > /dev/null; then
        print_success "Health check passed!"
    else
        print_warning "Health check failed (service may still be starting)"
    fi
    
    echo ""
    print_info "🎉 RangisNet is now live!"
    echo ""
    echo "Wallet Dashboard: $SERVICE_URL/wallet"
    echo "API Health: $SERVICE_URL/api/health"
    echo "Market Data: $SERVICE_URL/api/market-data"
    echo ""
else
    print_warning "Service URL not available yet"
    echo "Check deployment status:"
    echo "  gcloud run services describe $SERVICE_NAME --region=$REGION"
fi

##############################################################################
# Next Steps
##############################################################################

print_header "Next Steps"

echo "1. Test your deployment:"
echo "   curl $SERVICE_URL/api/health"
echo ""
echo "2. View logs:"
echo "   gcloud logging read 'resource.type=cloud_run_revision' --limit=50"
echo ""
echo "3. Monitor metrics:"
echo "   https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/metrics"
echo ""
echo "4. Set up custom domain (optional):"
echo "   gcloud run domain-mappings create --service=$SERVICE_NAME --domain=rangis.net --region=$REGION"
echo ""
echo "5. Enable CI/CD:"
echo "   - Connect GitHub repository in Cloud Build console"
echo "   - Create trigger on push to main branch"
echo ""

print_success "Deployment script complete! 🚀"
