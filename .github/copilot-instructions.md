# GitHub Copilot Instructions for RangisNet

## Repository Overview

RangisNet is a **Harmonic Execution & Asset Cognition Layer** for Avalanche blockchain that transforms network activity into real-time, multi-sensory intelligence using sound, color, resonance patterns, and harmonic signals.

**Key Purpose**: Make blockchain interaction accessible through audio, visual, and haptic feedback, especially for Blind and Neurodivergent users.

## Technology Stack

### Frontend (Web/)
- **Framework**: Next.js 14.2.34 with React 18.3.1
- **Language**: TypeScript 5.4.5
- **Blockchain**: Thirdweb SDK, ethers.js 5.7.2
- **3D Graphics**: Three.js, React Three Fiber
- **Build**: Next.js build system

### Backend
- **APIs**: Hono framework (X402 integration)
- **Real-time**: WebSocket for harmonic streaming
- **Blockchain**: Avalanche C-Chain, Subnets, LayerZero bridge

### Metrics Engine
- **Location**: `Engines/`, `McCrea-Metrics/`
- **Technology**: Python, JavaScript
- **Purpose**: McCrea Market Metrics™ proprietary algorithms

## Security Guidelines

### Critical Security Rules

1. **Never commit secrets or API keys**
   - Use `.env` files (add to `.gitignore`)
   - Reference environment variables only
   - See `.env.example` for required variables

2. **Dependency Management**
   - Run `npm audit` before commits
   - Keep React at 18.x (avoid React 19 RCE vulnerability CVE-2025-55182)
   - Update dependencies regularly but test thoroughly
   - See `SECURITY.md` for known vulnerabilities

3. **Input Validation**
   - Sanitize all user inputs
   - Validate wallet addresses before transactions
   - Check transaction parameters before signing
   - Use TypeScript strict mode

4. **Smart Contract Security**
   - Audit all contract changes
   - Use OpenZeppelin libraries
   - Test extensively on testnets first
   - Implement reentrancy guards

### Known Security Considerations

- **@coinbase/wallet-sdk**: High severity in Thirdweb SDK (non-critical, monitoring for updates)
- **@openzeppelin/contracts**: Development dependency issues (not in production)
- **elliptic**, **ws**, **axios**: Transitive dependencies from LayerZero (isolated impact)

See `SECURITY.md` and `SECURITY_STATUS.md` for complete details.

## Accessibility Requirements

### WCAG 2.1 AA Compliance

RangisNet is designed for **2 billion+ users with accessibility needs**, including Blind and Neurodivergent individuals.

#### Screen Reader Support

1. **ARIA Labels Required**
   - All interactive elements must have `aria-label` or `aria-labelledby`
   - Use `role` attributes appropriately (`button`, `navigation`, `main`, etc.)
   - Maintain live regions for dynamic content updates

2. **Semantic HTML**
   - Use proper heading hierarchy (h1 → h2 → h3)
   - Use `<button>` for actions, `<a>` for navigation
   - Use `<nav>`, `<main>`, `<aside>` landmarks

3. **Screen Reader Announcements**
   - Use the `accessibility.ts` module for announcements
   - Call `announceConfidence()` for transaction updates
   - Provide context for all state changes

#### Keyboard Navigation

1. **Focus Management**
   - All interactive elements must be keyboard accessible
   - Provide visible focus indicators
   - Use proper tab order with `tabindex` when needed
   - Trap focus in modals/popups

2. **Keyboard Shortcuts**
   - Document all shortcuts
   - Avoid single-key shortcuts
   - Allow users to disable shortcuts

#### Visual Accessibility

1. **Color Contrast**
   - Minimum 4.5:1 for text
   - Minimum 3:1 for large text and UI components
   - Never rely on color alone to convey information

2. **Text Size**
   - Support browser zoom up to 200%
   - Use relative units (rem, em) not px
   - Minimum 16px base font size

3. **Motion**
   - Respect `prefers-reduced-motion`
   - Provide pause/stop controls for animations
   - No auto-playing audio

#### Multi-Sensory Features

1. **Audio Feedback** (`accessibility.ts`)
   - Use Web Speech API for voice announcements
   - Provide audio cues for confidence levels
   - Allow users to enable/disable audio

2. **Haptic Feedback** (`accessibility.ts`)
   - Use Vibration API for transaction feedback
   - Different patterns for success/warning/error
   - Allow users to enable/disable haptics

3. **Visual Harmony** (McCrea Metrics)
   - Color-coded risk levels
   - Cymatic visualizations with text alternatives
   - Harmonic frequency displays

### Accessibility Testing Checklist

Before committing UI changes:
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Test keyboard-only navigation
- [ ] Check color contrast with WebAIM tool
- [ ] Test with browser zoom at 200%
- [ ] Verify ARIA labels and roles
- [ ] Test with motion disabled
- [ ] Verify focus indicators visible

## Coding Conventions

### TypeScript

```typescript
// Use strict mode
// Use explicit types, avoid 'any'
// Export interfaces for reusability

interface MarketMetrics {
  stability: number;
  risk: number;
  liquidity: number;
}

// Prefer const over let
const calculateRisk = (metrics: MarketMetrics): number => {
  return metrics.risk * metrics.liquidity;
};
```

### React Components

```typescript
// Use functional components with hooks
// Extract reusable logic into custom hooks
// Use TypeScript for props

interface WalletButtonProps {
  onConnect: () => void;
  disabled?: boolean;
  'aria-label'?: string; // Always include for accessibility
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  onConnect,
  disabled = false,
  'aria-label': ariaLabel = 'Connect Wallet',
}) => {
  return (
    <button
      onClick={onConnect}
      disabled={disabled}
      aria-label={ariaLabel}
      className="wallet-button"
    >
      Connect Wallet
    </button>
  );
};
```

### File Organization

```
Web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── lib/           # Utility libraries
│   ├── app/           # Next.js app router pages
│   └── accessibility.ts  # Accessibility helpers
├── public/            # Static assets
└── styles/            # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`WalletConnect.tsx`)
- **Files**: kebab-case (`market-data.ts`)
- **Functions**: camelCase (`calculateMetrics`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINT`)
- **CSS Classes**: kebab-case (`wallet-button`)

## Testing

### Before Committing

```bash
# In Web/ directory
npm run lint          # Check code style
npm run build         # Verify build succeeds
npm audit             # Check for vulnerabilities
```

### Testing Checklist

- [ ] Code builds without errors
- [ ] No TypeScript errors
- [ ] Linting passes
- [ ] Accessibility features work
- [ ] Tested on actual device/browser
- [ ] No console errors in browser

## Workflow Guidelines

### Wallet Connection Flow

1. User clicks "Connect Wallet"
2. Thirdweb modal appears
3. User selects wallet provider
4. Wallet connection confirmed
5. **Announce via screen reader**: "Wallet connected successfully"
6. **Provide haptic feedback**: Success pattern
7. Update UI with wallet address

### Transaction Flow

1. User initiates transaction
2. **Announce via screen reader**: "Transaction pending"
3. Show loading state (accessible)
4. Wait for confirmation
5. **Announce via screen reader**: "Transaction confirmed" or "Transaction failed"
6. **Provide haptic feedback**: Success or error pattern
7. Update UI with result

### Error Handling

```typescript
// Always provide clear, actionable error messages
try {
  await connectWallet();
} catch (error) {
  const message = 'Failed to connect wallet. Please check your wallet extension is installed and unlocked.';
  
  // Visual
  showErrorToast(message);
  
  // Screen reader
  announceError(message);
  
  // Haptic
  triggerHapticFeedback(0, 'error');
  
  console.error('Wallet connection error:', error);
}
```

## Deployment

### Environment Variables Required

```bash
# Blockchain
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=
NEXT_PUBLIC_AVALANCHE_RPC_URL=

# APIs (optional)
YOUMIO_API_KEY=
PYTH_API_KEY=

# Never commit these to git!
```

### Build Commands

```bash
cd Web/
npm install
npm run build
npm start  # Production server
```

## Resources

### Documentation
- [SECURITY.md](../SECURITY.md) - Security policy and vulnerabilities
- [README.md](../README.md) - Project overview
- [WHITEPAPER.md](../WHITEPAPER.md) - Technical details
- [WALLET_EXPERIENCE.md](../WALLET_EXPERIENCE.md) - User flows

### External Standards
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility guidelines
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/) - ARIA patterns
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## Getting Help

### For Security Issues
**Do not create public issues!**
- GitHub Security Advisories (preferred)
- Email: security@rangis.net

### For General Questions
- Check documentation first
- Review existing issues
- Create new issue with clear description

## McCrea Market Metrics™ Specifics

### Metric Ranges
- `stability_index`: 0-1 (0 = unstable, 1 = stable)
- `execution_risk`: 0-1 (0 = low risk, 1 = high risk)
- `comfort_band`: boolean (true = safe to trade)
- `liquidity_score`: 0-100 (higher = more liquid)

### Integration Points
```typescript
import { calculateMetrics } from '@/lib/mccrea-metrics-m3';

const metrics = await calculateMetrics(symbol);

// Announce to user
announceConfidence(
  metrics.stability_index,
  metrics.comfort_band ? 'trade' : 'hold',
  { ariaLive: true, voiceEnabled: true, hapticsEnabled: true }
);
```

## Common Tasks

### Adding a New Component

1. Create file in `Web/src/components/`
2. Use TypeScript with proper interfaces
3. Include ARIA labels and roles
4. Test keyboard navigation
5. Test with screen reader
6. Export from component

### Fixing a Security Vulnerability

1. Check `SECURITY.md` for known issues
2. Run `npm audit` to identify
3. Update package if fix available
4. Test thoroughly after update
5. Update `SECURITY.md` if needed
6. Document in PR description

### Improving Accessibility

1. Identify the issue (use axe DevTools)
2. Check WCAG 2.1 guidelines
3. Implement fix with proper ARIA
4. Test with screen reader
5. Test keyboard navigation
6. Document in `accessibility.ts` if reusable

---

**Remember**: RangisNet's mission is to make blockchain accessible to everyone, especially those with disabilities. Every change should consider the 2B+ users who depend on our accessibility features.
