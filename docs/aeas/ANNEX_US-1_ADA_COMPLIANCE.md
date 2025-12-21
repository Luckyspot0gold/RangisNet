# Annex US-1 — Alignment with ADA, Section 508, and WCAG

**AEAS v1.1 Standard**  
**Compliance Alignment Profile for United States Accessibility Law**

---

## Purpose

This annex documents how the ADA Economic Accessibility Standard (AEAS) aligns with existing United States accessibility law and guidance, including:

- **The Americans with Disabilities Act (ADA)**, Titles II and III
- **Section 508 of the Rehabilitation Act** (federal ICT accessibility)
- **Web Content Accessibility Guidelines (WCAG) 2.1 AA** (as referenced by U.S. regulators)

**AEAS is a technical and ethical standard, not a statute.**

This annex provides a compliance alignment profile to support lawful adoption, procurement, and deployment within U.S. public and private sectors.

> **Legal Disclaimer**: This annex does not constitute legal advice. Implementers should consult qualified counsel for formal compliance determinations.

---

## US-1.1 Core Legal Concept: Effective Communication

U.S. accessibility law requires that covered entities provide **effective communication** to individuals with disabilities through appropriate auxiliary aids and services.

**AEAS operationalizes "effective communication" for economic systems** by requiring that economic reality be perceivable through multiple sensory channels, such that no individual is excluded due to reliance on a single modality.

---

## US-1.2 Alignment Matrix

| AEAS Principle | ADA / 508 Alignment | Implementation Requirement |
|----------------|---------------------|----------------------------|
| **Multi-Modal Parity** | ADA requires appropriate auxiliary aids and services to ensure effective communication | Every critical economic signal must be available through at least two independent modalities (e.g., audio + haptic; visual + audio). |
| **User Choice & Modularity** | ADA Title II gives primary consideration to the individual's requested method of communication | Users must be able to select preferred sensory channels and adjust intensity/resolution. Defaults must be safe and clear. |
| **Non-Deceptive Translation ("Is Mandate")** | Supports effective, non-coercive communication | Raw signals must be separable from interpretation. Interpretive layers must be optional, labeled, and disable-able. |
| **Cognitive Load Management** | Effective communication depends on context and complexity | Systems must provide simplified modes, progressive disclosure, and controls to reduce overload. |
| **Auditability & Transparency** | Supports documentation of accessibility decisions and equally effective alternatives | Systems must log modality used, user settings, and any substitutions or overrides. |
| **No Cost Barrier to Basic Access** | Civil rights principle; Section 508 comparable access | Baseline accessible outputs must be available without payment. Paid tiers may only add resolution or optional features. |
| **Digital Interface Accessibility** | Title II web/app guidance references WCAG 2.1 AA | Web and app interfaces must target WCAG 2.1 AA conformance (captions, contrast, keyboard access, etc.). |

---

## US-1.3 Engineering Checklist (Minimum)

Implementations claiming AEAS–US alignment **SHOULD** meet the following baseline requirements:

### 1. Audio
- Captions and transcripts for spoken content
- Non-speech audio cues paired with text or haptic equivalents

### 2. Haptics
- Ability to disable haptics entirely
- Intensity and duration limits for safety
- Documented pattern library
- Always-available alternate modality

### 3. Visuals
- Color is never the sole indicator of state
- Adjustable contrast and scale
- Reduced-motion option

### 4. Controls
- Keyboard-only operation
- Screen-reader compatible labels and focus order

### 5. User Preferences
- User-selectable primary modality
- System honors choice unless safety requires substitution (logged)

### 6. Effective Communication Validation
- Testing with blind/low-vision, Deaf/HoH, neurodivergent users, and seniors for core tasks

### 7. Documentation
- Public accessibility statement
- Contact method for accessibility feedback or accommodation requests

---

## US-1.4 Relationship to AEAS Core

This annex does not alter AEAS core principles.

Where conflicts arise between legacy accessibility guidance and AEAS requirements, implementers **SHOULD** provide equally effective alternatives while preserving:

- **Non-deceptive translation**
- **Sensory parity**
- **User agency**
- **Auditability**

**AEAS is designed to exceed minimum compliance by restoring perceptual access, not merely technical accommodation.**

---

## US-1.5 Scope of Application

This annex applies to AEAS implementations deployed in or procured by:

- U.S. federal agencies
- State and local governments
- Public accommodations
- Educational institutions
- Financial and economic platforms operating in the U.S.

---

## Related AEAS Documentation

- **[AEAS v1.1 Standard](AEAS_V1.1_STANDARD.md)** - Chapter 2 (Accessibility Requirement), Chapter 11 (Compliance & Certification)
- **[AEAS Documentation Index](AEAS_DOCUMENTATION_INDEX.md)** - Complete navigation
- **[Literature Review](AEAS_LITERATURE_REVIEW.md)** - Academic backing for accessibility principles

---

## Future Annexes (Planned)

- **Annex INT-1**: International alignment (UN CRPD, ISO, EN 301 549)
- **Annex EU-1**: European Accessibility Act (EAA) and WCAG compliance
- **Annex PROC-1**: Government procurement language for AEAS-compliant systems

---

**End of Annex US-1**

---

**Contact**: justin@realityprotocol.io  
**Version**: 1.0 (December 21, 2025)  
**Part of**: AEAS v1.1 Standard Documentation Suite
