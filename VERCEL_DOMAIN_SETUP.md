# 🎯 Quick Vercel Domain Setup for Rangis.net
## Step-by-Step Guide to Configure Your Domain in Settings

This is a simplified guide for connecting your purchased Rangis.net domain to your RangisNet deployment on Vercel.

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Log In to Vercel

1. Go to [vercel.com/login](https://vercel.com/login)
2. Sign in with your account credentials

### Step 2: Navigate to Your Project

1. From the Vercel dashboard, find your **RangisNet** project
2. Click on the project to open it

### Step 3: Go to Domain Settings

1. Click on **"Settings"** tab at the top
2. Click on **"Domains"** in the left sidebar

### Step 4: Add Your Domain

1. You'll see a text input that says "Add Domain"
2. Type: `rangis.net`
3. Click **"Add"**

### Step 5: Vercel Will Verify Ownership

Since you purchased the domain through Vercel, it will:
- ✅ Automatically recognize you own the domain
- ✅ Configure DNS records automatically
- ✅ Issue SSL certificate
- ✅ Set up HTTPS redirect

You'll see a status indicator showing:
- 🟡 "Pending" → DNS configuration in progress
- 🟢 "Valid Configuration" → Ready to use!

### Step 6: Add www Subdomain (Recommended)

1. Click **"Add"** again
2. Type: `www.rangis.net`
3. Click **"Add"**

This ensures both `rangis.net` and `www.rangis.net` work.

### Step 7: Wait for Activation

- **Expected time:** 5-10 minutes
- **Status:** Watch the domain status change to "Valid Configuration"
- **You're done!** Your site is now live at `https://rangis.net`

---

## 📍 Where to Find Domain Settings in Vercel

```
Vercel Dashboard
└── [Your Project Name]
    └── Settings (top tab)
        └── Domains (left sidebar)
            └── Add Domain (button)
```

### Visual Guide:

1. **Dashboard** → Shows all your projects
2. **Project Page** → Click on "RangisNet" project
3. **Settings Tab** → At the top navigation bar
4. **Domains Section** → In the left sidebar menu
5. **Add Domain Button** → Text input to add new domain

---

## 🔧 No DNS Configuration Needed!

Since you bought the domain from Vercel, you **do NOT need to**:
- ❌ Manually configure DNS records
- ❌ Set up nameservers
- ❌ Use external DNS providers (unless you want to)
- ❌ Create A records or CNAME records manually

**Everything is automatic!** Vercel handles all DNS configuration for you.

---

## 🌐 Alternative: Using Cloudflare DNS

If you want to use Cloudflare for DNS instead of Vercel's automatic DNS:

### Quick Answer: **You Don't Need To!**

Vercel's automatic DNS is:
- ✅ Simpler to set up
- ✅ Faster to activate
- ✅ Automatically maintained
- ✅ Includes SSL/HTTPS
- ✅ Global edge network

### When to Use Cloudflare:

Only consider Cloudflare if you specifically need:
- Advanced DDoS protection
- Custom page rules
- Advanced caching strategies
- Web Application Firewall (WAF)
- Detailed traffic analytics

If you still want to use Cloudflare, see the full guide: [DNS_CONFIGURATION_GUIDE.md](./DNS_CONFIGURATION_GUIDE.md)

---

## ✅ Verification Checklist

After adding your domain in Vercel settings:

- [ ] Domain status shows "Valid Configuration" (green)
- [ ] SSL certificate shows "Issued" with green checkmark
- [ ] Visit `https://rangis.net` - Site loads correctly
- [ ] Visit `https://www.rangis.net` - Site loads correctly
- [ ] Visit `http://rangis.net` - Redirects to HTTPS
- [ ] Browser shows green padlock (secure connection)

---

## 🐛 Troubleshooting

### Issue: "Domain is not available"

**Cause:** Domain might be assigned to another project or user

**Solution:**
1. Go to [vercel.com/dashboard/domains](https://vercel.com/dashboard/domains)
2. Check if `rangis.net` is listed
3. If it's assigned to another project, click "Remove"
4. Add it to your correct project

### Issue: "Configuration Error"

**Cause:** DNS records conflicting or not set up correctly

**Solution:**
1. In Vercel Domains settings, click "Refresh" button
2. Wait 5-10 minutes
3. If still not working, click "Edit" → "Reset DNS Configuration"

### Issue: "SSL Certificate Failed"

**Cause:** SSL certificate issuance delayed

**Solution:**
1. Wait 10-15 minutes (SSL can take time)
2. Click "Refresh SSL Certificate" button
3. Ensure domain DNS is pointing correctly
4. Contact Vercel support if persists after 1 hour

### Issue: "Site Not Loading"

**Cause:** DNS propagation in progress

**Solution:**
1. Wait 15-30 minutes
2. Clear browser cache
3. Try in incognito/private browsing mode
4. Check DNS propagation: https://whatsmydns.net

---

## 📊 Domain Configuration Overview

```
Rangis.net (Your Domain)
└── DNS Management: Vercel (Automatic)
└── SSL Certificate: Vercel (Automatic)
└── Edge Network: Vercel Global CDN
└── HTTPS Redirect: Enabled (Automatic)
└── www Redirect: Configured (Automatic)
```

### What Vercel Automatically Configures:

| Setting | Value | Status |
|---------|-------|--------|
| DNS Provider | Vercel DNS | ✅ Automatic |
| A Record | 76.76.21.21 | ✅ Automatic |
| CNAME (www) | cname.vercel-dns.com | ✅ Automatic |
| SSL Certificate | Let's Encrypt | ✅ Automatic |
| HTTPS Redirect | Enabled | ✅ Automatic |
| Edge Network | Global CDN | ✅ Automatic |

---

## 🎯 Next Steps After Domain Setup

### 1. Deploy Your Application

```bash
cd /home/runner/work/RangisNet/RangisNet/Web
vercel --prod
```

### 2. Set Environment Variables

In Vercel Settings → Environment Variables, add:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

### 3. Configure Production URLs

Update any hardcoded URLs in your code to use the domain:

```typescript
// Before
const API_URL = 'http://localhost:3000/api';

// After
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://rangis.net/api' 
  : 'http://localhost:3000/api';
```

### 4. Set Up Subdomains (Optional)

Create subdomains for different services:

```
api.rangis.net    → API endpoints
app.rangis.net    → Main application
docs.rangis.net   → Documentation
demo.rangis.net   → Demo environment
```

Add each subdomain in Vercel Settings → Domains

---

## 📞 Getting Help

### Vercel Support
- **Email:** support@vercel.com
- **Discord:** https://vercel.com/discord
- **Docs:** https://vercel.com/docs/concepts/projects/domains

### Include This Info When Asking for Help:
- Domain name: `rangis.net`
- Project name: `RangisNet`
- Error message or screenshot
- What you've already tried

---

## 📝 Summary

To connect your Rangis.net domain purchased from Vercel:

1. ✅ Log in to Vercel
2. ✅ Go to your project → Settings → Domains
3. ✅ Add `rangis.net` and `www.rangis.net`
4. ✅ Wait 5-10 minutes for automatic configuration
5. ✅ Verify site loads at `https://rangis.net`
6. ✅ Done! No manual DNS setup needed.

**That's it!** Vercel handles everything automatically because you purchased the domain through them.

---

## 🔗 Related Guides

- **Full DNS Guide:** [DNS_CONFIGURATION_GUIDE.md](./DNS_CONFIGURATION_GUIDE.md)
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Dual Domain Strategy:** [DUAL_DOMAIN_DEPLOYMENT.md](./DUAL_DOMAIN_DEPLOYMENT.md)

---

**🎉 Your domain is ready to go live!**

*Reality Protocol LLC - Making Web3 Accessible*
