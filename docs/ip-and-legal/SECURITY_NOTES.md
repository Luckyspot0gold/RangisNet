# Security Audit Notes

## ws Package Vulnerability

**CVE**: GHSA-3h5v-q93c-6h6q  
**Severity**: High (DoS)  
**Status**: ✅ Not Applicable

### Vulnerability Details
The `ws` package versions 7.0.0-7.5.9 and 8.0.0-8.17.0 have a DoS vulnerability when handling HTTP requests with many headers on the **server side**.

### Why We're Not Affected

1. **Client-Side Only**: RangisNet uses `ws` indirectly through browser dependencies (WalletConnect, Thirdweb, CosmJS)
2. **No Server Handling**: We don't run a WebSocket server with `ws` - only client connections
3. **Browser Wrapped**: Browser's native WebSocket API handles actual connections
4. **Dependency Issue**: Cannot upgrade due to peer dependency locks in:
   - `@walletconnect/*` packages
   - `@cosmjs/socket`
   - `ethers@5.7.2`
   - `thirdweb` SDK

### Mitigation
- ✅ No WebSocket server exposed
- ✅ Client-side usage only (browser environment)
- ✅ Not processing untrusted HTTP headers
- ✅ Production deployment uses edge functions (no long-lived WebSocket servers)

### Monitoring
Will upgrade when dependencies release compatible versions with `ws@8.18.0+`.

**Decision**: Safe to ignore for this application's use case.

---

## Other Security Notes

### Elliptic Package
**Status**: Low risk - only used for signature verification, not generation.  
**Mitigation**: ethers.js handles signing with its own implementation.

### Dependencies
All vulnerabilities are in transitive dependencies (not direct) and not exploitable in our client-side browser context.
