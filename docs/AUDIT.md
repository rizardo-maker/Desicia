# DESICIA — browser audit and release status

**GATE: OPEN 42 (rounds used up, 3 of 3). Not release-certified.**

`OPEN` means the tool exhausted its iteration budget with 42 unresolved failures; it does **not** mean the design passed.

The complete working site is available in the local preview. The requested live browser/Taste inspection has been executed, but the requirement that every Taste finding be cleared is **not satisfied**. No waiver file was added and no upstream checker was modified. This document deliberately distinguishes a working implementation from a passed release gate.

## Environment and evidence

- Date: 2026-11-27. Production build served at `http://localhost:3000`, bound to `0.0.0.0`.
- Node 22.22.3, Chromium 141 (npm-distributed), Playwright, axe-core and the pinned Taste 2.5.1 bundle.
- Chromium uses SwiftShader in this minimal container: this is **not a hardware-GPU benchmark**.
- Durable JSON/text evidence: [`audit/`](audit/). Heavy screenshots/crops are in ignored `reports/design/` and can be regenerated.
- Source hashes: [`audit/source-hashes.json`](audit/source-hashes.json). This is a file-integrity record, not a new Git commit or an external attestation.

## Functional and layout results — final build

`npm run audit:browser` exits 0: **16/16 interaction checks pass**, no unexpected browser console/page errors.

| Viewport | All wrapper left/right edges | Horizontal overflow | Main heading lines | axe A/AA violations | Lab LCP | Lab CLS |
| --- | --- | --- | --- | --- | --- | --- |
| 1440 × 900 | 88 / 88 px | 0 px | 2 each | 0 | 568 ms | 0.0028 |
| 1024 × 768 | 48 / 48 px | 0 px | 2 each | 0 | 148 ms | 0.0053 |
| 768 × 1024 | 32 / 32 px | 0 px | 2 each | 0 | 584 ms | 0.0041 |
| 390 × 844 | 24 / 24 px | 0 px | 2 each | 0 | 192 ms | 0.0096 |

All five desktop chapters measure **900px**, with starts at 0, 900, 1800, 2700 and 3600. The closing footer is part of chapter 05. Smaller screens use natural chapter heights rather than clipping content or padding every section to a screen multiple. The additional 320px overflow test also passes.

LCP values here are local, single-load observations, not field Core Web Vitals or an INP certification. The headline/CTA are visible on load and GSAP never fades their foreground/background contrast. A hardware-measured first WebGL frame within 1.2s on every device is not established.

### Working interactions actually exercised

1. Revenue / Operations / Supply chain tabs update chart, headline values and decision feed; forecast switch works.
2. Workflow step inspector updates; simulation pauses for human approval and completes only after approval.
3. Estimator recalculates: default 25 × 8 × 48 × $45 × 40% = **$172,800 annual capacity value**; changing to 50 people returns $345,600.
4. Every chapter rail anchor updates the URL and navigates to the intended chapter.
5. Pause stops the render loop; resume restarts it.
6. Audit dialog opens, native form constraints work, focus stays in the dialog and Escape closes it.
7. API creates an actual SQLite record and returns a receipt reference.
8. A deliberately injected 503 produces a recoverable error, not a fake success. Its expected network error is separately recorded, not counted as an unexpected console defect.
9. Privacy notice opens/closes and describes actual local-build behavior.
10. Enterprise diligence disclosures expand with VPC/data-handling and SOC 2 procurement content, without asserting certification.
11. Keyboard traversal keeps controls visible below the fixed header, including the analytics tab that was initially partially obscured.
12. Mobile navigation closes on selection and navigates correctly.
13. Reduced-motion mode keeps all content/controls and uses the static lattice with no WebGL engine.
14. Forced `?nogl` preserves the diagram and primary action.
15. 320px stress test has no horizontal overflow.
16. Loading a direct `/#transformation` URL restores the intended chapter after React and fonts mount.

Axe's zero reported A/AA violations is useful automated evidence, **not a full human accessibility conformance audit**. Full assistive-technology, 200–400% zoom and production-device testing remain release work.

## Before → after: what changed

| Area | Initial observation | Final observation / fix |
| --- | --- | --- |
| Original functional suite | 12/13 pass; pause timing assertion failed | Original 13 plus three new disclosures/focus/deep-link tests: **16/16 pass**. Pause test now allows one initial settling frame; continuous idle rendering is stopped. |
| Fixed-header keyboard focus | Revenue tab partially obscured at ~66px under an 88px header | Synchronous visibility guard plus RAF recheck; 38-step keyboard traversal passes. |
| Hero entrance contrast | An intermediate pass caught a faded primary CTA at 3.14:1 | Removed opacity fade from entrance; transform-only reveal. Final axe pass reports 0 violations. |
| Direct deep links | Initial native hash lookup ran before React created the chapter | Mount-aware hash restoration added; direct URL browser test passes. |
| Small-screen content axis | 768px product wrapper capped at 650px while nav was wider | Removed that cap; all wrappers now have 32px equal margins. |
| Tablet hero | Next chapter could peek into first 1024px-tall viewport | Hero now fills at least that viewport at tablet sizes. |
| Semantic hierarchy | Capability index used small h2 headings | Capability labels are now strong text; five authored chapter headlines remain. |
| Copy clarity | Hero said “Intelligence” without category in h1 | Hero now says “Enterprise AI, put to work.” |
| Slow WebGL | 9fps software rendering, no final performance fallback | Quality reduces to DPR .75 / 196 instances; sustained <24fps triggers a static fallback. |
| Transfer size | Taste measured 983.8KiB desktop / 502.7KiB phone before compression | Compression enabled: **319.3KiB desktop / 196.6KiB phone**. |
| Runtime dependencies | Initial package installs had advisories | Patched through npm; final `npm audit` reports **0 vulnerabilities** at audit time. |

Do not interpret the software-rendering fallback as achieving 60fps. The final sampled scene was approximately **10fps before fallback**, with 4 draw calls and 2,364 triangles at reduced quality, and then stopped rendering in `static-fallback` mode. **60fps on hardware desktop GPUs remains unverified and the container does not meet it.**

## Taste tools: exact status

### Consistency

- Initial full inspection at 1440, 1024, 768 and 390: **131 FAIL / 60 WARN** (`reports/design/taste-before.json`). Includes reduced-motion, slow-load, fallback and section-grid passes.
- Post-refinement `--quick` inspection at the same four widths: **31 FAIL / 58 WARN** (`reports/design/taste-after.json`). **These counts are not a like-for-like improvement measurement**: quick mode omits portions of the full run. Additional fixes followed this intermediate run.
- Final finish gate: **42 open FAIL**, all 3 rounds used, combining consistency and stricter layout findings at desktop/phone. Full unabridged output: [`audit/taste-gate-final.txt`](audit/taste-gate-final.txt).

### Layout

The separate layout tool ran at **1440×900, 1024×768, 768×1024 and 390×844**, including its long-headline stress tests. It returned findings; raw results are in [`audit/taste-layout.json`](audit/taste-layout.json). Do not label it passed. This tool expects the kit's component/column topology and exact screen-height rhythm on phone/tablet too, unlike this approved natural-flow mobile specification.

### Copy

Final rendered-page copy lint exits 0: **0 FAIL, 4 WARN**, plus informational findings. Warnings retained for review:
- two paired-fragment headings (analytics and workflow), used intentionally for parallel capabilities;
- the console's synthetic metric set is interpreted as a stat strip (it is labelled illustrative product UI, not customer proof);
- numbered chapter/workflow steps (sequential, not arbitrary decoration);
- chapter eyebrows beyond the generic copy budget (part of the requested five-chapter navigation).

See [`audit/copy-final.json`](audit/copy-final.json). The finish gate's separate dictionary-based `copy-headings` rule still flags nouns such as “AI workflows” and “Data governance”; a copy-lint pass is not a gate pass.

### Performance and screenshots

`npm run audit:taste -- perf` exits 0 with **0 FAIL / 1 WARN**:

| Measure | Desktop 1440 | Phone 390 |
| --- | --- | --- |
| Transfer | 319.3 KiB | 196.6 KiB |
| Parsed JS | 898.4 KiB — WARN | 417.9 KiB — PASS |
| Font families / font files | 2 / 2 | 2 / 2 |
| Peak WebGL contexts | 1 | 0 |
| Median fallback LCP (3 runs) | 320 ms | 260 ms |
| Median CLS | 0.003 | 0.000 |
| Broken requests | 0 | 0 |

Taste measures timing with WebGL off/fallback for CPU comparability; its own tool explicitly does not measure FPS. The browser harness separately samples render cadence. No field-performance claim is made.

Taste's `shoot.mjs` also ran successfully: a **1440×4500** full-page capture and five desktop section tiles, each exactly one screen. The custom browser harness additionally saves hero/full-page/chapter captures at all four requested widths.

## Remaining gate categories and disposition

All exact findings/selectors are preserved in the unedited gate log; none is silently waived. Main categories:

- **`shader-lint`:** scanner treats Three.js's `#include <common>` chunk directive as a reserved variable. It is not a GLSL variable declaration. The WebGL scene renders with no shader compile error in the browser. This is a documented false positive, not a reason to edit Three.js.
- **`hero-enter`, `moment-none`:** checker requires the kit's `html.m-enter` head script and dealt moment IDs. The site uses the explicitly requested bespoke GSAP entrance and continuous Three.js chapter morph. It does not pretend to load the kit's animation runtime.
- **`container-edges`, `edge-left`:** many findings assert that nested UI headings, a numbered index, icon-indented copy and React's root must follow the kit's literal markup. Measured exterior margins are equal; these findings still remain formally open pending design-policy approval.
- **`no-visual`, `empty-area`, `text-only`:** the global persistent canvas / decorative SVG fallback and line icons are not recognized as local section pictures. The hero's required spatial world is visible, but is deliberately outside the section content grid. Closing content is diligence and conversion rather than a decorative photograph.
- **`hero-fold`, `neighbour`:** phone chapters flow naturally and the footer belongs to the final chapter; the kit expects screen multiples and a separate footer shape. These are specification conflicts, not permission to claim the tool passed.
- **`section-air`, `split-pair`:** the custom design uses fine editorial rules and a different closing split from the product splits. These are unresolved formal Taste design-rule conflicts.
- **`hero-screen`, `section-height`:** consistency reports a ~6px section boundary discrepancy under its probe, while the independent harness and layout tool measure five exact 900px chapters. Treat this discrepancy as unresolved; it should be reviewed across the target device/browser set rather than dismissed without evidence.

**Next release decision:** reconcile the remaining template-governor constraints with the bespoke spatial brief, or obtain explicit approval for specific, evidence-backed exceptions. Do not add a broad waiver or mark the 42 findings fixed merely to make the final status green.

## Run / reproduce

```sh
npm ci
npm run build
npm start                       # http://localhost:3000, one server for site + API
# Development (alternative, not simultaneously on port 3000):
npm run dev

# With the site running:
npm test
npm run audit:browser
npm run audit:taste -- consistency
npm run audit:taste -- layout
npm run audit:taste -- perf
npm run audit:taste -- shoot
npm run audit:taste -- gate      # returns nonzero while the documented findings remain
python3 tools/design_skills.py verify
```

## Public-launch blockers beyond visual QA

- Connect a genuine approved notification/CRM/calendar service. Current requests are saved locally; there is **no email delivery or meeting confirmation**.
- Approve real legal/privacy/controller information and deployment-specific retention/residency terms.
- Verify all enterprise procurement/security claims. No fabricated SOC 2 certificate, customer outcome, private-VPC guarantee or blanket zero-retention claim was added.
- Provide genuine case studies if a results/proof section is required. Current figures are illustrative UI/scenario values, not evidence of actual client outcomes.
- Conduct hardware GPU / device / assistive-technology testing; 60fps is not established.
- Resolve the Taste gate and review the desktop parsed-JS warning before calling this release-ready.
- For multi-instance/high-volume public traffic, replace instance-local lead storage/rate limiting with managed durable storage and distributed abuse controls. Design quality alone does not establish millions-of-visitors capacity or millions of conversions.
