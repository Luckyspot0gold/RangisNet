# AEAS / Rangi's Net — Risk Register

**Status:** Living Document  
**Review Cadence:** Monthly or upon major release  
**Owner:** William McCrea, Reality Protocol LLC  
**Last Updated:** December 21, 2025

---

## Purpose

This Risk Register identifies potential risks associated with AEAS development, Rangi's Net deployment, and public communication. Each risk is assessed for likelihood and impact, with active mitigation strategies.

---

## Risk Matrix

| Risk | Description | Likelihood | Impact | Mitigation |
|------|-------------|------------|--------|------------|
| **Over-claiming** | Public language interpreted as exaggerated or exclusive | Medium | High | Use press-safe language; emphasize draft status and review |
| **Regulatory Misinterpretation** | Assumed to be official ADA standard | Medium | High | Clear disclaimers; "alignment" not "designation" |
| **Accessibility Gaps** | Certain disabilities not adequately supported | Medium | Medium | Iterative testing; public comment; pilot feedback |
| **Sensory Overload** | Multi-modal output overwhelms some users | Medium | Medium | Default minimal mode; user controls; pause/rewind |
| **Misuse as Trading Tool** | Users attempt to use system for prediction | Medium | Medium | Explicit non-goals; disable predictive language |
| **Security Vulnerabilities** | Code vulnerabilities exploited | Medium | High | Dependency audits; staged deployment; monitoring |
| **Data Misinterpretation** | Sensory mappings misunderstood | Low | Medium | Clear documentation; reversibility; interrogation tools |
| **IP Confusion** | Open standard vs proprietary components unclear | Low | Medium | Explicit licensing and scope statements |
| **Public Backlash** | Perceived ideology or politics | Low | Medium | Nonpartisan framing; accessibility focus |
| **Founder Burnout** | Overextension during launch | Medium | High | Phased rollout; clear priorities; rest windows |

---

## Risk Details & Action Items

### 1. Over-claiming (Medium Likelihood / High Impact)

**Description:** Marketing language or public statements interpreted as overstating capabilities, exclusivity, or scientific validation.

**Indicators:**
- Use of superlatives ("world's first", "only solution")
- Claims of regulatory approval before achieved
- Implying AEAS is mandatory or universally accepted

**Mitigation:**
- ✅ Use press-safe release template (see [docs/communications/PRESS_RELEASE.md](communications/PRESS_RELEASE.md))
- ✅ Emphasize "draft standard" status prominently
- ✅ Invite public review and comment (see [CALL_FOR_COMMENT.md](/CALL_FOR_COMMENT.md))
- Use qualifiers: "proposes", "demonstrates", "explores"
- No claims of scientific proof without peer-reviewed publication

**Action Items:**
- [ ] Review all public-facing text for superlatives
- [ ] Add "Draft v1.x" watermark to all AEAS documents
- [ ] Train any spokesperson on tone guidelines

---

### 2. Regulatory Misinterpretation (Medium Likelihood / High Impact)

**Description:** AEAS could be misunderstood as an official government standard or legally mandated requirement.

**Indicators:**
- Media or users referring to AEAS as "the ADA standard for finance"
- Assumed endorsement by U.S. Access Board or DOJ
- Confusion between "ADA Economic Accessibility Standard" and ADA law itself

**Mitigation:**
- ✅ Annex US-1 clearly states "alignment" not "designation" (see [docs/aeas/ANNEX_US-1_ADA_COMPLIANCE.md](aeas/ANNEX_US-1_ADA_COMPLIANCE.md))
- Add disclaimer footer to all AEAS documents
- Use full name on first reference: "ADA Economic Accessibility Standard (AEAS), a community-developed draft"
- Include statement: "AEAS is not endorsed by or affiliated with the U.S. Department of Justice"

**Action Items:**
- [ ] Add regulatory disclaimer to AEAS_V1.1_STANDARD.md front matter
- [ ] Create FAQ addressing "Is AEAS legally required?"
- [ ] Monitor for mischaracterization in press/social media

---

### 3. Accessibility Gaps (Medium Likelihood / Medium Impact)

**Description:** Despite best efforts, AEAS may not adequately support all disability profiles, creating unintended exclusion.

**Indicators:**
- User testing reveals confusion or frustration
- Certain sensory channels inaccessible to specific disabilities
- Cognitive load remains high for neurodivergent users

**Mitigation:**
- ✅ Literature Review identifies research gaps (see [docs/aeas/AEAS_LITERATURE_REVIEW.md](aeas/AEAS_LITERATURE_REVIEW.md))
- ✅ Call for Comment invites accessibility expert feedback
- Pilot testing with diverse disability community (see [docs/communications/PILOT_OUTREACH_EMAIL.md](communications/PILOT_OUTREACH_EMAIL.md))
- Iterative versioning (v1.x → v2.0 based on feedback)
- Partner with disability advocacy organizations (NFB, ACB, HLAA)

**Action Items:**
- [ ] Schedule pilot with at least 3 accessibility labs
- [ ] Document accessibility gaps in version changelog
- [ ] Establish accessibility advisory board

---

### 4. Sensory Overload (Medium Likelihood / Medium Impact)

**Description:** Multi-modal output (audio + haptic + visual simultaneously) may overwhelm users with sensory processing sensitivities.

**Indicators:**
- User reports of overstimulation, confusion, or anxiety
- Autistic users report too much simultaneous input
- Users with PTSD triggered by certain sounds/vibrations

**Mitigation:**
- Default to minimal mode (single modality at startup)
- User controls for each channel (independent volume, intensity, disable)
- Pause/rewind capability for temporal data
- Customizable presets (e.g., "Audio Only", "Gentle Mode", "High Contrast")
- Warning labels for intense sensory experiences

**Action Items:**
- [ ] Implement minimal mode as default in Rangi's Net
- [ ] Add sensory preference wizard on first launch
- [ ] User testing with autistic and PTSD communities

---

### 5. Misuse as Trading Tool (Medium Likelihood / Medium Impact)

**Description:** Users may ignore disclaimers and attempt to use Rangi's Net for predictive trading or investment decisions.

**Indicators:**
- Forum discussions framing system as "trading signal"
- Users asking "should I buy/sell based on this?"
- Media coverage positioning as fintech product

**Mitigation:**
- ✅ Press release explicitly states "Not a trading platform" (see [docs/communications/PRESS_RELEASE.md](communications/PRESS_RELEASE.md))
- Disable all predictive language in UI ("will rise", "likely to fall")
- Prominent disclaimer on launch: "For perception, not prediction"
- No integration with brokerage APIs
- Educational content: "How AEAS differs from trading signals"

**Action Items:**
- [ ] Add modal disclaimer on first launch of Rangi's Net
- [ ] Remove any future-tense language from system outputs
- [ ] Monitor user discussions for misuse patterns

---

### 6. Security Vulnerabilities (Medium Likelihood / High Impact)

**Description:** Code vulnerabilities could expose user data, enable exploits, or damage reputation.

**Current Status:** ⚠️ **60 Dependabot alerts flagged** (1 critical, 30 high, 24 moderate, 5 low)

**Indicators:**
- Dependabot security alerts
- Failed CodeQL scans
- Penetration test findings
- Unauthorized access attempts

**Mitigation:**
- ✅ CodeQL workflow fixed and operational (see [CODEQL_WORKFLOW_FIX.md](/CODEQL_WORKFLOW_FIX.md))
- **URGENT:** Address 60 current vulnerabilities (see [GitHub Security](https://github.com/Luckyspot0gold/RangisNet/security/dependabot))
- Staged deployment (dev → staging → production)
- Regular dependency audits
- Penetration testing before public launch
- Security incident response plan

**Action Items:**
- [ ] **CRITICAL:** Remediate 1 critical + 30 high vulnerabilities within 7 days
- [ ] Enable Dependabot auto-updates for low-risk patches
- [ ] Schedule quarterly security audit
- [ ] Implement rate limiting and input validation

---

### 7. Data Misinterpretation (Low Likelihood / Medium Impact)

**Description:** Sensory mappings (pitch, rhythm, vibration) misunderstood, leading to incorrect mental models.

**Indicators:**
- User testing shows misalignment between intended and perceived meaning
- Users report "hearing something different than chart shows"
- Confusion about what specific sounds/vibrations represent

**Mitigation:**
- Clear documentation of all sensory mappings (see AEAS Chapter 6)
- Reversibility: users can query "what does this sound mean?"
- Interrogation tools: hover/tap to see raw data value
- Calibration wizard to align user expectations
- Tutorial mode with explicit explanations

**Action Items:**
- [ ] Add "interrogation mode" to Rangi's Net (tap any element for raw data)
- [ ] Create video tutorials explaining each sensory mapping
- [ ] User testing: "Play sound, describe what you think it means"

---

### 8. IP Confusion (Low Likelihood / Medium Impact)

**Description:** Unclear boundaries between open standard (AEAS) and proprietary implementation (Rangi's Net).

**Indicators:**
- Developers unsure if they can implement AEAS without license
- Assumption that AEAS requires Rangi's Net platform
- Requests to "license AEAS" when standard is freely available

**Mitigation:**
- ✅ Clear licensing documentation (see [docs/ip-and-legal/](ip-and-legal/))
- Explicit statement: "AEAS is a public standard, free to implement"
- Separate branding: AEAS (standard) vs Rangi's Net (implementation)
- List of components:
  - **Open:** AEAS standard, documentation, test suites
  - **Proprietary:** M3 McCrea Market Metrics algorithms, Venice AI integration, certain UI/UX elements

**Action Items:**
- [ ] Add "Implementing AEAS" guide for developers
- [ ] Create AEAS logo distinct from Rangi's Net branding
- [ ] Publish reference implementation under permissive license (MIT/Apache)

---

### 9. Public Backlash (Low Likelihood / Medium Impact)

**Description:** AEAS or Rangi's Net perceived as politically or ideologically motivated, triggering backlash.

**Indicators:**
- Social media accusations of bias
- Boycott calls from either political spectrum
- Media framing as "woke accessibility" or "anti-regulation"

**Mitigation:**
- ✅ Nonpartisan framing: accessibility as universal design, not identity politics
- Focus on technical/ethical benefits, not social commentary
- No political endorsements or affiliations
- Cite bipartisan support for ADA (signed by George H.W. Bush)
- Emphasize individual agency and choice

**Action Items:**
- [ ] Review all public materials for politically charged language
- [ ] Prepare rapid response to mischaracterization
- [ ] Seek endorsements from diverse stakeholders (left/right, public/private)

---

### 10. Founder Burnout (Medium Likelihood / High Impact)

**Description:** Overextension during launch phase leads to exhaustion, health issues, or project abandonment.

**Indicators:**
- Working >60 hours/week consistently
- Skipping meals, sleep, exercise
- Loss of enthusiasm or cynicism
- Delayed responses to stakeholders
- Health symptoms (headaches, anxiety, insomnia)

**Mitigation:**
- ✅ Phased rollout plan (see [DEPLOYMENT_CHECKLIST.md](deployment/DEPLOYMENT_CHECKLIST.md))
- Clear priorities: security → documentation → outreach → features
- Rest windows: 1 day/week fully offline
- Delegate non-core tasks (community management, support)
- Funding secured (Ashish Jan 15-18) to enable hiring

**Action Items:**
- [ ] Define "minimum viable launch" vs "nice to have"
- [ ] Schedule mandatory rest day each week
- [ ] Identify 2-3 tasks to delegate or defer
- [ ] Track weekly hours; trigger break if >50 hours

---

## Risk Review Process

### Monthly Review (or upon major release):
1. Review each risk for changed likelihood/impact
2. Evaluate effectiveness of mitigation strategies
3. Add new risks identified through operations
4. Update action items (mark complete, add new)
5. Communicate changes to stakeholders

### Trigger Events for Immediate Review:
- Security incident or breach
- Negative press coverage
- User injury or accessibility complaint
- Regulatory inquiry
- Major product launch

### Document History:
- **v1.0** (Dec 21, 2025): Initial risk register created
- *Future versions will be logged here*

---

## Related Documents

- [AEAS v1.1 Standard](aeas/AEAS_V1.1_STANDARD.md)
- [Annex US-1: ADA Compliance](aeas/ANNEX_US-1_ADA_COMPLIANCE.md)
- [Press Release](communications/PRESS_RELEASE.md)
- [Call for Comment](/CALL_FOR_COMMENT.md)
- [Deployment Checklist](deployment/DEPLOYMENT_CHECKLIST.md)
- [Security: Dependabot Alerts](https://github.com/Luckyspot0gold/RangisNet/security/dependabot)
