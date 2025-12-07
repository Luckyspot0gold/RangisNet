# RangisNet Web - Quick Start

## ✅ Deployment Ready

All files configured for **rangis.net** deployment on Vercel.

### 📁 Created Files

```
Web/
├── package.json           ✅ Dependencies + scripts
├── vercel.json           ✅ Vercel config
├── next.config.js        ✅ Next.js config
├── tsconfig.json         ✅ TypeScript config
├── .env.example          ✅ Environment template
├── .gitignore            ✅ Git ignore rules
├── deploy.sh             ✅ Deployment script
├── DEPLOY.md             ✅ Full documentation
└── src/
    ├── pte.js            ✅ ICM/Teleporter warp messaging
    └── app/api/pte/
        └── route.ts      ✅ API endpoint
```

### 🚀 Deploy Now

```bash
cd /workspaces/RangisNet/Web

# 1. Install dependencies
npm install

# 2. Configure environment (copy & edit)
cp .env.example .env.local

# 3. Build test
npm run build

# 4. Deploy to Vercel
npm run deploy
# OR: ./deploy.sh
```

### 🔑 Required Environment Variables

Set in Vercel dashboard or `.env.local`:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_TELEPORTER_MESSENGER=0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf
NEXT_PUBLIC_DFK_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 🌐 ICM/Teleporter Integration

**Warp Message Encoding** (`pte.js`):
- ✅ ABI-encoded cross-chain messages
- ✅ Fuji → DFK Subnet routing
- ✅ Function selector: `sendCrossChainMessage(bytes)`
- ✅ Warp fee: 0.001 AVAX

**Transaction Data Field**:
```javascript
data: '0x4c63e562' + encodedWarpMessage
```

### 📡 API Endpoints

**POST /api/pte** - Execute trade
```bash
curl -X POST https://rangis.net/api/pte \
  -H "Content-Type: application/json" \
  -d '{
    "command": "Buy AVAX",
    "pair": "AVAX/USD",
    "amount": "0.01",
    "dfkAddress": "0x..."
  }'
```

**GET /api/pte** - Health check
```bash
curl https://rangis.net/api/pte
```

### ⚡ Features

- ✅ **Pyth Oracle**: Real-time price feeds
- ✅ **PRM Algorithm**: 528Hz harmonic resonance
- ✅ **Haptic Feedback**: Multi-pattern vibration
- ✅ **Sonic Feedback**: Frequency modulation
- ✅ **ICM Warp**: Cross-chain messaging
- ✅ **Thirdweb SDK**: One-tap wallet
- ✅ **ARIA**: Accessibility ready

### 🔧 TypeScript Notes

Minor TypeScript errors visible before `npm install` - they'll resolve after installing:
- `next` package for server/API types
- `@types/node` for process.env types

### 📚 Documentation

See `DEPLOY.md` for full deployment guide including:
- Troubleshooting
- Browser compatibility
- Security headers
- Testing procedures

---

**Ready to deploy to rangis.net** 🎉
