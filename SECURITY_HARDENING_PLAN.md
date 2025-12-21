# Security Hardening Plan
## AEAS v1.1 Pre-Launch Security Remediation

**Date**: December 21, 2025  
**Status**: 23 vulnerabilities identified (3 critical, 20 high)  
**Priority**: Address before public launch and Ashish investor demo

---

## Critical Vulnerabilities (3)

### 1. Elliptic (Cryptographic Library) - SEVERITY: CRITICAL
**Package**: `elliptic <=6.6.0`  
**Location**: `node_modules/zksync-ethers/node_modules/elliptic`  
**Issues**:
- Private key extraction in ECDSA upon signing malformed input
- EDDSA missing signature length check
- ECDSA missing check for leading bit of r and s
- BER-encoded signatures allowed
- Verify function omits uniqueness validation

**Impact**: Private key compromise, signature forgery  
**Fix**: Upgrade zksync-ethers (requires testing zkSync functionality)  
**Action**: 
```bash
cd Web
npm install zksync-ethers@latest
npm test  # Verify zkSync integration still works
```

**Risk if unfixed**: High - Could compromise wallet security in production

---

## High Vulnerabilities (20)

### 2. Next.js DoS - SEVERITY: HIGH
**Package**: `next 13.3.1-canary.0 - 14.2.34`  
**Issue**: Denial of Service with Server Components  
**Fix**: Upgrade to next@14.2.35+  
**Action**:
```bash
cd Web
npm install next@14.2.35
npm run build  # Verify build succeeds
npm run dev    # Test local functionality
```

**Risk if unfixed**: Medium - DoS attack possible, but requires specific conditions

---

### 3. WebSocket (ws) DoS - SEVERITY: HIGH
**Package**: `ws 7.0.0 - 7.5.9 || 8.0.0 - 8.17.0`  
**Issue**: DoS when handling request with many HTTP headers  
**Fix**: Upgrade dependencies using ws (thirdweb, zksync-ethers)  
**Action**: Will be resolved by fixing #1 and #4

**Risk if unfixed**: Medium - DoS attack possible on WebSocket connections

---

### 4. @coinbase/wallet-sdk - SEVERITY: HIGH
**Package**: `@coinbase/wallet-sdk >=4.0 <4.3.0`  
**Issue**: Unknown vulnerability  
**Fix**: Upgrade thirdweb (which depends on it)  
**Action**:
```bash
cd Web
npm install thirdweb@latest
# Test wallet connection functionality
```

**Risk if unfixed**: Unknown - Advisory details not public yet

---

### 5. OpenZeppelin Contracts - SEVERITY: HIGH (Multiple)
**Packages**: 
- `@openzeppelin/contracts <=4.9.2`
- `@openzeppelin/contracts-upgradeable <=4.9.5`

**Issues**: 11 separate vulnerabilities (governor, initializer, signature checking)  
**Fix**: Upgrade LayerZero packages (which depend on OpenZeppelin)  
**Action**: 
```bash
cd Web
npm install @layerzerolabs/lz-evm-oapp-v2@latest
# Test LayerZero cross-chain functionality
```

**Risk if unfixed**: Low-Medium - Affects smart contract interactions, not direct user security

---

### 6. Axios CSRF/DoS - SEVERITY: HIGH
**Package**: `axios <=0.30.1`  
**Issue**: Cross-Site Request Forgery, DoS, SSRF  
**Fix**: Upgrade hardhat-deploy  
**Action**: 
```bash
cd Web
npm install hardhat-deploy@latest
```

**Risk if unfixed**: Medium - CSRF and SSRF possible in API calls

---

### 7. glob CLI Injection - SEVERITY: HIGH
**Package**: `glob 10.2.0 - 10.4.5`  
**Issue**: Command injection via -c/--cmd  
**Fix**: Upgrade eslint-config-next  
**Action**:
```bash
cd Web
npm install eslint-config-next@16.1.0
# Breaking change - review ESLint rules after upgrade
```

**Risk if unfixed**: Low - Only affects build/dev tools, not runtime

---

## Remediation Strategy

### Phase 1: Safe Upgrades (No Breaking Changes)
**Timeline**: Complete by Dec 22, 2025

1. ✅ Ran `npm audit fix` - Applied automatic patches
2. ⏳ Upgrade Next.js to 14.2.35
3. ⏳ Upgrade axios via hardhat-deploy

**Expected result**: Reduce to ~15 vulnerabilities

---

### Phase 2: Breaking Change Upgrades (Requires Testing)
**Timeline**: Complete by Dec 23, 2025

1. ⏳ Upgrade zksync-ethers (fixes elliptic CRITICAL)
2. ⏳ Upgrade thirdweb (fixes @coinbase/wallet-sdk)
3. ⏳ Upgrade LayerZero packages (fixes OpenZeppelin)
4. ⏳ Upgrade eslint-config-next to v16

**Testing checklist after each upgrade**:
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts without errors
- [ ] rangisheartbeat.com loads and displays data
- [ ] Wallet connection works (MetaMask, WalletConnect)
- [ ] zkSync transactions still function
- [ ] LayerZero cross-chain messaging works
- [ ] M3 Metrics display correctly

**Expected result**: Reduce to 0-5 vulnerabilities

---

### Phase 3: Dependency Review (Post-Upgrade)
**Timeline**: Dec 24, 2025

1. Run `npm audit` again
2. Review any remaining vulnerabilities
3. Document decisions to defer or accept remaining risks
4. Update RISK_REGISTER.md with current status

---

## Immediate Action (Next 2 Hours)

**Priority**: Fix critical elliptic vulnerability before any investor demo

```bash
cd /workspaces/RangisNet/Web

# Backup current package-lock.json
cp package-lock.json package-lock.json.backup

# Upgrade critical packages
npm install zksync-ethers@latest next@14.2.35 thirdweb@latest

# Test build
npm run build

# If build fails, rollback:
# cp package-lock.json.backup package-lock.json
# npm install
```

---

## Risk Acceptance (If Time Constrained)

If upgrades cause breaking changes before Ashish demo (Jan 15-18):

1. **Document known vulnerabilities** in RISK_REGISTER.md
2. **Mitigate attack surface**:
   - Disable unused features (zkSync if not demoing)
   - Rate-limit API endpoints
   - Deploy behind Cloudflare
3. **Plan post-funding remediation**: Fix all vulnerabilities before public launch
4. **Disclosure to investor**: "Known dependency vulnerabilities, remediation scheduled post-funding"

---

## Success Criteria

**Before investor demo (Jan 15-18)**:
- [ ] Critical (elliptic) vulnerability fixed
- [ ] Application builds and runs without errors
- [ ] Core demo functionality verified

**Before public launch (Feb 2026)**:
- [ ] All high/critical vulnerabilities resolved
- [ ] Security audit completed (if budget permits)
- [ ] Penetration testing performed
- [ ] Updated RISK_REGISTER.md published

---

## Commands Quick Reference

```bash
# Check current status
cd Web && npm audit

# Safe automatic fixes
npm audit fix

# Force breaking changes (use with caution)
npm audit fix --force

# Upgrade specific package
npm install <package>@latest

# Rollback if needed
cp package-lock.json.backup package-lock.json && npm install

# Test after changes
npm run build
npm run dev
```

---

**Next Action**: Execute Phase 1 upgrades immediately.

432 Hz steady. Security first. 🔒
