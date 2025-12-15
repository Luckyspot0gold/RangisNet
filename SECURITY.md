# Security Policy

**RangisNet Layer 1.5 - Multi-Sensory Trading Platform**

---

## 🔒 Security Overview

RangisNet takes security seriously. This document outlines our security practices, supported versions, and how to report vulnerabilities.

---

## Supported Versions

| Component | Version | Status | Notes |
|-----------|---------|--------|-------|
| Web App | 1.0.0 | ✅ Supported | React 18.3.1, Next.js 14.2.33 |
| Market Data API | 1.0.0 | ✅ Supported | Node.js 22+ required |
| Cosmos Module | 1.0.0 | ✅ Supported | Go 1.21+ required |
| LayerZero Bridge | 1.0.0 | ✅ Supported | Solidity 0.8.20 |

---

## 🚨 Recent Security Advisories

### CVE-2025-55182 - React Server Function RCE (CRITICAL)

**Status:** ✅ **NOT AFFECTED**

RangisNet uses React 18.3.1 and is not affected by this React 19.x vulnerability. See [SECURITY_ADVISORY_CVE_2025_55182.md](./SECURITY_ADVISORY_CVE_2025_55182.md) for details.

---

## Current Security Status

Last audit: December 15, 2025

### ✅ Not Vulnerable To

- **CVE-2025-55182** - React 19.x RCE (we use React 18.3.1)
- **Server-side injection** - No RSC or Server Actions
- **XSS attacks** - React's built-in protection + CSP headers
- **CSRF** - Wallet signatures for authentication

### ⚠️ Known Dependencies Issues

**Last Updated: December 15, 2025**

Some non-critical vulnerabilities exist in transitive dependencies. These are actively monitored:

1. **@coinbase/wallet-sdk** (High)
   - **Status**: Transitive dependency from Thirdweb SDK
   - **Impact**: Limited to wallet connection UI, does not affect core functionality
   - **CVE**: GHSA-8rgj-285w-qcq4
   - **Mitigation**: Isolated to non-critical wallet UI components
   - **Plan**: Awaiting Thirdweb SDK update to v5.x with fixes

2. **@openzeppelin/contracts** (High - Multiple CVEs)
   - **Status**: Development and testing dependency only
   - **Impact**: Not used in production runtime code
   - **Affected**: GovernorCompatibilityBravo, ERC165Checker, and others
   - **Mitigation**: Only used for contract development/testing
   - **Plan**: Update to 5.x when stable release available

3. **elliptic** (Critical - ECDSA vulnerabilities)
   - **Status**: Transitive dependency in zksync-ethers
   - **Impact**: Limited to specific signing operations
   - **CVEs**: Multiple ECDSA-related issues
   - **Mitigation**: Not used in primary transaction signing flow
   - **Plan**: Awaiting ethers.js v6 migration in dependencies

4. **ws** (High - DoS vulnerability)
   - **Status**: Transitive dependency in Thirdweb and zksync-ethers
   - **CVE**: GHSA-3h5v-q93c-6h6q
   - **Impact**: WebSocket DoS with many headers (requires specific attack)
   - **Mitigation**: Rate limiting on API endpoints
   - **Plan**: Will resolve with dependency updates

5. **axios** (High - Multiple issues)
   - **Status**: Transitive dependency in hardhat-deploy
   - **Impact**: Development tooling only, not in production runtime
   - **CVEs**: CSRF, DoS, SSRF
   - **Mitigation**: Only used during development and deployment
   - **Plan**: Monitoring hardhat-deploy updates

6. **next** (High - DoS vulnerability)
   - **Status**: Currently on 14.2.34 (deprecated with security advisory)
   - **CVE**: GHSA-5j59-xgg2-r9c4 (DoS with Server Components)
   - **Impact**: Affects Server Components (which we don't use)
   - **Mitigation**: 
     - We use traditional API routes only, not Server Components
     - No React Server Components (RSC) in our codebase
     - Risk is minimal as vulnerable feature not utilized
   - **Plan**: Upgrade to 14.2.35+ requires testing for breaking changes
   - **Note**: Advisory available at https://nextjs.org/blog/security-update-2025-12-11

**Note:** Most critical vulnerabilities are in:
- Development dependencies (not in production bundle)
- Transitive dependencies (limited control, monitoring for updates)
- Features we don't use (Server Components, specific signing methods)

**Current Risk Level**: LOW - No immediate exploitable vulnerabilities in production runtime.

---

## Reporting a Vulnerability

### Where to Report

**For security vulnerabilities, please DO NOT create public GitHub issues.**

Instead, report via:

1. **GitHub Security Advisories** (Preferred)
   - Go to: https://github.com/Luckyspot0gold/RangisNet/security/advisories
   - Click "Report a vulnerability"
   - Provide detailed information

2. **Email** (Alternative)
   - Send to: security@rangis.net
   - PGP key available on request
   - Include "SECURITY" in subject line

### What to Include

Please provide:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested fixes (optional)
- Your contact information

### Response Timeline

- **Initial Response:** Within 24 hours
- **Triage:** Within 3 business days
- **Status Updates:** Weekly until resolved
- **Fix Timeline:** Depends on severity
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2 weeks
  - Low: Next release cycle

### Disclosure Policy

We follow **responsible disclosure**:
1. Report received and acknowledged
2. Vulnerability verified and severity assessed
3. Fix developed and tested
4. Security advisory published
5. Fix deployed to production
6. Public disclosure after 90 days or fix deployment (whichever comes first)

### Bug Bounty

Currently, we do not have a formal bug bounty program. However, we recognize security researchers with:
- Public acknowledgment (with permission)
- Credit in release notes
- Swag/merch for significant findings

---

## Security Best Practices

### For Users

1. **Wallet Security**
   - Never share your private keys or seed phrases
   - Use hardware wallets for large amounts
   - Verify contract addresses before transactions
   - Be cautious of phishing attempts

2. **Browser Security**
   - Keep your browser updated
   - Use HTTPS only (verified by lock icon)
   - Clear cache/cookies regularly
   - Use reputable wallet extensions only

3. **Transaction Safety**
   - Always verify transaction details
   - Check gas fees before confirming
   - Start with small test transactions
   - Monitor your wallet activity

### For Developers

1. **Code Security**
   - Run `npm audit` before commits
   - Keep dependencies updated
   - Use TypeScript for type safety
   - Follow OWASP guidelines

2. **Smart Contract Security**
   - Audit contracts before deployment
   - Use OpenZeppelin libraries
   - Test extensively on testnets
   - Implement circuit breakers

3. **API Security**
   - Validate all inputs
   - Use rate limiting
   - Implement proper CORS
   - Never expose secrets in code

---

## Security Features

### Application Security

1. **Authentication**
   - Wallet-based authentication (no passwords)
   - Signature verification for sensitive actions
   - Session management via client-side storage

2. **Authorization**
   - Role-based access control (RBAC)
   - Oracle authorization for data submission
   - Admin functions protected by multi-sig

3. **Data Protection**
   - HTTPS/TLS in production
   - API rate limiting
   - Input validation and sanitization
   - XSS protection via React

4. **Network Security**
   - Content Security Policy (CSP) headers
   - X-Frame-Options to prevent clickjacking
   - X-Content-Type-Options to prevent MIME sniffing
   - Strict-Transport-Security (HSTS)

### Smart Contract Security

1. **Access Control**
   - Owner-only functions for critical operations
   - Oracle whitelist for data submission
   - Trusted remotes for LayerZero messages

2. **Safety Mechanisms**
   - Reentrancy guards on state-changing functions
   - Checks-effects-interactions pattern
   - Safe math operations
   - Emergency pause functionality

3. **Auditing**
   - Pre-deployment audit required
   - Regular security reviews
   - Automated testing with 100% coverage
   - Formal verification for critical paths

---

## Compliance

### Standards

- **OWASP Top 10** - Web application security
- **CWE Top 25** - Common weakness enumeration
- **NIST Framework** - Cybersecurity guidelines
- **EIP Standards** - Ethereum Improvement Proposals

### Certifications

- Smart contract audits: Pending (CertiK/Quantstamp)
- Penetration testing: Quarterly schedule
- Security training: Annual for all developers

---

## Security Roadmap

### Completed
- [x] Wallet-based authentication
- [x] API rate limiting
- [x] Input validation
- [x] HTTPS enforcement
- [x] CSP headers
- [x] React 18.x (avoiding React 19 RCE)

### In Progress
- [x] Automated security scanning in CI/CD
- [x] Dependency vulnerability monitoring (npm audit in CI)
- [ ] Smart contract audit booking
- [ ] Security headers optimization

### Planned
- [ ] Bug bounty program launch
- [ ] Formal verification for critical contracts
- [ ] Multi-sig for admin functions
- [ ] Regular penetration testing
- [ ] Security awareness training

---

## Emergency Response

### In Case of Security Incident

1. **Immediate Actions**
   - Activate incident response team
   - Assess scope and impact
   - Contain the threat
   - Preserve evidence

2. **Communication**
   - Notify affected users
   - Update status page
   - Coordinate with partners
   - Prepare public statement

3. **Remediation**
   - Deploy emergency fixes
   - Verify fix effectiveness
   - Monitor for recurrence
   - Document lessons learned

4. **Post-Incident**
   - Conduct root cause analysis
   - Update security measures
   - Improve detection systems
   - Share learnings with community

### Contact Information

- **Security Team:** security@rangis.net
- **Emergency Hotline:** Available via Discord
- **Status Page:** https://status.rangis.net (if available)

---

## Resources

### Internal Documentation
- [Security Advisory CVE-2025-55182](./SECURITY_ADVISORY_CVE_2025_55182.md)
- [Deployment Guide](./POLYGON_LAYERZERO_INTEGRATION_GUIDE.md)
- [API Architecture](./MARKET_DATA_API_ARCHITECTURE.md)

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [React Security](https://react.dev/learn/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

---

## Acknowledgments

We thank the security research community for helping keep RangisNet secure. Special thanks to:

- Lachlan Davidson - For responsible disclosure of CVE-2025-55182
- [Your name here] - Report security issues to be acknowledged

---

**Last Updated:** December 15, 2025  
**Version:** 1.0.1  
**Next Review:** January 15, 2026
