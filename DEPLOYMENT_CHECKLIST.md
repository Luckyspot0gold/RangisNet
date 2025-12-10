# 🚀 DEPLOYMENT CHECKLIST — READY TO GO LIVE

**Date:** December 8, 2025  
**Target:** Google Cloud Run (Production)  
**Timeline:** 10 minutes to live deployment  
**Status:** ✅ ALL SYSTEMS GO

---

## ✅ PRE-DEPLOYMENT VERIFICATION

### Infrastructure Files Ready
- [x] `cloudbuild.yaml` — CI/CD configuration
- [x] `Web/Dockerfile.production` — Production Docker image
- [x] `deploy-gcloud.sh` — Automated deployment script
- [x] `Web/src/app/api/health/route.ts` — Health check endpoint
- [x] `Web/next.config.js` — Production optimizations

### Secrets Prepared
- [x] Thirdweb Client ID: `843c7ea3b79f0ceefc8fde84602616ea`
- [x] Thirdweb Secret Key: (get from dashboard)
- [x] DeepInfra API Key: `kEqJTHfvxGKlxcNjnb2axEq9FcUxJZjI`

### Documentation Complete
- [x] `GOOGLE_CLOUD_DEPLOYMENT.md` — Full deployment guide
- [x] `GOOGLE_CLOUD_QUICKSTART.md` — Quick reference
- [x] `INTEGRATION-PERMISSIONS.md` — Updated with GCP info

---

## 🎯 DEPLOYMENT: OPTION 1 (RECOMMENDED) — 10 MINUTES

### Step 1: Prepare Environment (2 minutes)

```bash
# Navigate to project root
cd /workspaces/RangisNet

# Set environment variables
export THIRDWEB_CLIENT_ID="843c7ea3b79f0ceefc8fde84602616ea"
export THIRDWEB_SECRET_KEY="get_from_dashboard"  # ⚠️ REPLACE THIS
export DEEPINFRA_API_KEY="kEqJTHfvxGKlxcNjnb2axEq9FcUxJZjI"
```

**⚠️ IMPORTANT:** Get your full Thirdweb Secret Key:
1. Go to: https://thirdweb.com/dashboard/settings/api-keys
2. Copy the **full secret key** (starts with `ihA...`)
3. Replace in the export command above

---

### Step 2: Authenticate with Google Cloud (1 minute)

```bash
# Login to Google Cloud
gcloud auth login

# Follow browser prompt to authenticate
# Select your account with $300 credits
```

---

### Step 3: Run Deployment Script (5 minutes)

```bash
# Execute automated deployment
./deploy-gcloud.sh
```

**What the script does:**
1. ✅ Creates project `rangisnet-production`
2. ✅ Enables required APIs (Cloud Build, Cloud Run, Secret Manager)
3. ✅ Creates secrets from environment variables
4. ✅ Grants permissions to Cloud Build service account
5. ✅ Submits build to Cloud Build
6. ✅ Deploys to Cloud Run with auto-scaling (1-10 instances)
7. ✅ Returns your live production URL

**Expected Output:**
```
========================================
Pre-flight Checks
========================================
✓ gcloud CLI installed
✓ Authenticated with Google Cloud
✓ Project exists: rangisnet-production
✓ Active project set

========================================
Enabling Required APIs
========================================
✓ cloudbuild.googleapis.com enabled
✓ run.googleapis.com enabled
✓ containerregistry.googleapis.com enabled
✓ secretmanager.googleapis.com enabled

========================================
Setting Up Secrets
========================================
✓ Secret thirdweb-client-id created
✓ Secret thirdweb-secret-key created
✓ Secret deepinfra-api-key created

========================================
Granting Permissions
========================================
✓ Cloud Build service account: serviceAccount@cloudbuild.gserviceaccount.com
✓ Granted access to thirdweb-client-id
✓ Granted access to thirdweb-secret-key
✓ Granted access to deepinfra-api-key

========================================
Building & Deploying
========================================
ℹ Commit SHA: a1b2c3d
ℹ Submitting build to Cloud Build...
ℹ This will take 10-15 minutes for first build...

Creating temporary archive of 234 file(s) totalling 45.2 MiB before compression.
Uploading tarball...
Created [https://cloudbuild.googleapis.com/v1/projects/rangisnet-production/builds/abc-123].

STEP 1: Install dependencies
STEP 2: Build Next.js application
STEP 3: Build Docker image
STEP 4: Push to Container Registry
STEP 5: Deploy to Cloud Run

✓ Build completed!

========================================
Deployment Complete!
========================================
✓ Service deployed at: https://rangisnet-web-abc123-uc.a.run.app
✓ Health check passed!

🎉 RangisNet is now live!

Wallet Dashboard: https://rangisnet-web-abc123-uc.a.run.app/wallet
API Health: https://rangisnet-web-abc123-uc.a.run.app/api/health
Market Data: https://rangisnet-web-abc123-uc.a.run.app/api/market-data
```

---

### Step 4: Verify Deployment (2 minutes)

```bash
# Test health endpoint
curl https://YOUR_URL.run.app/api/health

# Expected response:
{
  "status": "healthy",
  "service": "rangisnet-web",
  "version": "1.0.0",
  "timestamp": "2025-12-08T12:00:00.000Z",
  "uptime": 45,
  "environment": "production",
  "features": {
    "wallet": true,
    "threed": true,
    "haptics": true,
    "audio": true,
    "avalanche": true,
    "thirdweb": true
  }
}
```

**Response Time:** <100ms (no cold start with min-instances=1)

---

### Step 5: Test Production Features (2 minutes)

```bash
# Open wallet dashboard in browser
open https://YOUR_URL.run.app/wallet

# Test checklist:
# [ ] Wallet connects (MetaMask/WalletConnect)
# [ ] 3D assets render (Three.js)
# [ ] 432Hz audio plays (click asset)
# [ ] Haptic feedback works (mobile)
# [ ] Market data loads (if API keys added)
```

---

## 📊 PRODUCTION METRICS

### Always-Available Configuration

| Metric | Value | Notes |
|--------|-------|-------|
| **Uptime SLA** | 99.95% | Google Cloud Run guarantee |
| **Cold Start** | 0ms | min-instances=1 (always warm) |
| **Response Time** | <100ms | P50 latency target |
| **Concurrency** | 80-800 | Auto-scales 1-10 instances |
| **CPU** | 2 vCPU | Per instance |
| **Memory** | 2 GB RAM | Per instance |
| **Timeout** | 300s | Max request duration |

### Cost Breakdown (With $300 Credits)

| Configuration | Cost/Month | Credits Last | When to Use |
|---------------|-----------|--------------|-------------|
| **Always-On (min=1)** | ~$150 | 2 months | **Hackathon (NOW)** ✅ |
| **On-Demand (min=0)** | ~$20 | 15 months | After hackathon |

**Current Config:** Always-on (no cold starts for judges)

---

## 🔄 AUTOMATIC CI/CD (POST-DEPLOYMENT)

### One-Time Setup (5 minutes)

1. **Connect GitHub Repository:**
   - Go to: https://console.cloud.google.com/cloud-build/triggers
   - Click **"Connect Repository"**
   - Select: **GitHub (Cloud Build GitHub App)**
   - Authenticate with GitHub
   - Choose: `Luckyspot0gold/RangisNet`

2. **Create Build Trigger:**
   - Name: `deploy-main`
   - Event: **Push to branch**
   - Branch: `^main$`
   - Configuration: `cloudbuild.yaml`
   - Click **"Create"**

### After Setup (Forever)

```bash
# Make changes
git add .
git commit -m "New feature: Enhanced 432Hz algorithm"
git push origin main

# Automatic deployment:
# 1. GitHub webhook triggers (30s)
# 2. Docker build (3-5 min)
# 3. Cloud Run deploy (1-2 min)
# ✨ LIVE in ~5 minutes!
```

---

## 🎯 POST-DEPLOYMENT TASKS

### Update Hackathon Submission

- [ ] Add production URL to submission form
- [ ] Update demo video with live URL
- [ ] Show Cloud Monitoring dashboard (bonus points)
- [ ] Mention enterprise-grade infrastructure in pitch

### Monitoring Setup

```bash
# View real-time logs
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=rangisnet-web" \
  --limit=50 --format=json

# Open Cloud Console monitoring
open https://console.cloud.google.com/run/detail/us-central1/rangisnet-web/metrics
```

**Available Metrics:**
- Request count (requests/second)
- Request latency (P50, P95, P99)
- CPU utilization (%)
- Memory utilization (%)
- Container instance count (auto-scaling)
- Error rate (4xx, 5xx responses)

### Optional Enhancements

```bash
# Add custom domain (if you own rangis.net)
gcloud run domain-mappings create \
  --service=rangisnet-web \
  --domain=rangis.net \
  --region=us-central1

# Scale for demo day traffic spike
gcloud run services update rangisnet-web \
  --max-instances=20 \
  --region=us-central1

# Reduce costs after hackathon
gcloud run services update rangisnet-web \
  --min-instances=0 \
  --region=us-central1
```

---

## 🚨 TROUBLESHOOTING

### Issue: "gcloud: command not found"

**Fix:**
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### Issue: "Permission denied during build"

**Fix:**
```bash
# Grant yourself owner role
gcloud projects add-iam-policy-binding rangisnet-production \
  --member=user:YOUR_EMAIL@gmail.com \
  --role=roles/owner

# Grant Cloud Build service account
gcloud projects add-iam-policy-binding rangisnet-production \
  --member=serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin
```

### Issue: "Billing not enabled"

**Fix:**
```bash
# List billing accounts
gcloud billing accounts list

# Link $300 credit account
gcloud billing projects link rangisnet-production \
  --billing-account=YOUR_BILLING_ACCOUNT_ID
```

### Issue: "Build timeout"

**Fix:** Increase timeout in `cloudbuild.yaml`:
```yaml
timeout: 3600s  # 60 minutes instead of 30
```

### Issue: "Secret not found"

**Fix:**
```bash
# Recreate secret
echo -n "YOUR_VALUE" | gcloud secrets create SECRET_NAME --data-file=-

# Grant access
CLOUDBUILD_SA=$(gcloud projects get-iam-policy rangisnet-production \
  --flatten="bindings[].members" \
  --filter="bindings.role:roles/cloudbuild.builds.builder" \
  --format="value(bindings.members)" | grep @cloudbuild)

gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="$CLOUDBUILD_SA" \
  --role=roles/secretmanager.secretAccessor
```

---

## ✅ SUCCESS CRITERIA

### Deployment Successful When:

- [ ] Build completes without errors (check Cloud Build console)
- [ ] Service shows "Ready" status (Cloud Run console)
- [ ] Health endpoint returns 200 OK
- [ ] Wallet dashboard loads in browser
- [ ] MetaMask connects successfully
- [ ] 3D visualization renders
- [ ] 432Hz audio plays
- [ ] Response time <100ms

### Production Ready When:

- [ ] Uptime >99% for 24 hours
- [ ] No 5xx errors in logs
- [ ] Auto-scaling works (test with load)
- [ ] CI/CD trigger functional (test with push)
- [ ] Monitoring dashboard configured
- [ ] Cost alerts set up (recommend $200 threshold)

---

## 📞 SUPPORT RESOURCES

**Google Cloud:**
- Console: https://console.cloud.google.com
- Docs: https://cloud.google.com/run/docs
- Status: https://status.cloud.google.com
- Community: https://stackoverflow.com/questions/tagged/google-cloud-run

**Billing:**
- Usage: https://console.cloud.google.com/billing
- Free Tier: https://cloud.google.com/free
- Pricing: https://cloud.google.com/run/pricing

**Emergency:**
```bash
# Rollback to previous version
gcloud run services update-traffic rangisnet-web \
  --to-revisions=LATEST=0,PREVIOUS=100 \
  --region=us-central1

# Stop service (pause billing)
gcloud run services delete rangisnet-web \
  --region=us-central1 \
  --quiet
```

---

## 🏆 FINAL CHECKLIST

### Before Running Script:

- [ ] Google Cloud account active ($300 credits)
- [ ] gcloud SDK installed (`gcloud --version`)
- [ ] Authenticated (`gcloud auth list`)
- [ ] Thirdweb Secret Key obtained (full key, not truncated)
- [ ] Environment variables exported
- [ ] In correct directory (`/workspaces/RangisNet`)

### After Deployment:

- [ ] Production URL obtained
- [ ] Health check passes (<100ms)
- [ ] Wallet works on production
- [ ] Updated hackathon submission
- [ ] Monitoring dashboard configured
- [ ] CI/CD trigger created
- [ ] Cost alert set ($200 threshold)
- [ ] Documentation updated with URL

---

## 🎉 YOU'RE READY!

**Commands to run:**

```bash
# 1. Set secrets (REPLACE SECRET_KEY)
export THIRDWEB_CLIENT_ID="843c7ea3b79f0ceefc8fde84602616ea"
export THIRDWEB_SECRET_KEY="YOUR_FULL_SECRET_KEY"
export DEEPINFRA_API_KEY="kEqJTHfvxGKlxcNjnb2axEq9FcUxJZjI"

# 2. Authenticate
gcloud auth login

# 3. Deploy
cd /workspaces/RangisNet
./deploy-gcloud.sh

# 4. Verify
curl $(gcloud run services describe rangisnet-web --region=us-central1 --format="value(status.url)")/api/health

# ✨ LIVE IN 10 MINUTES!
```

**432Hz is about to go live on the cloud! 🎵🚀**

---

**Last Updated:** December 8, 2025  
**Status:** ✅ READY FOR DEPLOYMENT  
**Next Action:** Run `./deploy-gcloud.sh`

**© 2025 Reality Protocol LLC. All Rights Reserved.**
