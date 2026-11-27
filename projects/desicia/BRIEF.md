# Brief — DESICIA

> Phase 0 of `.claude/skills/website-pipeline`. No build until the clarity score is 100 %.
> ✅ answered (source) · 🟡 assumed (user approved or user-delegated) · ❌ open

## Clarity checklist

### Company and offer
- [x] ✅ Name: **DESICIA**, written in capitals (kickoff prompt).
- [x] ✅ What it sells (prompt): 1) AI data analytics: raw enterprise data turned into real-time decisions, predictive intelligence and executive clarity; 2) AI automations: autonomous, reliable workflow orchestration across ops, sales, finance and engineering; 3) end-to-end AI transformation: modernising legacy processes, systems and teams.
- [x] ✅ Pricing: none shown; scoped after a call (round 2 answer).
- [x] ✅ Where: remote-first, global; no city shown (round 2 answer).
- [x] 🟡 Difference: the client gave none in its own words. Derived from the competitor research and recorded here as **proposals the client must confirm** (they are on the page): one team from data to decision to automated action; a written success metric before build; work inside the client's cloud; the client owns code, models and prompts; people approve consequential actions; production in 12 weeks for a first system; exit after any phase.

### Buyer
- [x] ✅ Who: enterprise and high-growth companies worldwide (prompt). Deciders: COO, CFO, CIO/CDO, VP Operations; users: ops, finance, sales-ops, data teams.
- [x] 🟡 Top objections (from research): "AI pilots never reach production"; "our data is not ready"; "you are new / no references"; "security and data leaving our cloud"; "lock-in to a vendor".
- [x] ✅ Main action: **Book a call** (round 1 answer; standing answer).
- [x] 🟡 Secondary action: See the live demo (in-page).

### Proof that really exists
- [x] ✅ Logos: none.
- [x] ✅ Numbers: none.
- [x] ✅ Testimonials / case studies: none — trust is built from verifiable commitments; slots kept as HTML `<template>`s for later.
- [x] ✅ Certifications: none claimed (no SOC 2 / ISO line on the page).

### Brand
- [x] ✅ Name only; colours and fonts chosen by us (round 1 answer).
- [x] ✅ Tone and bans: elite, plain, no buzzwords; banned: revolutionize, unlock the power of AI, synergy, purple-blue gradients, glowing brains, cards in cards (prompt).
- [x] ✅ Language: English, global market.

### Scope and tech
- [x] ✅ One long page with the sitemap in the prompt + privacy and terms pages.
- [x] ✅ Form: name, work email, company, area, what should change; posts to the site's own `/api/contact`, SMTP-ready, sent to an email address. 🟡 The address was not given → env var `CONTACT_TO`, `.example` default, every request also logged to `data/requests.jsonl`.
- [x] ✅ Stack: free; we ship static HTML + a zero-framework Node server.
- [x] ✅ Imagery: no stock photos (prompt): product/system UI, diagrams and code-drawn accents only.

### Market
- [x] ✅ Named: Palantir, Databricks, Scale AI, Snowflake, Linear, Vercel, x.ai "and others" (we added Distyl, Faculty, QuantumBlack, Fractal, Tiger Analytics).
- [x] ✅ Admired: Linear-grade product visuals, Snowflake's authentic system diagrams (prompt + research).

**Clarity score:** 24 / 24 (two lines delegated: differentiators and the email address — both flagged in REPORT.md).
