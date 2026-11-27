# DESICIA website: build report

Branch `arena/d954650d-desicia`. Site in `projects/desicia/site/`. Supporting documents: `BRIEF.md`,
`research/COMPETITORS.md`, `SCRIPT.md` (all page copy, written before any design), `PRODUCT.md`, `DESIGN.md`,
`SKILL-ROUTING.md`.

## 1. What competitors do

Fetched live on 27 Nov 2026: Palantir, Databricks, Scale AI (and /enterprise), Snowflake, Distyl, Faculty,
Fractal, Tiger Analytics, Quantiphi, McKinsey QuantumBlack, Linear and x.ai. Also read: 2026 buyer guides on AI
transformation firms. Full teardown in `research/COMPETITORS.md`.

- **Buyer pain is the same everywhere:** pilots that never reach production. Scale says "Most AI initiatives
  never make it past pilot". Big consultancies run 3–18 months at $250–700/hr. Forward-deployed shops (Distyl
  and others) sell 2–6 week starts.
- **The strongest sites show the working system.** Snowflake's governance diagram and Linear's real product UI do
  this. The weakest show abstract blue curves and buzzwords (QuantumBlack), or news and award carousels (Palantir,
  Fractal, Tiger).
- **Clichés we avoided:** logo marquees, news and award carousels, three-icon pillar rows, navy with electric
  blue, "transform/unlock" copy, letter-by-letter headline animation, cookie walls.
- **The gap:** no one shows *one team* from data to decision to automated action to measured result. Also, a new
  firm has no logos to lean on.

## 2. Positioning

**DESICIA: enterprise AI, from data to action.** One team builds the forecasts, the automations and the process
changes, inside the client's own cloud.

There is no proof yet, so trust rests on commitments a buyer can check and put in a contract:
- a written success metric before the build;
- built in the client's AWS, Azure or Google Cloud;
- client data never trains a model;
- people approve consequential actions;
- every action is logged;
- the client owns code, models and prompts;
- the client can exit after any phase.

Terms we had to assume (12-week first system, 2-week diagnosis, fixed price per phase, 45-minute call) carry
`data-assumed` in the HTML so they are easy to find and confirm. Logo and case-study slots can be added to the
Proof section later, when they exist.

## 3. Design decisions

- **Polarity:** a light page with one dark band (the live demo), where the working system runs. The reader is an
  executive on a laptop in daylight, not a developer in a dark IDE.
- **Colour (impeccable colorize):**
  - Ledger green `#006d41` is the only accent. It marks action and state (approved, running, within limits),
    which is what the product's states mean. Blue, violet, black and navy were all taken by competitors.
  - The neutrals are tinted toward the brand hue: canvas `#f5f8f3`, surface `#ebefe8`, ink `#131914`, secondary
    text `#4c534d`.
  - The first build used a warm cream canvas (`#f9f6f1`). The impeccable detect pass flagged it as the reflexive
    "tasteful" default, and it was off-brand next to a green accent, so every warm neutral was re-derived in
    OKLCH (hue 135–150, chroma ≤ 0.016). Contrast went up: muted text is 7.4:1 on the canvas, up from 6.1:1.
  - Full role table in `DESIGN.md`.
- **Type:** Schibsted Grotesk for display and text (weight 400 display, tight tracking) and JetBrains Mono for
  system data. Both are self-hosted woff2 with OFL licences, so there are no third-party font calls. The kit
  dealt Geist, but impeccable bans it.
- **Grid:** 12 columns, 1280 wrap, sharp radius, and one screen per section on desktop. On phones a section is
  either exactly two screens or at most 1.5 screens, ending on its own content.
- **Assets (no stock, no placeholders):** every picture is the system itself.
  - Hero: an operations console on a CSS gradient mesh.
  - Thesis: a bowtie data-flow diagram (Snowflake, SAP, Salesforce → forecast → Slack, SAP order, CFO report).
  - Services: a forecast chart, an automation run log and a migration board.
  - Industries: an integrations hub using real vendor marks.
  - Process: a 12-week gantt.
  - Security: an audit log.
  - Booking: a "what happens next" plan.
- **Signature moments:**
  1. **Hero entrance:** words rise once, and the console's single timed loop runs.
  2. **The demo band** opens with an iris and has three click-driven views:
     - Pipeline: run it and watch the sources flow through ingest, validate, features and forecast.
     - Automation: an agent waits for your Approve or Reject.
     - Value estimate: your four inputs, our published formula. The defaults give $202,708 a year.

  Nothing else animates on scroll.
- **Copy:** 774 words. Headings are noun phrases that name the thing. Buttons are verb + object. There are no
  banned words (revolutionize, unlock, synergy), no exclamation marks, no invented numbers or logos, and the
  email address is never printed.

## 4. Validation

### taste-skill gate (desktop 1440 + phone 390; layout check at 1440, 1024, 820, 768 and 390)
- **Build 1: `GATE: PASS` in round 3.** Rounds 1–2 found phone section-height, neighbour and sparse issues, plus
  section gaps from padded two-screen sections. Fixes:
  - phone sections sized to their content;
  - visual panels sized to their windows;
  - the tablet services panels trimmed.
- **After the pass,** the impeccable and review-animations findings below changed the palette, one transition,
  the footer leading, the tab hover and two headings. A new build re-checked that code:
  - Round 1 flagged two headings that did not name the category; both were fixed. The thesis heading became
    "Where AI and analytics projects stall", and the FAQ question became "…Can we start in week 1?".
  - Round 2 flagged the `<title>` not matching the h1. It became "DESICIA: Enterprise AI, data analytics and
    automation".
  - Round 3 ended **`GATE: OPEN 1`** (rounds used up).
- **The one open FAIL is a checker artefact, verified on the crop:**

  | Check | Target | Why it is false |
  |---|---|---|
  | contrast (390) | `div.dg-node.dg-node--core-pill > span.dg-label` "DESICIA" | The label is light text on its own dark gradient pill (about 17:1). At that scroll stop the fixed mobile "Book a call" bar covers the pill. The checker's ground lookup skips fixed layers, but its text-hidden screenshot does not, so it compares white text with the bar's paper (1.1:1). The same artefact caused build 1's gantt-name "2.7:1" (ink over the bar's green button). |

  The waiver is in `site/.taste-skill/waivers.json`. It was not applied in the last round because its first
  target string carried a trailing " [390]" that the gate does not print. The target has since been corrected,
  but no round was left to re-run.
- Outside the gate, after all changes:
  - layout check: no findings at all 5 sizes;
  - consistency: 0 FAIL apart from the artefact above;
  - copy-lint: 0 FAIL, 0 WARN.
- **WARNs left by choice (not blocking):**
  - "Book a call" appears in both the nav and the hero. This is a standard pattern; the nav button is the
    persistent route.
  - The FAQ is text-only. Questions are words, and a picture would be decoration.
  - 4 flat grounds, because the sage footer is the dealt footer-statement.
  - The hero→thesis gap is tighter than the median, because the hero's visual bleeds to its bottom edge.
  - The selected demo tab uses its own fill.
  - FAQ h3 size and copy density (115 words over one screen).
  - Phone fade-cuts and the services/demo band edge. These are the same fixed-bar artefact (lines under the
    action bar) or 17px stage padding inside the dark band.
  - The services section is over 1.5 screens on phones with no CTA. A "Try the value estimate" link was added,
    tested and removed, because it caused two FAILs (a scroll-started colour transition and a third button
    style).

### open-design review-animations
| Before | After | Why |
|---|---|---|
| `.step { transition: box-shadow 200ms }` (desicia.css:168) | no transition; the state snaps, and the spinner already signals the run | `box-shadow` is not GPU-composited, and the step state changes 4 times a run |
| `.demo .tab:hover` set light text on the selected tab's light fill | `.demo .tab:not([aria-selected="true"]):hover` | hover made the selected label 1.4:1 (found by impeccable; motion-adjacent state styling) |

Kept, with reasons:
- `d-spin` (1 s linear) is a loading indicator, and linear is right for rotation.
- `d-sweep` (520 ms) is explanatory motion showing data moving between pipeline steps. It plays once per click and
  is not a UI response.
- `d-in` (280 ms, ease-out curve `cubic-bezier(.22,1,.36,1)`) plays when the agent's result appears after
  Approve or Reject.
- The value bars (240 ms) use a transform and retarget mid-flight while a slider is dragged.
- All hovers are gated by `(hover: hover) and (pointer: fine)`.
- Under `prefers-reduced-motion`, the spinner, sweep and entry animations stop, transitions are removed, the
  demo's step delays become 0, and smooth scroll becomes instant.
- The hero entrance fires once (an `m-enter` mark with a 700 ms safety). The kit diagrams hold a still frame on
  phones and under reduced motion, and their scroll colour transitions are disabled in page CSS.

**Verdict: Approve** after the two fixes above.

### impeccable detect + polish audit
- **Rendered page scans** (home at 1280×800 and 390×844; privacy, terms and 404): **0 anti-patterns** after the
  fixes:
  - cream palette → green-tinted neutrals;
  - tab-hover contrast;
  - 11.5px source labels → 12px;
  - footer statement leading 1.25 → 1.3;
  - legal measure 64ch → 58ch.
- **Static scan leftovers** don't exist on the rendered page:
  - `.ly-live` pulse and a radial halo come from unused kit CSS;
  - "cramped padding" on rows and sections that do have padding once styles are resolved.
- **Advisory "nested cards"** (product windows on a tinted stage in services, security and booking): this is a
  judgment call. The inner element is product UI shown in a frame (a screenshot pattern), not a content card in a
  card, and nesting never goes past 2 levels (taste-skill's own nesting check passes). If you want this read
  strictly against the "no cards inside cards" rule, the fix is to drop the stage's tint and border and let the
  windows sit on the page.
- Advisory "repeating stripes": the gantt's "Operate" bar is striped to mean "ongoing", not decoration.

## 5. Run it locally

```bash
cd projects/desicia/site
node server.mjs            # or: npm start   →  http://localhost:8080
npm test                   # contact endpoint checks
```

- Node 18.17 or later. There are no required dependencies. `nodemailer` is optional and used only when SMTP is
  configured.
- **Contact flow:** the form posts to `POST /api/contact`. Validation, a honeypot, rate limiting and a size limit
  are in `server.mjs`.
  - Every request is appended to `data/requests.jsonl`.
  - With `SMTP_HOST` set (see `.env.example`: CONTACT_TO, CONTACT_FROM, SMTP_HOST/PORT/SECURE/USER/PASS) the
    request is also emailed.
  - Set `CONTACT_TO` to the real inbox before launch. `hello@desicia.example` is a placeholder.
- **Security headers:** a strict CSP (self only, fonts self-hosted).
- **SEO:** title and description, Open Graph with `share.png` (1200×630), JSON-LD ProfessionalService, `robots.txt`,
  plus privacy, terms and 404 pages.
- **Before launch:**
  - confirm the `data-assumed` terms;
  - add real logos and case studies when they exist;
  - set the canonical domain;
  - optionally delete the unused kit folders `assets/photos`, `assets/objects` and `assets/scenes` (about 21 MB;
    nothing on the page loads them).

## 6. Change log

### 27 Nov 2026: whole hero console, Microsoft Fabric and Dynamics 365

- **Hero console fully visible.** The kit's centred hero faded its window out from 82% of the frame and pinned the
  console absolutely, so the console's last rows (the PO proposal and its Approve / Edit actions) were cut off.
  `css/desicia.css` now puts the console in the flow on its lit stage, with no mask and no clipping, and tightens
  the hero's spacing so the words, buttons and the whole console end above the fold. There is also a short-screen
  step at heights of 860px or less. On screens that are still too short (1366×768: 0.88, 1024×768: 0.97),
  `js/demo.js` zooms the console just enough to fit, never below 0.75. Below that floor (1280×720 runs 7px over,
  375×667 phones run 79px over) the hero grows and the console stays whole. The console is marked `.ui`, a drawn
  mock, the same as the service mocks.
- **Integrations:** the hub in "Industries and integrations" now shows **Microsoft Fabric** and **Dynamics 365**
  (10 spokes). Dynamics 365 is also named in the automation card ("write back to SAP, Dynamics 365, Salesforce or
  ServiceNow").
  - The marks are official Microsoft icons under MIT, added by hand because the kit's logo sets have none:
    - `assets/icons/microsoft-fabric.svg` is from npm `@fabric-msft/svg-icons@12.0.0`;
    - `assets/icons/dynamics-365.svg` is from `microsoft/Microsoft-AI-Decision-Framework`.
  - Both are credited in `icons-credits.json`. They are trademarks of Microsoft and are used only to name a
    supported system.
  - The hub now starts below its panel title, so the top tiles no longer sit on the words at 1024.
- **Validation after the change:**
  - taste gate **PASS** in round 1 of a new build (the 390 core-pill contrast waiver applied; 16 WARN);
  - layout check clean at 1440, 1024, 820, 768 and 390;
  - consistency `--quick` at 1440/390 has no FAILs other than the waived artefact;
  - copy-lint 0 FAIL / 0 WARN (776 words);
  - impeccable URL scans clean at 1440 and 390;
  - `npm test` passes.
  - No motion was added (the zoom is static), so the review-animations verdict stands.
