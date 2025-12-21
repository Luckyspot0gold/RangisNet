# 🚀 Quick Start - RangisHeartbeat Deployment

## 3 Paths to Production

### Path 1: Ultra-Fast Deploy (15 min) - No API Keys Needed
```bash
cd /workspaces/RangisNet/Web
npm install @supabase/supabase-js
gcloud auth login
gcloud run deploy rangisnet-heartbeat --source=. --region=us-central1 \
  --set-env-vars="NEXT_PUBLIC_THIRDWEB_CLIENT_ID=843c7ea3b79f0ceefc8fde84602616ea" \
  --allow-unauthenticated --memory=512Mi --min-instances=0
```
**Result:** Core 3D visualizations live (no payments, no database)

---

### Path 2: Get API Keys First (10 min)
1. **Coinbase Commerce** (5 min): https://commerce.coinbase.com/dashboard/settings
   - Account: Luckysnagbags@cb.id
   - Copy API key + webhook secret

2. **Supabase** (3 min): https://supabase.com/dashboard
   - Copy URL + anon key + service role key
   - Run SQL schema (in /Web/lib/supabase-client.ts)

3. **Bolt.new** (2 min): https://bolt.new
   - Copy API key

4. **Add to .env.local:**
```bash
COINBASE_COMMERCE_API_KEY=your_key
COINBASE_WEBHOOK_SECRET=your_secret
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
BOLT_API_KEY=...
```

---

### Path 3: Full Deployment with All Integrations (35 min)
**See:** `/DEPLOY_WITH_INTEGRATIONS.md` for complete 9-step guide

---

## Files You Created

### Integration Code (17.5 KB)
- `/Web/lib/coinbase-commerce.ts` - Payment system
- `/Web/lib/supabase-client.ts` - Database + schema
- `/Web/lib/bolt-client.ts` - AI code generation

### API Routes (3.7 KB)
- `/Web/src/app/api/payment/create-charge/route.ts`
- `/Web/src/app/api/payment/webhook/route.ts`

### Documentation (33 KB)
- `/API_KEYS_SETUP.md` - Get credentials
- `/DEPLOY_WITH_INTEGRATIONS.md` - Full deployment
- `/INTEGRATION_SUMMARY.md` - What was built

---

## Current Status

✅ **Working Now:**
- All 3D visualizations (Spinor, Bloch, Torus)
- 7-Bell audio system (86Hz to 1266Hz)
- Market data (6 sources, 5s updates)
- Haptic feedback
- User controls

⏳ **Needs API Keys:**
- Coinbase Commerce (payments)
- Supabase (database)
- Bolt.new (AI features)

---

## Cost: $0/month

Everything runs on free tiers:
- Google Cloud: Free (2M requests/month)
- Cloudflare: Free (DNS)
- Supabase: Free (500MB DB)
- Bolt.new: Free (100 generations/month)
- Coinbase: 1% fee on payments only

---

## Next Command

**Choose your path above, then:**
```bash
# For Path 1 or 3:
cd /workspaces/RangisNet
cat DEPLOY_WITH_INTEGRATIONS.md
```

**For Path 2:**
```bash
cat API_KEYS_SETUP.md
```

---

**Domain:** rangisheartbeat.com (already registered)  
**Deployment time:** 15-35 minutes (depending on path)  
**Production URL:** https://rangisheartbeat.com/heartbeat
