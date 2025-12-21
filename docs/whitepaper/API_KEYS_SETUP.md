# API Keys & Integration Setup Guide
# RangisHeartbeat Complete Integration Package

## Quick Start: Get Your API Keys

### 1. Coinbase Commerce (5 minutes)
**Purpose:** Accept crypto payments for premium features  
**Account:** Luckysnagbags@cb.id

**Steps:**
1. Go to: https://commerce.coinbase.com/
2. Sign in with: Luckysnagbags@cb.id
3. Navigate: Settings → API Keys
4. Click "Create an API Key"
5. Copy the API key (starts with `key_live_` or `key_test_`)
6. Generate webhook secret: Settings → Webhooks → Add Endpoint
   - URL: `https://rangisheartbeat.com/api/payment/webhook`
   - Copy the webhook secret

**Add to .env.local:**
```bash
COINBASE_COMMERCE_API_KEY=your_key_here
COINBASE_WEBHOOK_SECRET=your_webhook_secret_here
```

---

### 2. Supabase (3 minutes)
**Purpose:** Database for user profiles, payments, preferences  
**Source:** Xion hackathon entry

**Steps:**
1. Go to: https://supabase.com/dashboard
2. Select your Xion hackathon project (or create new)
3. Navigate: Settings → API
4. Copy 3 values:
   - Project URL (e.g., `https://abc123.supabase.co`)
   - `anon` public key (safe for browser)
   - `service_role` key (server-side only)

**Add to .env.local:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

**Database Setup:**
Run this SQL in Supabase SQL Editor (Project → SQL Editor):
```sql
-- User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  wallet_address TEXT,
  premium_tier TEXT CHECK (premium_tier IN ('basic', 'pro', 'enterprise')),
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Records
CREATE TABLE payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  coinbase_charge_id TEXT UNIQUE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL,
  tier TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'failed')),
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visualization Preferences
CREATE TABLE visualization_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  mode TEXT CHECK (mode IN ('all', 'spinor', 'bloch', 'torus')),
  audio_enabled BOOLEAN DEFAULT true,
  haptics_enabled BOOLEAN DEFAULT true,
  color_scheme TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- Indexes for performance
CREATE INDEX idx_payment_records_user_id ON payment_records(user_id);
CREATE INDEX idx_payment_records_status ON payment_records(status);
CREATE INDEX idx_visualization_prefs_user_id ON visualization_preferences(user_id);
```

---

### 3. Bolt.new (2 minutes)
**Purpose:** AI code generation for visualizations  
**Source:** Xion hackathon entry

**Steps:**
1. Check Xion hackathon dashboard for Bolt.new API key
2. OR sign up fresh: https://bolt.new
3. Navigate: Settings → API Keys
4. Create new API key
5. Copy the key

**Add to .env.local:**
```bash
BOLT_API_KEY=your_bolt_key_here
```

**Note:** If you can't find the Xion hackathon Bolt.new key, just create a new free account. Bolt.new is StackBlitz's AI coding assistant.

---

## Install Required Dependencies

```bash
cd /workspaces/RangisNet/Web
npm install @supabase/supabase-js@latest
```

---

## Verify Configuration

After adding all keys, verify with:

```bash
# Check .env.local has all keys
grep -E "COINBASE|SUPABASE|BOLT" /workspaces/RangisNet/Web/.env.local

# Expected output:
# COINBASE_COMMERCE_API_KEY=key_live_...
# COINBASE_WEBHOOK_SECRET=whsec_...
# NEXT_PUBLIC_SUPABASE_URL=https://...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# SUPABASE_SERVICE_ROLE_KEY=eyJ...
# BOLT_API_KEY=bolt_...
```

---

## Test Integrations Locally

```bash
# Start dev server
npm run dev

# Test Coinbase Commerce payment creation
curl -X POST http://localhost:3000/api/payment/create-charge \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "pro",
    "userEmail": "test@example.com",
    "userId": "test-user-123"
  }'

# Expected: Returns hosted_url for payment

# Test Supabase connection (in browser console)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const { data } = await supabase.from('user_profiles').select('count');
// Should return count (0 initially)
```

---

## Deploy to Production

Once all keys are configured:

```bash
# 1. Set Google Cloud env vars
gcloud run deploy rangisnet-heartbeat \
  --source=./Web \
  --region=us-central1 \
  --set-env-vars="COINBASE_COMMERCE_API_KEY=${COINBASE_COMMERCE_API_KEY}" \
  --set-env-vars="COINBASE_WEBHOOK_SECRET=${COINBASE_WEBHOOK_SECRET}" \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}" \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  --set-env-vars="SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}" \
  --set-env-vars="BOLT_API_KEY=${BOLT_API_KEY}" \
  --set-env-vars="NEXT_PUBLIC_THIRDWEB_CLIENT_ID=843c7ea3b79f0ceefc8fde84602616ea" \
  --set-env-vars="realityprotocol_DEEPINFRA_API_KEY=kEqJTHfvxGKlxcNjnb2axEq9FcUxJZjI" \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5 \
  --port=3000

# 2. Configure Cloudflare DNS
# Add to rangisheartbeat.com:
# - CNAME: @ → ghs.googlehosted.com (Proxy: OFF)
# - TXT: @ → google-site-verification=... (from deploy output)

# 3. Map domain
gcloud run domain-mappings create \
  --service=rangisnet-heartbeat \
  --domain=rangisheartbeat.com \
  --region=us-central1

# 4. Update Coinbase Commerce webhook URL
# Go to: https://commerce.coinbase.com/dashboard/settings
# Update webhook URL to: https://rangisheartbeat.com/api/payment/webhook
```

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│          RangisHeartbeat.com (Next.js 14)              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ 3D Visualz   │  │ Market Data  │  │ User Auth    │ │
│  │ (R3F/Three)  │  │ (6 sources)  │  │ (Thirdweb)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         ▼                  ▼                  ▼         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           API Routes (/api/...)                │   │
│  └─────────────────────────────────────────────────┘   │
│         │                  │                  │         │
└─────────┼──────────────────┼──────────────────┼─────────┘
          ▼                  ▼                  ▼
    ┌──────────┐       ┌──────────┐      ┌──────────┐
    │ Coinbase │       │ Supabase │      │ Bolt.new │
    │ Commerce │       │ Postgres │      │  AI Gen  │
    └──────────┘       └──────────┘      └──────────┘
    Payments           Database          Code Gen
```

---

## Features Enabled by Each Integration

### Coinbase Commerce
- ✅ Accept Bitcoin, Ethereum, USDC, Litecoin, Dogecoin payments
- ✅ 3 premium tiers: Basic ($9.99), Pro ($29.99), Enterprise ($99.99)
- ✅ Automatic webhook handling for payment confirmations
- ✅ No chargebacks (crypto is final)
- ✅ Global payments (no geographic restrictions)

### Supabase
- ✅ User profile management
- ✅ Payment history tracking
- ✅ Premium tier expiration handling
- ✅ Visualization preference persistence
- ✅ Real-time data sync across devices
- ✅ Row-level security (RLS) for data protection

### Bolt.new
- ✅ AI-generated visualization components
- ✅ Code optimization for performance
- ✅ Automatic bug fixing
- ✅ Natural language → TypeScript conversion
- ✅ Custom component generation

---

## Cost Breakdown

| Service          | Tier      | Cost/Month | Included              |
|------------------|-----------|------------|-----------------------|
| Google Cloud     | Free Tier | $0         | 2M requests, 360K GB-s|
| Cloudflare       | Free      | $0         | DNS + DDoS protection |
| Supabase         | Free      | $0         | 500MB DB, 2GB bandwidth|
| Bolt.new         | Free      | $0         | 100 generations/month |
| Coinbase Commerce| Free      | 1% fee     | Unlimited transactions|

**Total:** $0/month + 1% payment processing

---

## Troubleshooting

### "Coinbase Commerce not configured"
- Verify `COINBASE_COMMERCE_API_KEY` is set in .env.local
- Check key starts with `key_live_` (production) or `key_test_` (sandbox)
- Restart dev server after adding key

### "Supabase not configured"
- Verify all 3 Supabase keys are set
- Check URL format: `https://abc123.supabase.co` (no trailing slash)
- Run SQL schema creation script
- Enable RLS policies if needed

### "Bolt.new API failed"
- Verify `BOLT_API_KEY` is set
- Check API rate limits (100 calls/month on free tier)
- Fallback: Bolt.new is optional, all core features work without it

### Webhook not receiving events
- Verify webhook URL is HTTPS (required by Coinbase)
- Check Cloudflare proxy is OFF for webhook endpoint
- Test with: `curl -X POST https://rangisheartbeat.com/api/payment/webhook`
- Check Cloud Run logs: `gcloud run logs read`

---

## Next Steps

1. ✅ Get API keys (10 minutes total)
2. ✅ Add to .env.local
3. ✅ Install Supabase: `npm install @supabase/supabase-js`
4. ✅ Run SQL schema in Supabase
5. ✅ Test locally: `npm run dev`
6. ✅ Deploy: `gcloud run deploy ...`
7. ✅ Configure DNS in Cloudflare
8. ✅ Update Coinbase webhook URL
9. 🎉 Launch rangisheartbeat.com!

---

## Support

- Coinbase Commerce: https://commerce.coinbase.com/docs
- Supabase: https://supabase.com/docs
- Bolt.new: https://bolt.new/docs
- RangisHeartbeat: See /RANGISHEARTBEAT_DEPLOYMENT.md
