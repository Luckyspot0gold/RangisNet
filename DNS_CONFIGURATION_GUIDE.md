# 🌐 DNS Configuration Guide for Rangis.net
## Complete Setup Instructions for Your Vercel Domain

**Domain:** Rangis.net  
**Registrar:** Vercel Domains  
**Last Updated:** December 15, 2025

---

## 📋 Table of Contents

1. [Understanding Your Options](#understanding-your-options)
2. [Option 1: Use Vercel DNS (Recommended)](#option-1-use-vercel-dns-recommended)
3. [Option 2: Use Cloudflare DNS (Advanced)](#option-2-use-cloudflare-dns-advanced)
4. [Verification Steps](#verification-steps)
5. [Troubleshooting](#troubleshooting)
6. [Next Steps](#next-steps)

---

## 🎯 Understanding Your Options

Since you purchased **Rangis.net** from Vercel, you have two main DNS configuration options:

### **Option 1: Vercel DNS (Recommended for Beginners)**
- ✅ **Simplest setup** - Already integrated with your Vercel account
- ✅ **Automatic SSL** - Free HTTPS certificates
- ✅ **One-click deployment** - Connect domain directly to your project
- ✅ **No external setup** - Everything managed in Vercel dashboard
- ✅ **Fast propagation** - Usually active within 5-10 minutes

### **Option 2: Cloudflare DNS (Advanced)**
- ✅ **Advanced DDoS protection** - Enterprise-grade security
- ✅ **Performance optimization** - Global CDN and caching
- ✅ **Advanced analytics** - Detailed traffic insights
- ✅ **More DNS features** - Custom records, page rules, firewall
- ⚠️ **More complex setup** - Requires changing nameservers
- ⚠️ **Slower initial setup** - Can take up to 24-48 hours

---

## 🚀 Option 1: Use Vercel DNS (Recommended)

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Log in to your account
3. Navigate to **Domains** in the left sidebar

### Step 2: Locate Your Domain

You should see **rangis.net** listed in your domains. If not:

1. Click **"Add Domain"**
2. Enter `rangis.net`
3. Vercel will recognize it as your purchased domain

### Step 3: Connect Domain to Your Project

1. In the Domains section, click on **rangis.net**
2. Click **"Add to Project"** or **"Configure"**
3. Select your RangisNet project from the dropdown
4. Choose which deployment to connect:
   - **Production** (main branch)
   - **Preview** (development branches)

### Step 4: Configure DNS Records

Vercel automatically creates the following DNS records:

```
Type    Name    Value                           TTL
A       @       76.76.21.21                    Auto
AAAA    @       2606:4700:3033::ac43:d28d      Auto
CNAME   www     cname.vercel-dns.com           Auto
```

These records are managed automatically. You don't need to edit them manually.

### Step 5: Add www Subdomain (Optional)

To make both `rangis.net` and `www.rangis.net` work:

1. In your Vercel project settings
2. Go to **Domains**
3. Click **"Add Domain"**
4. Enter `www.rangis.net`
5. Vercel will automatically configure the CNAME record

### Step 6: Wait for DNS Propagation

- **Expected time:** 5-10 minutes
- **Maximum time:** Up to 1 hour
- **Check status:** Vercel will show "Active" when ready

### Step 7: Verify SSL Certificate

1. Once DNS is propagated, Vercel automatically issues SSL
2. You'll see a green "Valid Configuration" badge
3. Your site will be accessible at `https://rangis.net`

---

## 🔧 Option 2: Use Cloudflare DNS (Advanced)

If you want to use Cloudflare for advanced features, follow these steps:

### Step 1: Create Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Add Rangis.net to Cloudflare

1. In Cloudflare dashboard, click **"Add a Site"**
2. Enter `rangis.net`
3. Select **Free Plan**
4. Click **"Add site"**

### Step 3: Cloudflare DNS Scan

Cloudflare will scan existing DNS records. Since this is a new domain, you'll need to add records manually.

### Step 4: Add DNS Records for Vercel

Add the following records in Cloudflare:

#### For Root Domain (rangis.net):

```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy status: DNS only (gray cloud, NOT orange)
TTL: Auto
```

#### For WWW Subdomain:

```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only (gray cloud)
TTL: Auto
```

**Important:** Set proxy status to **DNS only** (gray cloud). The orange cloud can cause SSL issues with Vercel.

### Step 5: Get Cloudflare Nameservers

Cloudflare will provide you with 2 nameservers, like:

```
dana.ns.cloudflare.com
walt.ns.cloudflare.com
```

Copy these nameservers.

### Step 6: Update Nameservers in Vercel

1. Go to [vercel.com/dashboard/domains](https://vercel.com/dashboard/domains)
2. Click on **rangis.net**
3. Go to **Nameservers** tab
4. Click **"Edit Nameservers"**
5. Select **"Custom Nameservers"**
6. Enter the Cloudflare nameservers:
   ```
   dana.ns.cloudflare.com
   walt.ns.cloudflare.com
   ```
7. Click **"Save"**

### Step 7: Wait for Nameserver Propagation

- **Expected time:** 2-24 hours
- **Maximum time:** Up to 48 hours
- **Check status:** Use [whatsmydns.net](https://whatsmydns.net) to check propagation

### Step 8: Verify in Cloudflare

1. Return to Cloudflare dashboard
2. Wait for confirmation that nameservers are active
3. Status will change to **"Active"**

### Step 9: Configure SSL in Cloudflare

1. In Cloudflare, go to **SSL/TLS** tab
2. Set SSL/TLS encryption mode to **"Full"** (not "Full (strict)")
3. Enable **"Always Use HTTPS"**
4. Enable **"Automatic HTTPS Rewrites"**

### Step 10: Add Domain to Vercel Project

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Click **"Add"**
4. Enter `rangis.net`
5. Vercel will verify the domain and issue SSL certificate

---

## ✅ Verification Steps

### Check DNS Configuration

Use these commands in your terminal:

```bash
# Check A record for rangis.net
dig rangis.net A

# Check CNAME record for www.rangis.net
dig www.rangis.net CNAME

# Check nameservers
dig rangis.net NS
```

**Expected output for Vercel DNS:**
```
rangis.net.     A       76.76.21.21
www.rangis.net. CNAME   cname.vercel-dns.com.
rangis.net.     NS      ns1.vercel-dns.com.
rangis.net.     NS      ns2.vercel-dns.com.
```

**Expected output for Cloudflare DNS:**
```
rangis.net.     CNAME   cname.vercel-dns.com.
www.rangis.net. CNAME   cname.vercel-dns.com.
rangis.net.     NS      dana.ns.cloudflare.com.
rangis.net.     NS      walt.ns.cloudflare.com.
```

### Check SSL Certificate

```bash
# Check SSL certificate
curl -I https://rangis.net

# Should show:
# HTTP/2 200
# SSL certificate should be valid
```

### Test in Browser

1. Visit `https://rangis.net` - Should load your site
2. Visit `https://www.rangis.net` - Should also load your site
3. Visit `http://rangis.net` - Should redirect to HTTPS
4. Check for green padlock in browser address bar

---

## 🔍 Troubleshooting

### Issue: "Domain Not Found"

**Cause:** DNS records haven't propagated yet

**Solution:**
1. Wait 10-15 minutes for Vercel DNS
2. Wait 24-48 hours for Cloudflare DNS
3. Clear your DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Issue: "SSL Certificate Error"

**Cause:** SSL certificate not issued yet or proxy misconfigured

**Solution:**
1. **For Vercel:** Wait 5-10 minutes after DNS propagates
2. **For Cloudflare:** Ensure proxy is set to "DNS only" (gray cloud)
3. In Cloudflare, set SSL mode to "Full" (not "Full (strict)")
4. Force SSL renewal in Vercel:
   - Go to project Settings → Domains
   - Click "Refresh" next to your domain

### Issue: "ERR_TOO_MANY_REDIRECTS"

**Cause:** Cloudflare proxy conflicting with Vercel SSL

**Solution:**
1. In Cloudflare DNS, click on the orange cloud next to your records
2. Change to **DNS only** (gray cloud icon)
3. Wait 5 minutes and try again

### Issue: "Domain Already in Use"

**Cause:** Domain is assigned to a different Vercel project

**Solution:**
1. Go to [vercel.com/dashboard/domains](https://vercel.com/dashboard/domains)
2. Find rangis.net
3. Click "Remove" from the old project
4. Add it to your correct project

### Issue: "Invalid Configuration"

**Cause:** DNS records pointing to wrong target

**Solution:**
1. Verify CNAME target is `cname.vercel-dns.com` (not your specific deployment URL)
2. Remove any conflicting A or AAAA records if using Cloudflare
3. Use CNAME for both root (@) and www

### Issue: "Nameservers Not Updating"

**Cause:** Changes can take time to propagate

**Solution:**
1. Check current nameservers:
   ```bash
   dig rangis.net NS
   ```
2. If old nameservers still showing, wait longer (up to 48 hours)
3. Contact Vercel support if no change after 48 hours

---

## 📊 DNS Configuration Comparison

| Feature | Vercel DNS | Cloudflare DNS |
|---------|-----------|----------------|
| **Setup Time** | 5-10 minutes | 2-48 hours |
| **Complexity** | ⭐ Easy | ⭐⭐⭐ Advanced |
| **SSL Certificate** | Automatic | Automatic |
| **DDoS Protection** | Basic | Enterprise-grade |
| **Analytics** | Vercel Analytics | Cloudflare Analytics |
| **Cost** | Free | Free |
| **Recommended For** | Most users | Power users |

---

## 🎯 Next Steps

### After DNS is Configured:

1. **Deploy Your Application**
   ```bash
   cd /home/runner/work/RangisNet/RangisNet/Web
   vercel --prod
   ```

2. **Set Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add required variables from `.env.local`

3. **Test Your Deployment**
   ```bash
   # Test homepage
   curl https://rangis.net
   
   # Test API endpoints
   curl https://rangis.net/api/pte
   ```

4. **Configure Email (Optional)**
   - If using Cloudflare, set up Email Routing
   - Create: `contact@rangis.net` or `admin@rangis.net`

5. **Set Up Analytics**
   - Enable Vercel Analytics in project settings
   - Or use Cloudflare Analytics if using Cloudflare DNS

6. **Configure Domain Aliases**
   - Add `www.rangis.net` as an alias
   - Add other subdomains as needed (e.g., `api.rangis.net`)

---

## 📚 Related Documentation

- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Dual Domain Strategy:** [DUAL_DOMAIN_DEPLOYMENT.md](./DUAL_DOMAIN_DEPLOYMENT.md)
- **Quick Start:** [QUICK_START.md](./QUICK_START.md)
- **API Keys Setup:** [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)

---

## 🔗 Helpful Resources

- **Vercel Domains Docs:** https://vercel.com/docs/concepts/projects/custom-domains
- **Cloudflare DNS Docs:** https://developers.cloudflare.com/dns/
- **DNS Propagation Checker:** https://whatsmydns.net
- **SSL Certificate Checker:** https://www.ssllabs.com/ssltest/
- **Vercel Support:** https://vercel.com/support

---

## 💡 Pro Tips

1. **Start with Vercel DNS** - It's simpler and works great for most use cases
2. **Only use Cloudflare if you need** - Advanced features like WAF, page rules, or enterprise DDoS protection
3. **Don't mix DNS providers** - Use either Vercel OR Cloudflare, not both
4. **Enable HTTPS redirect** - Always force HTTPS for security
5. **Monitor DNS propagation** - Use online tools to check status globally
6. **Keep documentation** - Save your DNS settings in a secure location
7. **Test from multiple locations** - Use VPN or ask friends to test your domain

---

## 🆘 Getting Help

If you need assistance:

1. **Vercel Support:** Email support@vercel.com with your domain name
2. **Cloudflare Support:** Create a support ticket in your dashboard
3. **Community Help:** 
   - Vercel Discord: https://vercel.com/discord
   - Cloudflare Community: https://community.cloudflare.com
4. **GitHub Issues:** Create an issue in this repository

---

## ✨ Quick Reference Commands

```bash
# Check DNS records
dig rangis.net
dig www.rangis.net
dig rangis.net NS

# Check SSL certificate
openssl s_client -connect rangis.net:443 -servername rangis.net

# Test HTTP/HTTPS
curl -I https://rangis.net
curl -I http://rangis.net

# Check DNS propagation globally
nslookup rangis.net 8.8.8.8  # Google DNS
nslookup rangis.net 1.1.1.1  # Cloudflare DNS

# Flush local DNS cache
# macOS: sudo dscacheutil -flushcache
# Windows: ipconfig /flushdns
# Linux: sudo systemd-resolve --flush-caches
```

---

**Ready to go live!** 🚀

Follow **Option 1** for the quickest path to production, or **Option 2** if you need advanced DNS features.

*Reality Protocol LLC - Building the Future of Web3*
