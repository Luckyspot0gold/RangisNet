# Complete Deployment Commands
# RangisHeartbeat with All Integrations

## Prerequisites Checklist

- [ ] All API keys configured in .env.local:
  - Thirdweb Client ID: 843c7ea3b79f0ceefc8fde84602616ea ✅
  - Coinbase Commerce API Key (from commerce.coinbase.com)
  - Supabase URL + Keys (from supabase.com/dashboard)
  - Bolt.new API Key (from bolt.new or Xion hackathon)
  - DeepInfra API Key: kEqJTHfvxGKlxcNjnb2axEq9FcUxJZjI ✅

- [ ] Supabase SQL schema created (see API_KEYS_SETUP.md)
- [ ] Google Cloud SDK installed: `which gcloud`
- [ ] Domain registered: rangisheartbeat.com ✅
- [ ] NPM dependencies installed: `npm install @supabase/supabase-js`

---

## Step 1: Install Supabase Dependency (2 minutes)

```bash
cd /workspaces/RangisNet/Web
npm install @supabase/supabase-js@latest
```

---

## Step 2: Authenticate with Google Cloud (5 minutes)

```bash
# Login to Google Cloud
gcloud auth login

# Set project (create if doesn't exist)
gcloud config set project rangisnet-production

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com

# Set default region
gcloud config set run/region us-central1
```

---

## Step 3: Export Environment Variables (2 minutes)

```bash
# Export all credentials (replace placeholders with real values)
export NEXT_PUBLIC_THIRDWEB_CLIENT_ID="843c7ea3b79f0ceefc8fde84602616ea"
export realityprotocol_DEEPINFRA_API_KEY="kEqJTHfvxGKlxcNjnb2axEq9FcUxJZjI"

# Get these from your .env.local file:
export COINBASE_COMMERCE_API_KEY="your_key_here"
export COINBASE_WEBHOOK_SECRET="your_secret_here"
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
export BOLT_API_KEY="your_bolt_key_here"

# Verify all set
env | grep -E "THIRDWEB|DEEPINFRA|COINBASE|SUPABASE|BOLT"
```

---

## Step 4: Deploy to Cloud Run (10-15 minutes)

```bash
cd /workspaces/RangisNet/Web

# Deploy with all environment variables
gcloud run deploy rangisnet-heartbeat \
  --source=. \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5 \
  --port=3000 \
  --timeout=60s \
  --set-env-vars="NEXT_PUBLIC_THIRDWEB_CLIENT_ID=${NEXT_PUBLIC_THIRDWEB_CLIENT_ID}" \
  --set-env-vars="realityprotocol_DEEPINFRA_API_KEY=${realityprotocol_DEEPINFRA_API_KEY}" \
  --set-env-vars="COINBASE_COMMERCE_API_KEY=${COINBASE_COMMERCE_API_KEY}" \
  --set-env-vars="COINBASE_WEBHOOK_SECRET=${COINBASE_WEBHOOK_SECRET}" \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}" \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  --set-env-vars="SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}" \
  --set-env-vars="BOLT_API_KEY=${BOLT_API_KEY}" \
  --set-env-vars="NEXT_PUBLIC_CHAIN_ID=43113" \
  --set-env-vars="NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc"

# Wait for deployment (takes 10-15 minutes)
# You'll see: "Service URL: https://rangisnet-heartbeat-xxxx-uc.a.run.app"
```

---

## Step 5: Configure Cloudflare DNS (3 minutes)

**Go to:** https://dash.cloudflare.com → rangisheartbeat.com → DNS

**Add 2 records:**

1. **CNAME Record:**
   - Type: `CNAME`
   - Name: `@` (or leave blank)
   - Target: `ghs.googlehosted.com`
   - Proxy status: **🌫️ DNS only (turn OFF orange cloud)**
   - TTL: Auto

2. **TXT Record (from gcloud output):**
   - Type: `TXT`
   - Name: `@`
   - Content: `google-site-verification=ABC123...` (from deploy output)
   - TTL: Auto

**Save changes**

---

## Step 6: Map Custom Domain (5 minutes)

```bash
# Map rangisheartbeat.com to Cloud Run service
gcloud run domain-mappings create \
  --service=rangisnet-heartbeat \
  --domain=rangisheartbeat.com \
  --region=us-central1

# Wait for domain verification (takes 2-5 minutes)
# Check status:
gcloud run domain-mappings describe rangisheartbeat.com \
  --region=us-central1

# Expected output:
# status:
#   conditions:
#   - type: Ready
#     status: "True"
```

---

## Step 7: Update Coinbase Commerce Webhook (2 minutes)

1. Go to: https://commerce.coinbase.com/dashboard/settings
2. Navigate: Settings → Webhooks
3. Add new webhook endpoint:
   - **URL:** `https://rangisheartbeat.com/api/payment/webhook`
   - **Events:** Select all (charge:created, charge:confirmed, etc.)
4. Save webhook secret (already in .env.local)

---

## Step 8: Test Production Deployment (5 minutes)

```bash
# Test health endpoint
curl https://rangisheartbeat.com/api/health

# Expected: {"status":"ok","timestamp":"..."}

# Test market data API
curl https://rangisheartbeat.com/api/market-data/BTC

# Expected: {"symbol":"BTC","price":...,"volume24h":...}

# Test payment charge creation (with valid user data)
curl -X POST https://rangisheartbeat.com/api/payment/create-charge \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "pro",
    "userEmail": "test@example.com",
    "userId": "test-123"
  }'

# Expected: {"success":true,"charge":{"hosted_url":"..."}}

# Open in browser:
open https://rangisheartbeat.com/heartbeat
```

---

## Step 9: Monitor Deployment (Ongoing)

```bash
# View Cloud Run logs
gcloud run logs read --service=rangisnet-heartbeat --region=us-central1

# Check resource usage (should be within free tier)
gcloud run services describe rangisnet-heartbeat --region=us-central1

# Monitor costs
gcloud billing accounts list
gcloud billing projects describe rangisnet-production
```

---

## Deployment Verification Checklist

After deployment, verify:

- [ ] Website loads: https://rangisheartbeat.com
- [ ] Health check passes: https://rangisheartbeat.com/api/health
- [ ] Heartbeat page renders: https://rangisheartbeat.com/heartbeat
- [ ] 3D visualizations appear (Spinor, Bloch, Torus)
- [ ] Market data updates every 5 seconds
- [ ] Audio toggle works (7-Bell frequencies)
- [ ] Haptics toggle works (mobile devices)
- [ ] Symbol selector changes visualizations
- [ ] Payment API responds: /api/payment/create-charge
- [ ] Supabase connection works (check browser console)
- [ ] SSL certificate active (🔒 in browser)
- [ ] DNS propagated (check: https://www.whatsmydns.net)

---

## Troubleshooting

### Deployment fails with "source not found"
```bash
# Make sure you're in /workspaces/RangisNet/Web directory
cd /workspaces/RangisNet/Web
pwd  # Should show: /workspaces/RangisNet/Web

# Try deployment again
```

### "Permission denied" errors
```bash
# Re-authenticate
gcloud auth login
gcloud config set project rangisnet-production
```

### Domain mapping stuck in "Pending"
```bash
# Verify DNS records in Cloudflare
# - CNAME: @ → ghs.googlehosted.com (Proxy OFF)
# - TXT: @ → google-site-verification=...

# Check status:
gcloud run domain-mappings describe rangisheartbeat.com --region=us-central1

# If still pending after 10 minutes, delete and recreate:
gcloud run domain-mappings delete rangisheartbeat.com --region=us-central1
# Then run Step 6 again
```

### 3D visualizations not rendering
```bash
# Check browser console for errors
# Common fix: Clear browser cache (Ctrl+Shift+R)

# Verify dependencies installed:
npm list react-three-fiber @react-three/drei three

# If missing:
npm install react-three-fiber@8.16.0 @react-three/drei@9.105.4 three@0.163.0
```

### Market data not updating
```bash
# Check API endpoints:
curl https://rangisheartbeat.com/api/market-data/BTC

# If 500 error, check logs:
gcloud run logs read --service=rangisnet-heartbeat --limit=50

# Common issue: API aggregator timeout
# Fix: Restart service to clear cache
gcloud run services update rangisnet-heartbeat --region=us-central1
```

### Coinbase webhook not receiving events
```bash
# Verify webhook URL is correct:
echo "https://rangisheartbeat.com/api/payment/webhook"

# Test webhook manually:
curl -X POST https://rangisheartbeat.com/api/payment/webhook \
  -H "X-CC-Webhook-Signature: test" \
  -d '{"type":"test"}'

# Check logs:
gcloud run logs read --service=rangisnet-heartbeat | grep webhook
```

---

## Post-Deployment Tasks

### 1. Monitor Free Tier Usage
```bash
# Check Cloud Run metrics
gcloud run services describe rangisnet-heartbeat --region=us-central1 | grep -A 10 "metrics"

# Set budget alert to prevent overages
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="RangisNet Free Tier Alert" \
  --budget-amount=5USD \
  --threshold-rule=percent=80
```

### 2. Setup CI/CD (Optional)
```bash
# Link GitHub repo to Cloud Build
gcloud builds triggers create github \
  --repo-name=RangisNet \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### 3. Add Custom Domain Alternatives
```bash
# Add www subdomain
gcloud run domain-mappings create \
  --service=rangisnet-heartbeat \
  --domain=www.rangisheartbeat.com \
  --region=us-central1
```

### 4. Enable Cloud Monitoring
```bash
# Create uptime check
gcloud monitoring uptime-checks create \
  --display-name="RangisHeartbeat Health Check" \
  --resource-type=uptime-url \
  --host=rangisheartbeat.com \
  --path=/api/health
```

---

## Success! 🎉

Your RangisHeartbeat platform is now live at:
**https://rangisheartbeat.com**

Features enabled:
- ✅ 3D multi-sensory visualizations (Spinor, Bloch, Torus)
- ✅ 7-Bell harmonic audio system (86Hz to 1266Hz)
- ✅ Real-time market data (6 sources, 5-second updates)
- ✅ Coinbase Commerce payments (3 premium tiers)
- ✅ Supabase user profiles & preferences
- ✅ Bolt.new AI code generation
- ✅ Haptic feedback (mobile devices)
- ✅ Free hosting ($0/month within limits)
- ✅ Auto-scaling (0 to 5 instances)
- ✅ SSL certificate (HTTPS)
- ✅ Global CDN via Cloudflare

**Cost:** $0/month + 1% Coinbase Commerce fee

**Next:** Share your hackathon submission links! 🚀
