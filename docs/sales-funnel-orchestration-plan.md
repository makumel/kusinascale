# Sales Page Funnel, Ad Creative & Brand System Plan

## Step 1: Brand Identity, Tone of Voice & Trademark Clearance
- **Intent**: Conduct mandatory trademark and domain searches, establish brand archetype, define tone-of-voice matrix, and specify accessible visual design tokens.
- **Scope**: Search USPTO and online domains for name conflicts. Author `brand-guidelines.md`, `voice-matrix.md`, and Tailwind CSS theme `tokens.json`.

## Step 2: Ad Copy Angles & AI Image Generation Prompts
- **Intent**: Develop multi-angle direct response ad copy suites across PAS and AIDA frameworks alongside Midjourney/FLUX prompt suites.
- **Scope**: Write 5 distinct ad angles (pain-point, dream state, contrarian, case study, curiosity) for Meta and TikTok. Create production-ready AI image prompts with exact aspect ratios (`--ar 1:1`, `--ar 4:5`, `--ar 9:16`) and lighting specifications in `ad-creatives.md`.

## Step 3: High-Converting Sales Page & VSL Architecture
- **Intent**: Structure the full long-form sales page and VSL layout with hero hook, problem agitation, mechanism breakdown, value stack, risk-reversal guarantee, and FAQ accordion.
- **Scope**: Implement responsive React 19 / Tailwind components for the sales page hero, feature comparison, testimonials, pricing stack, and sticky CTA bar.

## Step 4: Checkout Flow, Order Bumps & Post-Purchase OTO Upsell
- **Intent**: Build streamlined checkout flow featuring 1-click order bump, post-purchase upsell/downsell routing, and payment processing contracts.
- **Scope**: Implement checkout form components, order bump selector, OTO 1 modal, and order state management.

## Step 5: Honeypot Anti-Bot Security & Form Deception
- **Intent**: Deploy invisible CSS honeypot fields and bot interception middleware on all public opt-in and checkout endpoints.
- **Scope**: Embed invisible honeypot inputs (`position: absolute; left: -9999px; aria-hidden="true"; tabindex="-1"`) and server-side verification to silently intercept automated submissions without intrusive CAPTCHAs.

## Step 6: End-to-End Funnel Testing & Conversion Verification
- **Intent**: Verify full user journey from ad click landing to checkout completion and test bot trapping mechanics.
- **Scope**: Build automated Playwright E2E test suite verifying mobile/desktop layouts, coupon calculation, order bump toggling, and honeypot bot rejection.

## Step 7: Funnel Deployment Playbook & Asset Documentation
- **Intent**: Compile full marketing campaign runbook, analytics event mapping, and deployment checklist.
- **Scope**: Generate `funnel-playbook.md` with Meta Pixel / GA4 event specs, media buying launch timeline, and maintenance runbook.
