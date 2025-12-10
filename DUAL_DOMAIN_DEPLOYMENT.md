# 🌐 DUAL DOMAIN DEPLOYMENT GUIDE
## rangisheartbeat.com vs rangis.net Strategy

**Reality Protocol LLC Multi-Domain Ecosystem**  
**Date:** December 8, 2025

---

## 🎯 STRATEGY OVERVIEW

### **The Power of Two Domains:**

**rangisheartbeat.com** (Primary - YOUR Innovation)
- Multi-sensory financial cognition platform
- 7-Bell harmonic system (86Hz-1266Hz)
- M3 McCrea Metrics (Whale Splash, Tax Axe, Trumpet Dumpet, Market Melee)
- RangisHeartbeat 3D visualizations
- **Submit THIS to Avalanche x402 hackathon** 🏆

**rangis.net** (Secondary - Manus AI Build)
- Original prototype with Manus AI integration
- Demonstrates AI agnostic architecture
- Tech showcase for enterprise partners
- Keep as legacy/demo site

---

## 🚀 DEPLOYMENT OPTION 1: SEPARATE VERCEL PROJECTS (RECOMMENDED)

### **Step 1: Deploy rangisheartbeat.com (PRIORITY)**

```bash
# Navigate to your advanced build
cd /workspaces/RangisNet/Web

# Ensure environment variables are set
cat .env.local | grep NEXT_PUBLIC_THIRDWEB_CLIENT_ID
# Should show: NEXT_PUBLIC_THIRDWEB_CLIENT_ID=843c7ea3b79f0ceefc8fde84602616ea

# Build locally first
npm run build

# If build succeeds, deploy
vercel login
# Enter credentials when prompted

# Deploy to production
vercel --prod

# When Vercel asks:
# ? Set up and deploy? → Y
# ? Which scope? → Your account
# ? Link to existing project? → N
# ? What's your project's name? → rangisheartbeat
# ? In which directory is your code? → ./
# ? Want to override settings? → N

# Add custom domain
vercel domains add rangisheartbeat.com --project rangisheartbeat

# Set as production domain
vercel alias rangisheartbeat-xxx.vercel.app rangisheartbeat.com
```

**Cloudflare DNS Configuration:**
```
# Go to Cloudflare Dashboard → rangisheartbeat.com → DNS

# Add CNAME record:
Type: CNAME
Name: @
Content: cname.vercel-dns.com
Proxy: OFF (Orange cloud disabled)
TTL: Auto

# Add CNAME for www:
Type: CNAME  
Name: www
Content: cname.vercel-dns.com
Proxy: OFF
TTL: Auto

# Wait 5-10 minutes for DNS propagation
```

### **Step 2: Deploy rangis.net (Later)**

```bash
# Create separate directory for Manus build
mkdir -p /workspaces/RangisNet/Web-Manus
cd /workspaces/RangisNet/Web-Manus

# Copy Manus-specific files
# (or git checkout older commit with Manus build)
cp -r /path/to/manus/build/* .

# Deploy as separate project
vercel login
vercel --prod

# When Vercel asks:
# ? What's your project's name? → rangis-manus
# ? In which directory is your code? → ./

# Add custom domain
vercel domains add rangis.net --project rangis-manus
vercel alias rangis-manus-xxx.vercel.app rangis.net
```

---

## 🚀 DEPLOYMENT OPTION 2: MONOREPO WITH SUBDOMAINS

### **Project Structure:**
```
RangisNet/
├── Web/                          # rangisheartbeat.com
│   ├── src/
│   ├── lib/
│   └── vercel.json
├── Web-Manus/                    # rangis.net
│   ├── src/
│   ├── lib/
│   └── vercel.json
└── .github/
    └── workflows/
        ├── deploy-heartbeat.yml  # Auto-deploy rangisheartbeat.com
        └── deploy-manus.yml      # Auto-deploy rangis.net
```

### **Automated Deployment with GitHub Actions:**

**File:** `.github/workflows/deploy-heartbeat.yml`
```yaml
name: Deploy RangisHeartbeat

on:
  push:
    branches: [main]
    paths:
      - 'Web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./Web
        run: npm install
      
      - name: Build
        working-directory: ./Web
        run: npm run build
        env:
          NEXT_PUBLIC_THIRDWEB_CLIENT_ID: ${{ secrets.THIRDWEB_CLIENT_ID }}
          NEXT_PUBLIC_CHAIN_ID: 43113
      
      - name: Deploy to Vercel
        working-directory: ./Web
        run: |
          npm i -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_HEARTBEAT }}
```

---

## 🚀 DEPLOYMENT OPTION 3: GOOGLE CLOUD RUN (ALTERNATIVE)

### **rangisheartbeat.com on Cloud Run:**

```bash
cd /workspaces/RangisNet/Web

# Authenticate
gcloud auth login
gcloud config set project rangisnet-production

# Deploy
gcloud run deploy rangisheartbeat \
  --source=. \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5 \
  --set-env-vars="NEXT_PUBLIC_THIRDWEB_CLIENT_ID=843c7ea3b79f0ceefc8fde84602616ea,NEXT_PUBLIC_CHAIN_ID=43113,NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc"

# Get deployment URL
gcloud run services describe rangisheartbeat \
  --region=us-central1 \
  --format='value(status.url)'

# Map custom domain
gcloud run domain-mappings create \
  --service=rangisheartbeat \
  --domain=rangisheartbeat.com \
  --region=us-central1

# Follow DNS instructions provided
```

---

## 📊 RECOMMENDED ARCHITECTURE

### **Best Practice: Separate Deployments**

**Why?**
1. **Independent Scaling** - Each site scales based on its traffic
2. **Isolated Failures** - If one breaks, the other stays up
3. **Different Dependencies** - Manus build vs your build have different packages
4. **Easier Rollbacks** - Can revert one without affecting the other
5. **Clear Analytics** - Separate Vercel/Cloud Run projects = separate metrics

**Deployment Matrix:**

| Domain | Platform | Purpose | Priority |
|--------|----------|---------|----------|
| rangisheartbeat.com | Vercel | Hackathon submission, production app | 🔥 HIGH |
| rangis.net | Vercel | Manus AI demo, tech showcase | 🟡 MEDIUM |
| app.realityprotocol.io | Vercel | Alias to rangisheartbeat.com | 🟢 LOW |
| demo.realityprotocol.io | Vercel | Alias to rangis.net | 🟢 LOW |

---

## 🎯 HACKATHON SUBMISSION STRATEGY

### **Submit rangisheartbeat.com (NOT rangis.net)**

**Reasons:**
1. ✅ **Your innovation** - 7-Bell, M3 metrics, RangisHeartbeat
2. ✅ **Most advanced** - Latest features, best performance
3. ✅ **Better branding** - "Heartbeat" implies life, cognition, accessibility
4. ✅ **Production-ready** - Polished UI, comprehensive features
5. ✅ **Aligns with vision** - Reality Protocol brand (rangis is "Michael Jordan accessory")

**Avalanche x402 Submission Form:**
```
Project Name: RangisHeartbeat
Live Demo URL: https://rangisheartbeat.com
GitHub Repository: https://github.com/Luckyspot0gold/RangisNet
Company: Reality Protocol LLC
Contact Email: justin@realityprotocol.io

Description:
RangisHeartbeat is the world's first multi-sensory financial cognition
platform, making blockchain accessible to 715 million blind and deaf
people through 7-Bell harmonic system (86Hz-1266Hz audio) and M3 McCrea
Metrics (Whale Splash, Tax Axe, Trumpet Dumpet, Market Melee).

Built on Avalanche with deep integration: ICM cross-chain messaging,
Teleporter protocol, x402 micropayments, and Avalanche Data API.

Reality Protocol LLC (Sheridan, Wyoming + Denver, Colorado) is building
the Wyoming Fort Knox of Crypto - a multi-domain ecosystem including
rangisheartbeat.com, cryptoclashers.games, and stoneyard.cash.

Patent-pending IP (432Hz Harmonic Market Cognition, Aug 2025).
AI agnostic architecture (works with any AI model).
Non-custodial (users maintain full sovereignty).

Demo rangis.net to see our Manus AI integration, but rangisheartbeat.com
is our production platform and primary submission.
```

---

## 🛠️ QUICK DEPLOYMENT CHECKLIST

### **Pre-Deployment (5 min):**
- [ ] Verify .env.local has all required variables
- [ ] Test build locally: `npm run build`
- [ ] Check for TypeScript errors: `npm run type-check` (if exists)
- [ ] Verify package.json has correct dependencies
- [ ] Ensure Node version matches (18.x recommended)

### **Deployment (15 min):**
- [ ] Login to Vercel: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Add domain: `vercel domains add rangisheartbeat.com`
- [ ] Configure Cloudflare DNS (CNAME records)
- [ ] Wait for SSL certificate (automatic, ~5-10 min)

### **Post-Deployment (10 min):**
- [ ] Test homepage: `curl https://rangisheartbeat.com`
- [ ] Test heartbeat page: `curl https://rangisheartbeat.com/heartbeat`
- [ ] Test API: `curl https://rangisheartbeat.com/api/market-data/AVAX`
- [ ] Test wallet connection (manual in browser)
- [ ] Test 3D visualizations (manual in browser)
- [ ] Check browser console for errors

---

## 🔧 TROUBLESHOOTING

### **Issue: "Domain not found"**
```bash
# Check Cloudflare DNS propagation
dig rangisheartbeat.com
dig www.rangisheartbeat.com

# Should show CNAME pointing to cname.vercel-dns.com
# If not, wait 5-10 more minutes
```

### **Issue: "Build failed"**
```bash
# Check build logs
cat .next/trace | grep error

# Common fixes:
npm install  # Reinstall dependencies
rm -rf .next node_modules  # Clean cache
npm install
npm run build
```

### **Issue: "Environment variables not found"**
```bash
# Verify .env.local
cat .env.local | grep NEXT_PUBLIC

# Add to Vercel dashboard:
vercel env add NEXT_PUBLIC_THIRDWEB_CLIENT_ID production
# Enter: 843c7ea3b79f0ceefc8fde84602616ea

vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 43113
```

---

## 📱 TESTING CHECKLIST

### **Desktop Testing:**
- [ ] Homepage loads (<3 seconds)
- [ ] Heartbeat page loads
- [ ] Wallet connection works (MetaMask, Coinbase Wallet)
- [ ] 3D visualizations render (Spinor, Bloch, Torus)
- [ ] Audio toggle works (hear 432Hz-1266Hz tones)
- [ ] Symbol selector changes data (AVAX, BTC, ETH, etc.)
- [ ] API endpoints respond (check Network tab)

### **Mobile Testing:**
- [ ] Responsive layout works (no horizontal scroll)
- [ ] Touch controls work (pinch, zoom, rotate 3D models)
- [ ] Haptic vibration works (toggle haptics on)
- [ ] Audio plays without autoplay restrictions
- [ ] Wallet Connect works (mobile wallet apps)

---

## 🎬 FINAL DEPLOYMENT COMMAND (COPY-PASTE)

```bash
# ONE-COMMAND DEPLOYMENT (rangisheartbeat.com)
cd /workspaces/RangisNet/Web && \
npm run build && \
vercel login && \
vercel --prod --name rangisheartbeat && \
vercel domains add rangisheartbeat.com && \
echo "✅ Deployed! Configure DNS in Cloudflare:"
echo "   CNAME @ → cname.vercel-dns.com"
echo "   CNAME www → cname.vercel-dns.com"
echo ""
echo "🎉 Your site will be live at https://rangisheartbeat.com in 5-10 min"
```

---

## 🏆 SUCCESS METRICS

**After Deployment:**
- ✅ Homepage loads: https://rangisheartbeat.com
- ✅ Heartbeat page works: https://rangisheartbeat.com/heartbeat
- ✅ API responds: https://rangisheartbeat.com/api/market-data/AVAX
- ✅ SSL certificate valid (green padlock)
- ✅ No console errors
- ✅ Wallet connects to Avalanche Fuji (Chain ID 43113)
- ✅ 3D visualizations render smoothly (60fps)
- ✅ Audio system works (7-Bell harmonic system)

**Ready for:**
- ✅ Avalanche x402 hackathon submission
- ✅ Demo video recording
- ✅ Investor presentations
- ✅ User testing

---

**🚀 NOW DEPLOY AND WIN! 🏆**

*Reality Protocol LLC*  
*justin@realityprotocol.io*  
*Building the Wyoming Fort Knox of Crypto*
