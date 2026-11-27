# DESICIA / design system v1.0

Locked before application code · Phase 2 · 2026-11-27. This is the portable nine-section brand contract. User-supplied requirements govern the design; source templates inform craft, not identity.

## 1. Brand and visual thesis
**Institutional intelligence, visibly engineered.** An architectural brass lattice inhabits a near-black editorial environment. Precise technical interfaces replace marketing-card filler. The visual progression is fragmented data → ordered signal → routed execution → operating core. DESICIA is the main brand; no third-party customer marks or invented trust badges. One bespoke letterform mark, simple geometric D, plus the tracked uppercase wordmark.

## 2. Color and contrast
- Canvas `#101211`; raised canvas `#171a18`; UI panels `#1b1f1c`.
- Main text `#f1f0e9`; secondary `#a9afa8`; quiet metadata `#8c968d` (never use dim decorative colors for essential text).
- Rules `#343c34`; thin decorative grid `#252c25`.
- Signature pale brass `#d8c6a0`; ink on brass `#161a16`.
- Status mint `#add3b0`; caution `#e4bd82`; errors `#ffb4ab`.
- No purple/cyan gradients. Spatial fog and a subtle monochrome spotlight are depth, not rainbow backgrounds. Foreground text sits over opaque or near-opaque surfaces wherever the scene could reduce contrast.

## 3. Typography (two local families)
Manrope variable for all editorial and interface text; IBM Plex Mono for data, technical coordinates and chapter labels. Both self-hosted from versioned npm packages, no runtime font calls.
- Desktop h1: 88px / 1.04, 450–500 weight, −5px tracking. At 1440 width it stays two lines.
- Desktop h2: 57px / 1.08, 450 weight, −2.4px tracking.
- Mobile h1 46px / 1.07, −2.4px; h2 38px / 1.1, −1.6px. Exact line breaks are authored and verified.
- Body 15–17px / 1.7; small text 12–13px / 1.5; mono labels 10–11px / 1.5 with 0.08em tracking when uppercase.
- Text is semantic HTML, never canvas. SVG data visualizations have accessible labels and summaries. No gratuitous all-caps paragraphs.

## 4. Spacing and grid
8px base; scale 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 112.
- Single `.wrap`: max-width 1264px, width calc(100% − 128px); at 1440 → 88px outer margins. At 1024 → 48px; at 768 → 32px; at 390 → 24px. Header, body and footer share this exact axis.
- Desktop >1100px: chapter height 100svh, min-height 820px. At 1440×900 each chapter exactly 900px, including closing footer. One h2 belongs to one chapter. No scroll snapping or scroll hijacking.
- Laptop/tablet/mobile: content-driven heights, at least 100svh where appropriate, with 96px top / 64px bottom padding. No clipped content to satisfy a viewport metric.
- Chapters 02–04: 5/7-ish split, left narrative and right product plate. Chapter 01 copy and scene overlap only in designated decorative areas. Under 900px all product plates follow the copy. Under 600px no forced desktop width.

## 5. Surfaces and components
2–8px radius; 1px quiet borders. Primary CTA brass rectangular button with small arrow; secondary text action with direction icon. No pill spam, glossy glass panels or tilt. Product plates are functional tools with clear title bars, toolbars, row separators and actual data. Pointer flashlight is a 4% brass surface wash only; never changes geometry or text contrast. Hover lift max 2px, 150ms. Focus ring 2px brass with 4px offset. Inputs at least 44px high; all icon-only buttons have accessible names.

## 6. Motion language
Native document scroll is the only scroll engine. GSAP ScrollTrigger measures chapter start/end and owns one normalized reversible route state. Camera smoothing uses exponential damping, never wheel delta accumulation. Hero copy is readable by default and receives only a <=700ms entrance; no preloader. Other content is never hidden pending scroll.
- Micro feedback 150ms; dialog 250ms; editorial entrance 650ms with 60ms stagger; cubic-bezier(0.2,0,0,1), GSAP power3.out.
- One persistent WebGL renderer; shader motion and pointer inertia stop when paused/hidden. A visible Pause motion control is always available on desktop.
- prefers-reduced-motion: no WebGL loop, no parallax, instant chart/diagram updates, no scroll smoothing. Pointer effects fine-pointer only. Simulation is user-triggered and finite; it has text state independent of movement.

## 7. Spatial scene and image grammar
See `docs/SCENE.md` for the ledger/keyframes. One procedural lattice of signal rails and individually instanced brass/graphite units, surrounding a restrained core. Soft warm key, cooler neutral rim, matte dark support structure. Same materials throughout chapters. Perspective field and line-grid floor give spatial scale. No borrowed Kage imagery, generated executive avatars, stock photographs or runtime asset network dependency. A static SVG diagram uses the same deterministic lattice projection on mobile/no-GPU/reduced-motion. It is a data/architecture graphic, not a fake photograph.

## 8. Interaction, data and conversion
Analytics tabs change a coherent synthetic dataset, including chart, metric and anomaly feed. Forecast is switchable. Workflow nodes expose their system/action/guardrail; execution pauses for human approval. Estimator uses a public formula with four labelled inputs and visible assumptions; output is annual capacity value, not promised cash ROI. Audit dialog traps focus through native modal semantics, Escape closes and focus returns. API validates and durably stores a local lead, never claims external delivery. Separate privacy notice explains exactly what is stored and what the local build does not do.

## 9. Validation and production boundaries
Check 1440×900, 1024×768, 768×1024, 390×844 plus 320px and text zoom. No horizontal overflow; desktop headings ≤2 lines, mobile authored ≤2 lines; clear hero and CTA within 1.2s. Test all navigation, demos, approval, calculator math, valid/invalid submissions, server errors, privacy modal and keyboard flow. Run Taste consistency/layout/copy/perf/gate without modifying upstream scripts. Report measured frame cadence; 60fps is a target, not a hardware-independent guarantee. Never fabricate case-study metrics, certification or security promises to pass a checker. Record any exact heuristic mismatch with evidence, not a blanket waiver. Local lead storage, legal copy, CRM notification, deployment, domains and procurement claims must be explicitly reviewed before a public launch.
