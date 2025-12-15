# User Workflow Guide - Accessibility Features

## Overview

This guide explains the complete user workflows in RangisNet with a focus on accessibility features for Blind and Neurodivergent users. Every step includes multi-sensory feedback: visual, audio, and haptic.

## Workflow 1: Wallet Connection

### Step-by-Step (Visual + Screen Reader)

#### 1. Landing Page
**Visual:**
- User sees "Connect Wallet" button with purple gradient
- Button has hover effect (scales up slightly)

**Screen Reader:**
- "Welcome to RangisNet. Multi-Sensory Trading Experience"
- "Connect Wallet, button"
- Focus indicator: Blue outline (3px)

**Keyboard:**
- Tab to "Connect Wallet" button
- Press Enter or Space to activate

#### 2. Click/Activate Connect Wallet
**Visual:**
- Modal appears with wallet options
- Background dims
- Modal has "Connect to RangisNet" title

**Screen Reader:**
- "Connect to RangisNet, dialog"
- "Welcome to RangisNet. Multi-Sensory Trading Experience"
- "Choose a wallet:"
- Lists wallet options (MetaMask, Coinbase Wallet, Rainbow, Rabby)

**Keyboard:**
- Focus trapped in modal
- Tab through wallet options
- Escape to close modal

**Haptic:**
- Gentle single pulse when modal opens

#### 3. Select Wallet Provider
**Visual:**
- Wallet icons displayed in grid
- Hover effect on each wallet option

**Screen Reader:**
- "MetaMask, button" (or selected wallet)
- "Click to connect with MetaMask"

**Keyboard:**
- Arrow keys or Tab to navigate wallets
- Enter to select

**Haptic:**
- Short pulse on selection

#### 4. Wallet Extension Opens
**Visual:**
- Browser wallet extension popup appears
- RangisNet requests connection permission

**Screen Reader:**
- (Screen reader reads wallet extension UI)
- User must approve in wallet extension

**Note:** Wallet extension accessibility varies by provider

#### 5. Connection Success
**Visual:**
- Modal closes
- Green checkmark animation
- Wallet address displayed (truncated)
- "Connected" badge appears

**Screen Reader:**
- "Wallet connected successfully"
- "Connected. Address: 0x1234...5678"
- "Confidence: 100%. Recommended action: proceed with trading"

**Audio:**
- High-pitched success tone (540 Hz)
- Voice: "Feels confident at 100 percent. Ready to proceed with trading?"

**Haptic:**
- Double pulse pattern (200ms, 50ms gap, 200ms)
- Success vibration

**Keyboard:**
- Focus returns to main content area

#### 6. Connection Failure (Alternative Path)
**Visual:**
- Red error message
- "Failed to connect" with retry button

**Screen Reader:**
- "Wallet connection failed"
- "Please check your wallet extension is installed and unlocked"
- "Retry, button"

**Audio:**
- Low warning tone (324 Hz)
- Voice: "Connection failed. Please check your wallet"

**Haptic:**
- Triple pulse pattern (error)

---

## Workflow 2: Execute Transaction

### Step-by-Step (Visual + Screen Reader)

#### 1. Initiate Transaction
**Visual:**
- User clicks "Send" or "Swap" button
- Transaction form appears

**Screen Reader:**
- "Send tokens, button" or "Swap tokens, button"
- "Transaction form. Fill in amount and recipient"

**Keyboard:**
- Tab to form fields
- Enter to submit

#### 2. Fill Transaction Details
**Visual:**
- Amount input field
- Recipient address field
- Gas fee estimate displayed
- "Confirm Transaction" button

**Screen Reader:**
- "Amount, edit, required"
- "Recipient address, edit, required"
- "Gas fee: 0.001 AVAX"
- "Confirm Transaction, button"

**Keyboard:**
- Tab between fields
- Type amount and address
- Enter to confirm

**Validation:**
- Invalid address: Red border, error message announced
- Insufficient balance: Error announced immediately

#### 3. Confirm Transaction
**Visual:**
- Wallet extension opens for confirmation
- Transaction details displayed

**Screen Reader:**
- (Wallet extension reads transaction details)
- User must approve in wallet

**Haptic:**
- Single pulse when confirmation requested

#### 4. Transaction Pending
**Visual:**
- Toast notification appears (top-right)
- Hourglass icon (⏳)
- Orange border
- Progress bar animates (0-95%)
- Transaction hash displayed (monospace)

**Screen Reader:**
- "Transaction pending"
- "Send transaction for 10 AVAX"
- "Transaction in progress. 50% complete"
- Updates every few seconds

**Audio:**
- Mid-range frequency (432 Hz)
- Steady harmonic tone

**Haptic:**
- Pulsing pattern every 2 seconds
- Gentle vibration (100ms, 50ms gap, 100ms)

**Keyboard:**
- Focus remains on notification
- User can continue using app

#### 5. Transaction Confirmed (Success)
**Visual:**
- Toast notification updates
- Green checkmark icon (✅)
- Green border
- Progress bar completes (100%)
- "Confirmed" status

**Screen Reader:**
- "Transaction confirmed"
- "Send transaction for 10 AVAX"
- "Transaction completed successfully"
- "Transaction hash: 0xabc...xyz"

**Audio:**
- High frequency success tone (540 Hz)
- Ascending harmonic pattern
- Voice: "Feels confident at 100 percent. Transaction completed"

**Haptic:**
- Strong double pulse (200ms, 50ms gap, 200ms)
- Final confirmation vibration

**Auto-dismiss:**
- Notification auto-closes after 2 seconds
- User can dismiss early with Escape

#### 6. Transaction Failed (Alternative Path)
**Visual:**
- Toast notification updates
- Red X icon (❌)
- Red border
- "Failed" status
- Error reason displayed

**Screen Reader:**
- "Transaction failed"
- "Error: Insufficient gas fee"
- "Please increase gas fee and try again"

**Audio:**
- Low warning frequency (324 Hz)
- Descending pattern
- Voice: "Transaction failed. Please try again"

**Haptic:**
- Long error vibration (500ms)
- Triple pulse pattern

**Recovery:**
- "Retry" button appears
- Screen reader announces retry option

---

## Workflow 3: View Account Balance

### Step-by-Step (Visual + Screen Reader)

#### 1. Access Balance View
**Visual:**
- Balance displayed prominently
- Token icons with amounts
- USD value calculated

**Screen Reader:**
- "Account balance region"
- "AVAX balance: 125.45. Value: 4,500 dollars"
- "USDC balance: 1,000.00. Value: 1,000 dollars"
- "Total portfolio value: 5,500 dollars"

**Audio:**
- Balance announced on first load
- User can enable "speak balance on update"

**Haptic:**
- No haptic feedback for balance view (passive)

---

## Workflow 4: Cash Out / Withdraw

### Step-by-Step (Visual + Screen Reader)

#### 1. Initiate Withdrawal
**Visual:**
- "Withdraw" button
- Withdrawal form appears

**Screen Reader:**
- "Withdraw, button"
- "Withdrawal form. Specify amount to withdraw"

**Keyboard:**
- Tab to withdraw button
- Enter to open form

#### 2. Enter Withdrawal Amount
**Visual:**
- Amount input
- Available balance shown
- "Max" button to use full balance
- Destination address field

**Screen Reader:**
- "Amount to withdraw, edit, required"
- "Available: 125.45 AVAX"
- "Max, button. Fills maximum available amount"
- "Destination address, edit, required"

**Keyboard:**
- Tab to amount field
- Type amount or press Tab to "Max" button
- Tab to destination field

**Validation:**
- Exceeds balance: "Error: Amount exceeds available balance"
- Invalid address: "Error: Invalid destination address"

#### 3. Confirm Withdrawal
**Visual:**
- Review screen shows all details
- "Confirm Withdrawal" button
- Warning message about gas fees

**Screen Reader:**
- "Review withdrawal"
- "Amount: 125.45 AVAX"
- "Destination: 0x1234...5678"
- "Gas fee: 0.001 AVAX"
- "Warning: This action cannot be undone"
- "Confirm Withdrawal, button"

**Audio:**
- Alert tone for warning
- Voice reads warning message

**Haptic:**
- Warning pulse pattern

#### 4. Processing Withdrawal
**Visual:**
- Same as "Transaction Pending" flow
- Progress indicator

**Screen Reader:**
- "Withdrawal pending"
- "Processing withdrawal of 125.45 AVAX"
- Progress updates

**Audio & Haptic:**
- Same as transaction pending

#### 5. Withdrawal Complete
**Visual:**
- Success message
- Transaction hash link
- "View on Explorer" button

**Screen Reader:**
- "Withdrawal completed successfully"
- "125.45 AVAX sent to 0x1234...5678"
- "Transaction hash: 0xabc...xyz"
- "View on Explorer, link"

**Audio:**
- Success tone and voice confirmation

**Haptic:**
- Strong success vibration pattern

---

## Accessibility Features Summary

### Multi-Sensory Feedback Matrix

| Action | Visual | Audio | Haptic | Screen Reader |
|--------|--------|-------|--------|---------------|
| Connect Wallet | Green checkmark | Success tone + voice | Double pulse | "Wallet connected" |
| Connection Failed | Red error | Warning tone + voice | Triple pulse | "Connection failed" |
| Transaction Pending | Orange progress | Mid tone | Gentle pulse | "Transaction pending" |
| Transaction Success | Green checkmark | High tone + voice | Strong pulse | "Transaction confirmed" |
| Transaction Failed | Red X | Low tone + voice | Long vibration | "Transaction failed" |
| Balance Update | Numbers change | Optional voice | None | Balance announced |
| Error State | Red message | Warning tone | Error pattern | Error details |

### Accessibility Controls

Users can customize their experience:

#### Settings (Future Enhancement)
```typescript
interface AccessibilitySettings {
  voiceEnabled: boolean;        // Enable/disable voice announcements
  hapticsEnabled: boolean;       // Enable/disable vibration
  audioEnabled: boolean;         // Enable/disable audio tones
  highContrast: boolean;         // High contrast mode
  reducedMotion: boolean;        // Minimize animations
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  announceBalances: boolean;     // Auto-announce balance changes
  announceTransactions: boolean; // Auto-announce transaction updates
}
```

### Keyboard Shortcuts (Planned)

| Key | Action |
|-----|--------|
| C | Connect/Disconnect Wallet |
| S | Open Send form |
| W | Open Withdraw form |
| B | Announce current balance |
| H | Open help dialog |
| ? | Show keyboard shortcuts |
| Esc | Close current dialog/cancel action |

---

## Error Recovery Flows

### Wallet Disconnected Unexpectedly

**Detected When:**
- User switches accounts in wallet
- User locks wallet
- User switches networks

**Response:**
1. **Visual:** Warning banner appears
2. **Screen Reader:** "Wallet disconnected. Please reconnect"
3. **Audio:** Alert tone
4. **Haptic:** Warning vibration
5. **Action:** "Reconnect Wallet" button appears

### Transaction Rejected by User

**Detected When:**
- User cancels in wallet extension

**Response:**
1. **Visual:** Info message (not error)
2. **Screen Reader:** "Transaction cancelled by user"
3. **Audio:** Neutral tone
4. **Haptic:** Single pulse
5. **Action:** Return to form, values preserved

### Network Error

**Detected When:**
- API call fails
- Network timeout

**Response:**
1. **Visual:** Retry UI appears
2. **Screen Reader:** "Network error. Unable to connect. Retry?"
3. **Audio:** Error tone
4. **Haptic:** Error pattern
5. **Action:** "Retry" and "Cancel" buttons

---

## Testing These Workflows

### Manual Test Script

1. **Screen Reader Test:**
   - Close your eyes
   - Navigate using only keyboard + screen reader
   - Can you complete each workflow?

2. **Keyboard Only Test:**
   - Unplug your mouse
   - Navigate using only keyboard
   - Can you reach all functions?

3. **Audio Only Test:**
   - Close your eyes
   - Enable voice feedback
   - Can you understand transaction status?

4. **Haptic Only Test:**
   - On mobile device
   - Turn off sound
   - Can you feel the difference between success/error?

### Success Criteria

- ✅ 100% of workflows completable with screen reader
- ✅ 100% of workflows completable with keyboard only
- ✅ All states announced to screen readers
- ✅ All errors have clear recovery paths
- ✅ Multi-sensory feedback for all actions

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic screen reader support
- ✅ Keyboard navigation
- ✅ ARIA labels and roles
- ✅ Multi-sensory feedback

### Phase 2 (Planned)
- [ ] User settings for accessibility
- [ ] Keyboard shortcuts
- [ ] Adjustable font sizes
- [ ] Color theme options (high contrast, dark, light)

### Phase 3 (Future)
- [ ] Voice commands ("Hey Rangi, send 10 AVAX to...")
- [ ] Gesture controls (mobile)
- [ ] Haptic patterns customization
- [ ] AI-powered descriptions of market data

---

**Mission**: Make blockchain accessible to everyone, especially the 2+ billion people with disabilities who deserve an excellent experience.

For feedback or accessibility issues: accessibility@rangis.net
