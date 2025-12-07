# scripts/deploy-prod.sh
set -e

echo "📋 Step 1: Pre-deployment Checks."
# ...
echo "🔍 Step 2: Code Quality Checks."
pnpm eslint src/ && pnpm tsc --noEmit
# ...
echo "🚀 Step 6: Deployment."
# ...
