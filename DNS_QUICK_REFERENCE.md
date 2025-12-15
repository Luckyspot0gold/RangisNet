# 📋 Rangis.net DNS Quick Reference Card
## One-Page Guide for Domain Configuration

**Domain:** rangis.net  
**Purchased From:** Vercel  
**Last Updated:** December 15, 2025

---

## 🚀 FASTEST PATH (5 Minutes)

### Use Vercel Automatic DNS

1. **Login:** [vercel.com](https://vercel.com/login)
2. **Navigate:** Project → Settings → Domains
3. **Add Domain:** Enter `rangis.net` and click Add
4. **Add WWW:** Enter `www.rangis.net` and click Add
5. **Wait:** 5-10 minutes for automatic setup
6. **Done!** Visit https://rangis.net

✅ **No manual DNS configuration needed**  
✅ **SSL certificate automatic**  
✅ **HTTPS redirect enabled**

---

## 🔧 ALTERNATIVE PATH (24-48 Hours)

### Use Cloudflare DNS (For Advanced Features)

1. **Cloudflare:** Create account at [cloudflare.com](https://cloudflare.com)
2. **Add Site:** Enter `rangis.net`
3. **Add DNS Records:**
   ```
   Type: CNAME | Name: @ | Target: cname.vercel-dns.com | Proxy: OFF
   Type: CNAME | Name: www | Target: cname.vercel-dns.com | Proxy: OFF
   ```
4. **Copy Nameservers:** Example: `dana.ns.cloudflare.com`
5. **Update Vercel:** Domains → rangis.net → Nameservers → Custom
6. **Wait:** 24-48 hours for propagation
7. **Add to Project:** Vercel Settings → Domains → Add `rangis.net`

⚠️ **Manual DNS configuration required**  
⚠️ **Longer setup time**  
✅ **Advanced features available**

---

## ✅ VERIFICATION COMMANDS

```bash
# Check DNS
dig rangis.net
dig www.rangis.net
dig rangis.net NS

# Check SSL
curl -I https://rangis.net

# Test site
curl https://rangis.net
```

---

## 🐛 TROUBLESHOOTING

### Domain Not Loading
- Wait 10-15 minutes for DNS propagation
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Check DNS: https://whatsmydns.net

### SSL Error
- Wait 10 minutes for SSL certificate issuance
- If using Cloudflare: Set proxy to "DNS only" (gray cloud)
- Cloudflare SSL mode: "Full" (not "Full (strict)")
- Refresh SSL in Vercel: Settings → Domains → Refresh

### Too Many Redirects
- Cloudflare users: Disable proxy (gray cloud)
- Check SSL mode is "Full"
- Wait 5 minutes and retry

### Configuration Error
- Vercel: Click "Refresh" in domain settings
- Remove domain and re-add
- Check domain not assigned to different project

---

## 📊 DNS RECORD CHEAT SHEET

### Vercel DNS (Automatic)
```
Type    Name    Value                    Status
────────────────────────────────────────────────
A       @       76.76.21.21             ✅ Auto
AAAA    @       2606:4700:3033...       ✅ Auto
CNAME   www     cname.vercel-dns.com    ✅ Auto
NS      @       ns1.vercel-dns.com      ✅ Auto
NS      @       ns2.vercel-dns.com      ✅ Auto
```

### Cloudflare DNS (Manual)
```
Type    Name    Value                    Proxy
────────────────────────────────────────────────
CNAME   @       cname.vercel-dns.com    🔘 OFF
CNAME   www     cname.vercel-dns.com    🔘 OFF
NS      @       dana.ns.cloudflare.com  N/A
NS      @       walt.ns.cloudflare.com  N/A
```

---

## 🎯 WHICH SHOULD I USE?

### Use Vercel DNS If:
- ✅ You want fast setup (5-10 minutes)
- ✅ You're new to DNS
- ✅ You don't need advanced features
- ✅ You want automatic management

### Use Cloudflare DNS If:
- ✅ You need Web Application Firewall (WAF)
- ✅ You need advanced DDoS protection
- ✅ You need custom page rules
- ✅ You need detailed analytics
- ✅ You have DNS experience

**Recommendation:** Start with Vercel DNS. You can always migrate to Cloudflare later if needed.

---

## 🔗 ENVIRONMENT VARIABLES

After domain is configured, set these in Vercel:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

**Location:** Project Settings → Environment Variables → Add

---

## 📞 SUPPORT CONTACTS

**Vercel Support:**
- Email: support@vercel.com
- Discord: https://vercel.com/discord
- Docs: https://vercel.com/docs

**Cloudflare Support:**
- Dashboard: https://dash.cloudflare.com
- Community: https://community.cloudflare.com
- Docs: https://developers.cloudflare.com

---

## 📚 FULL DOCUMENTATION

For detailed instructions, see:

- **[VERCEL_DOMAIN_SETUP.md](./VERCEL_DOMAIN_SETUP.md)** - Quick 5-minute setup
- **[DNS_CONFIGURATION_GUIDE.md](./DNS_CONFIGURATION_GUIDE.md)** - Complete guide
- **[DNS_DECISION_TREE.md](./DNS_DECISION_TREE.md)** - Visual decision tree
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy application

---

## ⏱️ EXPECTED TIMELINE

```
Vercel DNS:
0:00  Add domain
0:01  DNS configured automatically
0:05  SSL certificate issued
0:10  Site live! ✅

Cloudflare DNS:
0:00  Create Cloudflare account
0:10  Configure DNS records
0:15  Update nameservers in Vercel
24:00 DNS propagates globally
24:05 SSL certificate issued
24:10 Site live! ✅
```

---

## 🎉 SUCCESS CHECKLIST

After setup, verify:

- [ ] `https://rangis.net` loads correctly
- [ ] `https://www.rangis.net` loads correctly
- [ ] `http://rangis.net` redirects to HTTPS
- [ ] Green padlock shows in browser
- [ ] No SSL certificate warnings
- [ ] API endpoints work (if applicable)
- [ ] All pages load without errors

---

## 💡 PRO TIPS

1. **Start Simple:** Use Vercel DNS first, migrate to Cloudflare only if needed
2. **Test Early:** Don't wait for DNS propagation to test SSL configuration
3. **Monitor Status:** Use Vercel dashboard to monitor domain status
4. **Cache Issues:** Always test in incognito mode to avoid cache
5. **DNS Tools:** Use whatsmydns.net to check global propagation
6. **SSL Testing:** Use ssllabs.com to verify SSL configuration
7. **Keep Records:** Screenshot your DNS settings for future reference

---

## 🔐 SECURITY CHECKLIST

- [ ] HTTPS enabled (automatic)
- [ ] HTTP redirects to HTTPS (automatic)
- [ ] SSL certificate valid (automatic)
- [ ] Security headers configured (in vercel.json)
- [ ] Environment variables set securely
- [ ] API keys not exposed in code

---

## 📱 MOBILE TESTING

After setup, test on mobile:

- [ ] Site loads on mobile browser
- [ ] HTTPS works on mobile
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] No horizontal scrolling

---

## 🚦 STATUS INDICATORS

**Vercel Dashboard Status:**

- 🟢 **Valid Configuration** = Domain working correctly
- 🟡 **Pending** = DNS configuration in progress
- 🔴 **Invalid Configuration** = Configuration error, needs attention
- ⚪ **Not Configured** = Domain not set up yet

**What Each Means:**

- **Valid Configuration:** Your domain is live and working
- **Pending:** Wait 5-10 minutes, refresh page
- **Invalid Configuration:** Check troubleshooting section
- **Not Configured:** Follow setup steps above

---

## 🎯 NEXT STEPS

After domain is live:

1. **Deploy Application:** `vercel --prod` from Web directory
2. **Test Endpoints:** Verify all API routes work
3. **Configure Analytics:** Enable Vercel Analytics
4. **Set Up Monitoring:** Configure uptime monitoring
5. **Create Backups:** Document your configuration
6. **User Testing:** Share with team for testing

---

**Print this card and keep it handy! 📋**

*Reality Protocol LLC - Quick Reference for rangis.net*
