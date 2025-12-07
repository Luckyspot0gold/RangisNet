# RangisNet Web Deployment Guide

## 🚀 Vercel Deployment (rangis.net)

### Prerequisites
- Node.js 18+ installed
- Vercel account with domain `rangis.net` configured
- Thirdweb API key

### Quick Deploy

1. **Install Dependencies**
   ```bash
   cd /workspaces/RangisNet/Web
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Deploy to Vercel**
   ```bash
   npm run deploy
   # Or link to Vercel:
   vercel link
   vercel --prod
   ```

### Environment Variables (Vercel Dashboard)

Set these in Vercel project settings:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_TELEPORTER_MESSENGER=0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf
NEXT_PUBLIC_DFK_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## 🧪 Local Development

```bash
npm run dev
# Open http://localhost:3000
```

## 🔧 PTE API Endpoints

### POST /api/pte
Execute trade with PRM analysis:
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

### GET /api/pte
Health check:
```bash
curl https://rangis.net/api/pte
```

## 🌐 Cross-Chain Routing

The PTE handler uses **Avalanche ICM (Teleporter)** for cross-chain messages:

1. **Source**: Fuji C-Chain (testnet)
2. **Destination**: DFK Subnet or custom subnet
3. **Teleporter Address**: `0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf`

### Warp Message Format
```javascript
encodeWarpMessage({
  destinationChainId: '0x0001',
  destinationAddress: '0x...',
  payload: encodedTradeData,
  fee: parseEther('0.001')
})
```

## 📊 Features

- ✅ **Pyth Oracle**: Real-time AVAX/USD prices
- ✅ **PRM Algorithm**: Patented probability calculation
- ✅ **Multi-Sensory**: Haptic (vibration) + Sonic (528Hz)
- ✅ **ICM/Teleporter**: Cross-chain warp routing
- ✅ **Thirdweb SDK**: One-tap wallet connection
- ✅ **ARIA**: Accessibility compliance

## 🔍 Testing

```bash
# Build check
npm run build

# Lint check
npm run lint

# Test API locally
curl http://localhost:3000/api/pte
```

## 📱 Browser Compatibility

- Chrome/Edge: ✅ (Full support)
- Firefox: ✅ (Full support)
- Safari: ⚠️ (Haptic limited to iOS)
- Mobile: ✅ (Best experience with haptic feedback)

## 🔐 Security Headers

Configured in `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- Permissions-Policy (vibrate access)

## 🐛 Troubleshooting

### Build fails with crypto error
- Check `next.config.js` webpack fallbacks
- Ensure polyfills are installed

### Teleporter transaction fails
- Verify Teleporter address for network
- Check warp fee (minimum 0.001 AVAX)
- Ensure sufficient gas limit (500k+)

### Audio not playing
- User interaction required before AudioContext
- Check browser autoplay policies

## 📄 License

See `/Doc/IP-NOTICE.md` for patent information.
