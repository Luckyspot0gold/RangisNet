# 🚀 GOOGLE CLOUD QUICK START — 5 COMMANDS TO PRODUCTION

## ⚡ FASTEST PATH (30 Minutes)

### 1️⃣ Install Google Cloud SDK (if needed)

```bash
# Check if installed
gcloud --version

# If not installed:
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

---

### 2️⃣ Login & Set Project

```bash
# Login to Google Cloud
gcloud auth login

# Create project (or use existing)
export PROJECT_ID="rangisnet-production"
gcloud projects create $PROJECT_ID --name="RangisNet"
gcloud config set project $PROJECT_ID

# Enable billing (link your $300 credit account)
gcloud billing accounts list
gcloud billing projects link $PROJECT_ID --billing-account=YOUR_ACCOUNT_ID
```

---

### 3️⃣ Create Secrets

```bash
# Thirdweb Client ID
echo -n "843c7ea3b79f0ceefc8fde84602616ea" | \
  gcloud secrets create thirdweb-client-id --data-file=-

# Thirdweb Secret Key (get full key from dashboard)
echo -n "YOUR_FULL_SECRET_KEY" | \
  gcloud secrets create thirdweb-secret-key --data-file=-

# DeepInfra API Key
echo -n "kEqJTHfvxGKlxcNjnb2axEq9FcUxJZjI" | \
  gcloud secrets create deepinfra-api-key --data-file=-
```

---

### 4️⃣ Deploy (Automatic)

```bash
cd /workspaces/RangisNet
./deploy-gcloud.sh
```

**OR Manual:**

```bash
# Enable APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com secretmanager.googleapis.com

# Build & Deploy
gcloud builds submit --config=cloudbuild.yaml .
```

---

### 5️⃣ Get Your URL

```bash
# Get service URL
gcloud run services describe rangisnet-web \
  --region=us-central1 \
  --format="value(status.url)"

# Test it
curl $(gcloud run services describe rangisnet-web --region=us-central1 --format="value(status.url)")/api/health
```

---

## 📊 EXPECTED OUTPUT

```json
{
  "status": "healthy",
  "service": "rangisnet-web",
  "version": "1.0.0",
  "timestamp": "2025-12-08T12:00:00.000Z",
  "uptime": 3600,
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

---

## 🎯 YOUR LIVE URLS

After deployment, you'll have:

- **Production Site:** `https://rangisnet-web-xxxxx.run.app`
- **Wallet Dashboard:** `https://rangisnet-web-xxxxx.run.app/wallet`
- **Health Check:** `https://rangisnet-web-xxxxx.run.app/api/health`
- **Market Data API:** `https://rangisnet-web-xxxxx.run.app/api/market-data`

---

## 🔄 AUTOMATIC CI/CD (Setup Once)

### Connect GitHub:

1. Go to: https://console.cloud.google.com/cloud-build/triggers
2. Click **"Connect Repository"**
3. Select **GitHub** → `Luckyspot0gold/RangisNet`
4. Create trigger:
   - Name: `deploy-main`
   - Branch: `^main$`
   - Config: `cloudbuild.yaml`

### Then Forever:

```bash
git add .
git commit -m "Update feature"
git push origin main
# ✨ Live in 5 minutes!
```

---

## 💰 COST WITH $300 CREDITS

| Configuration | Cost/Month | Credits Last |
|---------------|-----------|--------------|
| **Always-On (min-instances=1)** | $150 | 2 months |
| **On-Demand (min-instances=0)** | $20 | 15 months |

**Recommendation:** Start with always-on for hackathon (no cold starts), switch to on-demand after.

---

## 🔧 COMMON COMMANDS

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Scale up
gcloud run services update rangisnet-web --max-instances=20 --region=us-central1

# Scale down (save money)
gcloud run services update rangisnet-web --min-instances=0 --region=us-central1

# Rollback to previous version
gcloud run services update-traffic rangisnet-web --to-revisions=LATEST=0,PREVIOUS=100

# Delete service
gcloud run services delete rangisnet-web --region=us-central1

# View builds
gcloud builds list --limit=10

# Cancel running build
gcloud builds cancel BUILD_ID
```

---

## 🚨 TROUBLESHOOTING

### "Permission Denied"

```bash
# Grant yourself owner role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=user:YOUR_EMAIL@gmail.com \
  --role=roles/owner
```

### "Billing Not Enabled"

```bash
# Link billing account
gcloud billing accounts list
gcloud billing projects link $PROJECT_ID --billing-account=ACCOUNT_ID
```

### "Build Timeout"

```bash
# Increase timeout in cloudbuild.yaml
timeout: 3600s  # 60 minutes
```

### "Secrets Not Found"

```bash
# Recreate secrets
echo -n "YOUR_VALUE" | gcloud secrets create SECRET_NAME --data-file=-

# Grant access to Cloud Build
CLOUDBUILD_SA=$(gcloud projects get-iam-policy $PROJECT_ID --flatten="bindings[].members" --filter="bindings.role:roles/cloudbuild.builds.builder" --format="value(bindings.members)" | grep @cloudbuild)

gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="$CLOUDBUILD_SA" \
  --role=roles/secretmanager.secretAccessor
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Google Cloud SDK installed
- [ ] Authenticated (`gcloud auth login`)
- [ ] Project created (`rangisnet-production`)
- [ ] Billing enabled (linked $300 credit account)
- [ ] APIs enabled (Cloud Build, Cloud Run, Secret Manager)
- [ ] Secrets created (thirdweb-client-id, thirdweb-secret-key, deepinfra-api-key)
- [ ] Build submitted (`gcloud builds submit`)
- [ ] Service deployed (check `gcloud run services list`)
- [ ] Health check passes (`curl .../api/health`)
- [ ] Wallet works (visit `/wallet`)
- [ ] GitHub trigger created (automatic deploys)

---

## 🎉 YOU'RE LIVE!

**Total Time:** 30 minutes  
**Total Cost:** $0 for first 2 months (using $300 credits)  
**Infrastructure:** Enterprise-grade, auto-scaling, global CDN

**Next:** Update your hackathon submission with production URL! 🏆

---

**Questions?** Check `GOOGLE_CLOUD_DEPLOYMENT.md` for full documentation.
