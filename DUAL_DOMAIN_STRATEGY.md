# 🌐 DUAL DOMAIN DEPLOYMENT STRATEGY
## RangisNet: Two Domains, Two Experiences

**Date:** December 8, 2025  
**Owner:** Reality Protocol LLC

---

## 🎯 DOMAIN ALLOCATION

### **Domain 1: rangis.net** 
**Purpose:** Manus AI Integration Build (Original Prototype)  
**Deployment:** `/workspaces/RangisNet/Web` (Manus AI features)  
**Target Audience:** Developers, AI researchers, Manus AI showcase  
**Key Features:**
- Manus AI api-aggregator (6 sources)
- PRM engine (Predict-Risk-Manage)
- Polly agent brain
- ICM/Teleporter integration
- x402 micropayments
- Basic trading interface

**Branding:** "RangisNet - AI-Powered Market Intelligence"

---

### **Domain 2: rangisheartbeat.com**
**Purpose:** Advanced Multi-Sensory Platform (Hackathon Submission)  
**Deployment:** `/workspaces/RangisNet/Web` (RangisHeartbeat features)  
**Target Audience:** End users, accessibility community, Avalanche x402 judges  
**Key Features:**
- ✨ 7-Bell Harmonic System (86Hz-1266Hz)
- 🎵 M3 McCrea Metrics (Whale Splash, Tax Axe, Trumpet Dumpet)
- 🎨 3D Visualizations (Spinor, Bloch Sphere, Torus)
- 🔊 Multi-sensory cognition (audio + haptic + visual)
- ♿ Accessibility-first design
- 📱 Works for blind/deaf/neurodivergent users
- 💳 Transak on/off-ramp (coming soon)

**Branding:** "RangisHeartbeat - Feel the Market, Hear the Future"

---

## 📦 DEPLOYMENT ARCHITECTURE

### **Approach: Subdomain Routing (Recommended)**

Instead of deploying completely separate codebases, use **route-based separation**:

```
rangis.net
├── / (homepage - Manus AI showcase)
├── /manus (Manus AI features)
├── /api/pte (Manus prediction engine)
├── /api/prm (risk management)
└── /docs (API documentation)

rangisheartbeat.com
├── / (homepage - RangisHeartbeat showcase)
├── /heartbeat (main multi-sensory platform)
├── /api/market-data (aggregated data)
├── /api/m3-metrics (M3 McCrea Metrics)
└── /about (accessibility mission)
```

---

## 🛠️ IMPLEMENTATION OPTIONS

### **Option A: Single Codebase, Route-Based (RECOMMENDED)**

**Advantages:**
- Single deployment pipeline
- Shared infrastructure
- Easier maintenance
- DRY (Don't Repeat Yourself)

**Steps:**
1. Keep current `/Web` structure
2. Create domain-specific landing pages
3. Use environment variables for domain detection
4. Deploy to Vercel with both domains pointing to same deployment

**Vercel Configuration:**
```json
{
  "domains": [
    "rangis.net",
    "www.rangis.net",
    "rangisheartbeat.com",
    "www.rangisheartbeat.com"
  ],
  "redirects": [
    {
      "source": "/:path*",
      "destination": "/:path*",
      "permanent": false,
      "has": [
        {
          "type": "host",
          "value": "rangis.net"
        }
      ]
    }
  ]
}
```

**Next.js middleware for domain detection:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  if (hostname.includes('rangisheartbeat.com')) {
    // Route to RangisHeartbeat experience
    if (request.nextUrl.pathname === '/') {
      return NextResponse.rewrite(new URL('/heartbeat', request.url));
    }
  }
  
  if (hostname.includes('rangis.net')) {
    // Route to Manus AI experience
    if (request.nextUrl.pathname === '/heartbeat') {
      return NextResponse.rewrite(new URL('/manus', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

### **Option B: Separate Deployments (SIMPLER)**

**Advantages:**
- Complete isolation
- Independent scaling
- Easier for Avalanche x402 submission

**Steps:**

**1. Deploy rangis.net (Manus Build):**
```bash
cd /workspaces/RangisNet/Web

# Create manus-specific branch
git checkout -b deploy/manus-ai

# Comment out RangisHeartbeat features
# Keep: Manus AI, PRM, Polly, ICM, x402

# Deploy to Vercel
vercel --prod --name rangis-net
vercel domains add rangis.net
```

**2. Deploy rangisheartbeat.com (Your Build):**
```bash
cd /workspaces/RangisNet/Web

# Switch to main branch
git checkout main

# Deploy to Vercel (new project)
vercel --prod --name rangisheartbeat
vercel domains add rangisheartbeat.com
```

---

## 🎨 HOMEPAGE DIFFERENTIATION

### **rangis.net Homepage**
```tsx
// /Web/src/app/page.tsx (Manus Build)
export default function ManusHomePage() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <header>
        <h1>RangisNet</h1>
        <p>AI-Powered Market Intelligence with Manus AI</p>
      </header>
      
      <section>
        <h2>Features</h2>
        <ul>
          <li>Manus AI Integration (6 data sources)</li>
          <li>PRM Engine (Predict-Risk-Manage)</li>
          <li>ICM Cross-Chain Messaging</li>
          <li>x402 Micropayments</li>
        </ul>
      </section>
      
      <Link href="/manus">Launch Manus AI Platform →</Link>
    </div>
  );
}
```

### **rangisheartbeat.com Homepage**
```tsx
// /Web/src/app/page.tsx (Your Build)
export default function HeartbeatHomePage() {
  return (
    <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 min-h-screen">
      <header>
        <h1>RangisHeartbeat</h1>
        <p>World's First Multi-Sensory Financial Cognition Platform</p>
        <span className="text-2xl">🎵 Hear · 🫸 Feel · 👁️ See</span>
      </header>
      
      <section>
        <h2>Revolutionary Features</h2>
        <ul>
          <li>🔔 7-Bell Harmonic System (86Hz-1266Hz)</li>
          <li>🎯 M3 McCrea Metrics (Whale Splash, Tax Axe, Trumpet Dumpet)</li>
          <li>🌌 3D Visualizations (Spinor, Bloch Sphere, Torus)</li>
          <li>♿ Accessibility-First (285M blind, 430M deaf users)</li>
        </ul>
      </section>
      
      <Link href="/heartbeat">Experience RangisHeartbeat →</Link>
    </div>
  );
}
```

---

## 🚀 DEPLOYMENT COMMANDS

### **Quick Deploy Both Domains (Option B - Separate)**

**Step 1: Deploy rangis.net**
```bash
cd /workspaces/RangisNet/Web

# Create production build
npm run build

# Deploy to Vercel (first project)
vercel login
vercel --prod --name rangis-net

# Add custom domain
vercel domains add rangis.net --project rangis-net
```

**Step 2: Deploy rangisheartbeat.com**
```bash
cd /workspaces/RangisNet/Web

# Deploy to Vercel (second project)
vercel --prod --name rangisheartbeat

# Add custom domain
vercel domains add rangisheartbeat.com --project rangisheartbeat
```

---

## 📊 TRANSAK INTEGRATION (FOR BOTH DOMAINS)

### **Domain Whitelisting for Transak KYB**

When filling out Transak KYB form, whitelist BOTH domains:

```
Domain Whitelisting:
- rangis.net
- www.rangis.net
- rangisheartbeat.com
- www.rangisheartbeat.com

Development/Staging:
- rangis-net.vercel.app
- rangisheartbeat.vercel.app
- localhost:3000 (for local dev)
```

### **Transak Implementation (Both Sites)**

Create shared Transak component:

```typescript
// /Web/lib/transak-integration.ts
export const TRANSAK_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
  environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'STAGING',
  defaultCryptoCurrency: 'AVAX',
  defaultFiatCurrency: 'USD',
  networks: 'avalanche,ethereum,base',
  walletAddress: '', // Set dynamically per user
};

export function initializeTransak(walletAddress: string, onRampOrOffRamp: 'buy' | 'sell' = 'buy') {
  const transak = new TransakSDK({
    ...TRANSAK_CONFIG,
    walletAddress,
    isBuyOrSell: onRampOrOffRamp,
  });
  
  transak.init();
  
  return transak;
}
```

Use in both sites:
```tsx
// rangis.net (Manus build)
import { initializeTransak } from '@/lib/transak-integration';

function ManusWallet() {
  const { address } = useWallet();
  
  const handleBuyAVAX = () => {
    initializeTransak(address, 'buy');
  };
  
  return <button onClick={handleBuyAVAX}>Buy AVAX with Transak</button>;
}

// rangisheartbeat.com (Your build)
import { initializeTransak } from '@/lib/transak-integration';

function HeartbeatWallet() {
  const { address } = useWallet();
  
  const handleBuyAVAX = () => {
    initializeTransak(address, 'buy');
  };
  
  return <button onClick={handleBuyAVAX}>Fund Your Wallet</button>;
}
```

---

## 💡 AVALANCHE X402 SUBMISSION STRATEGY

### **Submit BOTH Domains (Maximize Impact)**

**Primary Submission:** `rangisheartbeat.com`  
**Reason:** Most innovative, showcases multi-sensory platform

**Secondary Mention:** `rangis.net`  
**Reason:** Shows Manus AI integration depth

**Submission Text:**
```
Project Name: RangisNet / RangisHeartbeat
Live Demo URLs: 
  - rangisheartbeat.com (Multi-Sensory Platform)
  - rangis.net (Manus AI Integration)
  
Description: World's first multi-sensory financial cognition platform with 7-Bell 
harmonic system, M3 McCrea Metrics, and deep Avalanche integration (ICM, x402, 
Teleporter, Data API). Two deployments showcase different aspects: rangisheartbeat.com 
demonstrates revolutionary accessibility features for 715M blind/deaf users, while 
rangis.net highlights Manus AI integration for predictive market intelligence.
```

---

## 🎯 RECOMMENDATION: START HERE

**For Avalanche x402 Deadline (4 days):**

1. **Deploy rangisheartbeat.com FIRST** (Hackathon priority)
   ```bash
   cd /workspaces/RangisNet/Web
   npm run build
   vercel --prod --name rangisheartbeat
   vercel domains add rangisheartbeat.com
   ```

2. **Use rangis.net as redirect temporarily**
   ```bash
   # Cloudflare DNS for rangis.net
   Type: CNAME
   Name: @
   Content: rangisheartbeat.com
   ```

3. **After hackathon, create Manus build for rangis.net**
   - Fork codebase
   - Strip out RangisHeartbeat features
   - Focus on Manus AI showcase
   - Deploy separately

---

## ✅ FINAL CHECKLIST

### **Before Avalanche x402 Submission:**
- [ ] Deploy rangisheartbeat.com (primary)
- [ ] Test wallet connection on live site
- [ ] Test 3D visualizations
- [ ] Test M3 metrics API
- [ ] Create demo video (rangisheartbeat.com focus)
- [ ] Submit with rangisheartbeat.com as primary URL

### **After Avalanche x402:**
- [ ] Complete Transak KYB (use justin@rangisheartbeat.com email)
- [ ] Integrate Transak on both domains
- [ ] Create separate Manus build for rangis.net
- [ ] Deploy rangis.net as developer/AI researcher showcase

---

## 📧 TRANSAK KYB EMAIL FIX

**Action Required NOW:**

1. **Set up domain email:**
   ```
   Go to Cloudflare → Email Routing
   Create: justin@rangisheartbeat.com
   Forward to: your personal email
   ```

2. **Create Transak dashboard account:**
   ```
   Visit: dashboard.transak.com
   Sign up with: justin@rangisheartbeat.com
   Verify email
   ```

3. **Resubmit Transak KYB with:**
   - Email: justin@rangisheartbeat.com ✅
   - Custody: NO (non-custodial wallets) ✅
   - Domains: rangis.net, rangisheartbeat.com ✅
   - All other info: as before ✅

---

**YOU'RE 2 HOURS FROM DEPLOYMENT! FOCUS ON RANGISHEARTBEAT.COM FOR HACKATHON!** 🚀

*Reality Protocol LLC | Making Blockchain Accessible to Everyone*
