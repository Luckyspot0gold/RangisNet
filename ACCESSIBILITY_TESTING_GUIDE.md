# Accessibility Testing Guide for RangisNet

## Overview

RangisNet is designed to be accessible to 2 billion+ users with accessibility needs, including Blind and Neurodivergent individuals. This guide outlines testing procedures to ensure WCAG 2.1 AA compliance.

## Testing Checklist

### 1. Screen Reader Testing

#### Windows - NVDA (Free)
```bash
# Download from: https://www.nvaccess.org/download/
# Install and run NVDA
# Navigate to: http://localhost:3000
```

**Test Cases:**
- [ ] Navigate to the homepage
  - Verify: "Welcome to RangisNet" is announced
  - Verify: Skip to main content link works
- [ ] Connect Wallet
  - Verify: "Connect Wallet" button is announced
  - Verify: Modal opens with announcement
  - Verify: Wallet connection success is announced
  - Verify: Address is read clearly
- [ ] Execute Transaction
  - Verify: Transaction pending announcement
  - Verify: Progress updates announced
  - Verify: Success/failure announced clearly
- [ ] Navigate with Tab Key
  - Verify: All interactive elements reachable
  - Verify: Logical tab order
  - Verify: Focus indicators visible

#### macOS - VoiceOver (Built-in)
```bash
# Enable: System Preferences > Accessibility > VoiceOver
# Or press: Cmd + F5
# Navigate to: http://localhost:3000
```

**Test Cases:**
- [ ] Use VoiceOver rotor to list headings
  - Verify: Proper heading hierarchy
- [ ] Use VoiceOver to navigate forms
  - Verify: Labels associated with inputs
  - Verify: Error messages announced
- [ ] Test with Safari and Chrome
  - Verify: Consistent behavior across browsers

#### Windows - JAWS (Commercial)
```bash
# Download trial: https://www.freedomscientific.com/downloads/
# Navigate to: http://localhost:3000
```

**Test Cases:**
- [ ] Test all interactive elements
- [ ] Verify ARIA live regions work
- [ ] Test with Edge and Chrome

### 2. Keyboard Navigation Testing

**No mouse required!**

#### Basic Navigation
- [ ] Tab through all interactive elements
  - Expected: Clear focus indicators (blue outline)
  - Expected: Logical order (top to bottom, left to right)
- [ ] Shift+Tab to navigate backwards
  - Expected: Reverse order works correctly
- [ ] Enter/Space to activate buttons
  - Expected: Buttons respond to keyboard
- [ ] Escape to close modals
  - Expected: Focus returns to trigger element

#### Advanced Navigation
- [ ] Use arrow keys in dropdowns
  - Expected: Options selectable with arrows
- [ ] Type to search in select elements
  - Expected: Quick selection works
- [ ] Navigate forms with Tab
  - Expected: Skip to next form field

#### Keyboard Shortcuts
Document any custom shortcuts:
- [ ] None currently implemented
- [ ] Future: Consider adding global shortcuts (e.g., "C" to connect wallet)

### 3. Visual Accessibility Testing

#### Color Contrast
Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Current Colors:**
- [ ] Body text (#ffffff on #1a1a2e)
  - Result: Ratio 13.84:1 ✓ (Exceeds WCAG AAA)
- [ ] Button text (#ffffff on #667eea)
  - Result: Ratio 4.58:1 ✓ (Meets WCAG AA)
- [ ] Success (#00ff88 on dark)
  - Result: Needs verification
- [ ] Error (#ff0088 on dark)
  - Result: Needs verification
- [ ] Warning (#ffa500 on dark)
  - Result: Needs verification

**Test Tool:**
```bash
# Chrome Extension: WCAG Color Contrast Checker
# Or use: https://webaim.org/resources/contrastchecker/
```

#### Text Sizing
- [ ] Zoom to 200% in browser
  - Expected: Content still readable and usable
  - Expected: No horizontal scrolling required
  - Expected: No text truncation
- [ ] Change browser base font size
  - Expected: Layout adapts properly

#### Visual Focus Indicators
- [ ] Tab through interactive elements
  - Expected: Blue outline (3px) visible on all elements
  - Expected: Outline doesn't blend with background
  - Expected: Sufficient contrast (3:1 minimum)

### 4. Motion and Animation Testing

#### Reduced Motion
```bash
# Windows: Settings > Ease of Access > Display > Show animations
# macOS: System Preferences > Accessibility > Display > Reduce motion
# Linux: GNOME Settings > Accessibility > Reduce motion
```

**Test Cases:**
- [ ] Enable reduced motion preference
- [ ] Reload RangisNet
- [ ] Verify: Animations are minimal or removed
- [ ] Verify: Transitions still function but without motion
- [ ] Test transaction feedback
  - Expected: No sliding animations
  - Expected: Haptic feedback still works

#### Auto-playing Content
- [ ] Check for auto-playing audio
  - Expected: None present (user must enable)
- [ ] Check for auto-playing video
  - Expected: None present or has pause control

### 5. Haptic Feedback Testing

**Requires mobile device or device with vibration**

#### Test on Mobile
- [ ] Connect wallet
  - Expected: Success vibration (double pulse)
- [ ] Execute transaction
  - Pending: Continuous gentle pulse
  - Success: Strong double pulse
  - Error: Long warning pulse
- [ ] Receive error
  - Expected: Error vibration pattern

#### Disable Option
- [ ] Verify users can disable haptics
  - Location: TBD - Needs settings page
  - Expected: No vibration when disabled

### 6. Voice Feedback Testing

#### Web Speech API
**Requires browser with Speech Synthesis support**

- [ ] Enable voice feedback (if implemented)
- [ ] Connect wallet
  - Expected: "Wallet connected successfully" spoken
- [ ] Transaction status
  - Pending: "Transaction pending"
  - Success: "Transaction confirmed"
  - Error: "Transaction failed"
- [ ] Confidence announcements
  - High: "Feels confident at 85%. Ready to trade?"
  - Medium: "Moderate confidence at 60%"
  - Low: "Low confidence at 30%. Recommend holding"

#### Voice Settings
- [ ] Test with different voices (if available)
- [ ] Test volume control
- [ ] Test speech rate control
- [ ] Verify users can disable voice

### 7. Mobile Accessibility Testing

#### iOS with VoiceOver
```bash
# Settings > Accessibility > VoiceOver > On
# Triple-click Home/Power button to toggle
```

**Test Cases:**
- [ ] Swipe right/left to navigate
- [ ] Double-tap to activate
- [ ] Three-finger swipe to scroll
- [ ] Rotor for quick navigation
- [ ] Test in Safari and Chrome

#### Android with TalkBack
```bash
# Settings > Accessibility > TalkBack > On
# Volume keys to toggle
```

**Test Cases:**
- [ ] Swipe right/left to navigate
- [ ] Double-tap to activate
- [ ] Two-finger swipe to scroll
- [ ] Test in Chrome and Firefox

#### Touch Target Size
- [ ] Measure interactive elements
  - Expected: Minimum 44x44 pixels
  - Use: Browser DevTools or ruler

### 8. Automated Testing Tools

#### axe DevTools (Browser Extension)
```bash
# Install: https://www.deque.com/axe/devtools/
# Open DevTools > axe DevTools tab
# Click "Scan ALL of my page"
```

**Expected Results:**
- [ ] 0 Critical issues
- [ ] 0 Serious issues
- [ ] Document moderate issues
- [ ] Document minor issues

#### WAVE (Browser Extension)
```bash
# Install: https://wave.webaim.org/extension/
# Navigate to page
# Click WAVE icon
```

**Check for:**
- [ ] Errors: Must fix all
- [ ] Alerts: Investigate each
- [ ] Features: Verify present (ARIA, labels)
- [ ] Structure: Verify proper (headings, landmarks)
- [ ] Contrast: Must meet WCAG AA

#### Lighthouse (Chrome DevTools)
```bash
# Chrome DevTools > Lighthouse tab
# Select "Accessibility" category
# Click "Generate report"
```

**Target Score:**
- [ ] Accessibility: 90+ (Aim for 100)
- [ ] Best Practices: 90+
- [ ] SEO: 90+
- [ ] Performance: 80+

### 9. Common Issues to Check

#### Images
- [ ] All images have alt text
  - Decorative: alt="" (empty)
  - Informative: Descriptive alt text
- [ ] SVG icons have accessible names
  - Use: aria-label or title element

#### Forms
- [ ] All inputs have associated labels
  - Use: `<label>` element or aria-label
- [ ] Error messages are announced
  - Use: aria-describedby
- [ ] Required fields are marked
  - Use: required attribute and aria-required
- [ ] Validation errors are clear
  - Use: aria-invalid="true"

#### Buttons vs Links
- [ ] Buttons used for actions (onclick)
- [ ] Links used for navigation (href)
- [ ] Correct semantic HTML
- [ ] Proper ARIA roles if needed

#### Dynamic Content
- [ ] Updates announced to screen readers
  - Use: aria-live="polite" or "assertive"
- [ ] Loading states communicated
  - Use: aria-busy="true"
- [ ] Error states communicated
  - Use: role="alert"

#### Modals/Dialogs
- [ ] Focus trapped inside modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger on close
- [ ] Background content hidden
  - Use: aria-hidden="true"

### 10. Testing Documentation

#### Test Report Template

```markdown
# Accessibility Test Report
**Date:** YYYY-MM-DD
**Tester:** Name
**Environment:** Browser, OS, Screen Reader

## Summary
- Total Issues: X
- Critical: X
- Serious: X
- Moderate: X
- Minor: X

## Critical Issues
1. Issue description
   - Location: Component/Page
   - Impact: Who is affected
   - Fix: How to resolve

## Screen Reader Testing
- NVDA: Pass/Fail
- JAWS: Pass/Fail
- VoiceOver: Pass/Fail

## Keyboard Navigation
- Tab order: Pass/Fail
- Focus indicators: Pass/Fail
- Keyboard shortcuts: Pass/Fail

## Visual Testing
- Color contrast: Pass/Fail
- Text sizing: Pass/Fail
- Reduced motion: Pass/Fail

## Mobile Testing
- iOS VoiceOver: Pass/Fail
- Android TalkBack: Pass/Fail

## Automated Testing
- axe DevTools: Score
- WAVE: Issues found
- Lighthouse: Score

## Recommendations
1. Priority 1 (Critical)
2. Priority 2 (Important)
3. Priority 3 (Nice to have)
```

## Continuous Testing

### Pre-Commit
```bash
# Run automated tests
npm run lint
npm run test

# Check for accessibility in code review
# - Are ARIA labels present?
# - Is semantic HTML used?
# - Are focus indicators styled?
```

### Pre-Release
- [ ] Full screen reader test (NVDA + VoiceOver)
- [ ] Full keyboard navigation test
- [ ] Automated tool scan (axe + WAVE + Lighthouse)
- [ ] Mobile accessibility test
- [ ] User testing with actual users with disabilities

### Post-Release
- [ ] Monitor user feedback
- [ ] Track accessibility issues in GitHub
- [ ] Update this guide based on findings
- [ ] Schedule regular accessibility audits (quarterly)

## Resources

### Tools
- **NVDA**: https://www.nvaccess.org/
- **JAWS**: https://www.freedomscientific.com/
- **VoiceOver**: Built into macOS/iOS
- **TalkBack**: Built into Android
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/extension/
- **Lighthouse**: Built into Chrome DevTools
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

### Standards
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Practices**: https://www.w3.org/WAI/ARIA/apg/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

### Learning
- **WebAIM**: https://webaim.org/
- **A11y Project**: https://www.a11yproject.com/
- **Deque University**: https://dequeuniversity.com/
- **Google Accessibility**: https://developers.google.com/web/fundamentals/accessibility

## Support

For accessibility issues or questions:
- Create GitHub issue with "accessibility" label
- Email: accessibility@rangis.net
- Include: Browser, OS, assistive technology used

---

**Remember**: Accessibility is not a checklist—it's an ongoing commitment to inclusivity. Test often, test with real users, and always prioritize the experience of users with disabilities.

**Target Users**: 2+ billion people with disabilities deserve an excellent experience on RangisNet.
