# DECISIA website: build report

Branch `arena/d954650d-desicia`. Site at the repo root (moved from `projects/desicia/site/` on 27 Nov 2026 for Vercel). Supporting documents: `BRIEF.md`,
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

**DECISIA: enterprise AI, from data to action.** One team builds the forecasts, the automations and the process
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
- **Type:** Instrument Serif for the display heads and wordmark (400, italic on the h1's emphasis), Inter for text and
  UI, and JetBrains Mono with tabular figures for system data (the client's spec, see the change log). All are self-hosted woff2 with OFL licences, so there are no third-party font
  calls. (The first build used Schibsted Grotesk throughout; the client found it too generic, see the change log.)
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
  - Round 2 flagged the `<title>` not matching the h1. It became "DECISIA: Enterprise AI, data analytics and
    automation".
  - Round 3 ended **`GATE: OPEN 1`** (rounds used up).
- **The one open FAIL is a checker artefact, verified on the crop:**

  | Check | Target | Why it is false |
  |---|---|---|
  | contrast (390) | `div.dg-node.dg-node--core-pill > span.dg-label` "DECISIA" | The label is light text on its own dark gradient pill (about 17:1). At that scroll stop the fixed mobile "Book a call" bar covers the pill. The checker's ground lookup skips fixed layers, but its text-hidden screenshot does not, so it compares white text with the bar's paper (1.1:1). The same artefact caused build 1's gantt-name "2.7:1" (ink over the bar's green button). |

  The waiver is in `.taste-skill/waivers.json`. It was not applied in the last round because its first
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
| `.step { transition: box-shadow 200ms }` (decisia.css:168) | no transition; the state snaps, and the spinner already signals the run | `box-shadow` is not GPU-composited, and the step state changes 4 times a run |
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

## 5. Run it locally and deploy

```bash
node server.mjs            # or: npm start   →  http://localhost:8080
npm test                   # contact endpoint checks
```

**Vercel:** import the GitHub repo and deploy with the defaults (Framework Preset "Other", no build command, root
directory `./`). `vercel.json` sets the security headers and caching; `.vercelignore` keeps the studio tooling, the
notes and the unused kit media out of the upload. In Project Settings → Environment Variables set `CONTACT_TO`,
`CONTACT_FROM` and `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` so requests are emailed.

- Node 20 or later. There are no required dependencies. `nodemailer` is optional and used only when SMTP is
  configured.
- **Contact flow:** the form posts to `POST /api/contact`. Validation, a honeypot, rate limiting and a size limit
  are in `api/_lib/contact.mjs`, shared by the Vercel function `api/contact.js` and the local `server.mjs`.
  - Locally every request is appended to `data/requests.jsonl`; on Vercel (read-only disk) it is written to the
    function log.
  - With `SMTP_HOST` set (see `.env.example`: CONTACT_TO, CONTACT_FROM, SMTP_HOST/PORT/SECURE/USER/PASS) the
    request is also emailed.
  - Set `CONTACT_TO` to the real inbox before launch. `hello@decisia.example` is a placeholder.
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
  `css/decisia.css` now puts the console in the flow on its lit stage, with no mask and no clipping, and tightens
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

### 27 Nov 2026: professional type, site moved to the repo root for Vercel

- **Type:** the single grotesk (Schibsted Grotesk) read as generic. Headings are now **Source Serif 4** (weight 500,
  optical sizes, tracking −2 %), and body and UI are **Libre Franklin**. JetBrains Mono stays for figures inside the
  mocks. All are self-hosted from `@fontsource-variable` (OFL licences in `fonts/`). Follow-ups for the wider face:
  - the hero lead is capped at 31em (about 65 characters);
  - the console's signal list is 292px, so no row truncates;
  - the phone integrations hub is 320px tall, so the section stays within 1.5 screens.
- **Repo layout:** the website moved from `projects/desicia/site/` to the repo root (`git mv`, so history is kept), so
  Vercel deploys it with no Root Directory setting. The notes stay in `projects/decisia/`.
  - **Contact endpoint on Vercel:** the contact logic moved to `api/_lib/contact.mjs` (Web Request/Response). It is
    served by the Vercel function `api/contact.js` and by `server.mjs` locally.
  - **Deploy config:** `vercel.json` sets the headers and caching; `.vercelignore` limits the upload to the site.
  - **Local server:** it now also refuses to serve the tooling, notes, `api/` and tests.
- **Validation:**
  - taste gate **PASS** in round 1 of a new build, with no open FAIL and no waiver needed;
  - layout check clean at 1440, 1024, 820, 768 and 390;
  - consistency `--quick` 0 FAIL at 1440 and 390;
  - copy-lint 0/0;
  - impeccable URL scans clean on the home page (1440, 390) and privacy;
  - `npm test` passes, covering both the local server and the Vercel function, plus the hidden paths.
  - No motion changed.

### 27 Nov 2026: DECISIA, editorial type, Azure first, continuous motion

- **Name:** the brand is **DECISIA** (it was misspelt DESICIA). Renamed everywhere: page text, titles and meta, the
  wordmark, diagram labels and alt text, code comments, `package.json` (`decisia-site`), the contact defaults
  (`hello@decisia.example`), tests, docs, `css/decisia.css` and `projects/decisia/`. `share.png` was re-shot from the new
  hero. The GitHub repository itself is still named `Desicia` (rename it on GitHub if wanted; links redirect).
- **Type (client spec):** `--font-serif` Instrument Serif 400 + italic, `--font-sans` Inter 400 to 600, `--font-mono`
  JetBrains Mono 400/500 with `tabular-nums`, defined at the root in `css/fonts.css`. Hero h1 `clamp(3.25rem, 6vw,
  5.25rem)` / 1.04 / −0.025em with "from data to action" in italic; h2 `clamp(2.25rem, 4vw, 3.5rem)` / 1.08 / −0.02em;
  uppercase wordmark +0.06em; h3/h4 and every card title or label Inter 600 / −0.015em / 1.3; body 1.6, antialiased.
  Mono on the console, demo workspace, W1 to W12, metrics (value figures now mono 500), SKUs, timestamps, the audit log.
  Self-hosted from Fontsource (the same files as Google Fonts; the CSP allows fonts from 'self' only, and `next/font`
  does not apply to a static site). Source Serif 4 and Libre Franklin files removed.
  - Follow-ups for the new metrics: the phone booking screen stays within 1.5 screens (plan panel sized to its
    card, 12 px form gaps, the plan's last row shortened); two service descriptions shortened to two lines so the
    services section stays under 1.5 screens at 1024 and 768; demo step notes shortened so none wraps.
- **Azure first:** hero lead and meta ("on Microsoft Azure"); console bar `Azure · SAP`; bowtie now Fabric, SAP,
  Dynamics 365 → Azure forecast → Teams, SAP, Power BI; services name Azure Machine Learning, Fabric, Power BI and
  Azure OpenAI; demo sources Microsoft Fabric and Azure Event Hubs, region Azure West Europe; hub leads with Azure,
  Fabric, Power BI, Dynamics 365, Teams (PostgreSQL and Slack dropped); method "In your Azure tenant"; FAQ answer
  "Azure OpenAI in your own tenant by default"; security row "Your Azure tenant" (Entra ID, Key Vault, your region)
  and Azure Monitor for the audit log; audit chips `Azure West Europe` / `Entra ID · 4 roles`. New marks:
  `assets/icons/azure.svg` and `power-bi.svg` (gilbarbara/logos, CC0, credited in `icons-credits.json`).
- **Continuous motion (client: the flows stopped mid-way):** the bowtie lost its `data-ui-cycles="2"` cap and the
  hub its `"pulse": "none"`, so both loop for as long as they are on screen, phones included (`data-dg-phone="loop"`).
  The hero console also loops on phones (`phoneConsole` in `js/demo.js`, the kit's `ui.loop`, with its pause button).
  The demo connectors carry a continuous packet stream (`d-stream`), which a pipeline run takes over and hands back.
  Checked in Chrome: bowtie, hub and console were still cycling after 19 s at 1440 and 390.
- **review-animations** (open-design, ten standards) on the new motion:

  | Before | After | Why |
  |---|---|---|
  | `.dw.is-live .dw__spin { animation: d-spin 1s linear infinite }` (spins after the answer is posted) | spins only while the tool step is the latest (`.dw__tool:has(+ .is-off)`); full green ring once done | motion must indicate state; a spinner beside a finished answer says "still working" |
  | demo stream: autoplay with no control | `button.dwin__pause` in the workspace bar (`aria-pressed`, label swaps), `animation-play-state: paused`; hidden on phones, where the connectors are hidden | WCAG 2.2.2: automatic motion over 5 s needs a pause |
  | `.is-flow` left on the connectors after a run | removed 520 ms after the run, so the stream resumes | otherwise the run's sweep would end the continuous flow |

  Kept, with reasons: `d-stream` is explanatory (data moving between systems), transform only, 2.4 s linear (constant
  speed reads as flow; linear is right for a conveyor, not for UI response), staggered 300 ms, runs only while on
  screen (`.is-live` via IntersectionObserver) and is off under reduced motion. The diagram and console loops are the
  kit's, each with a pause button and off-screen pausing. **Verdict: Approve.**
- **Validation:**
  - taste gate **PASS** on a fresh build (round 1 of the final build; no open FAIL, no waiver applied);
  - layout check clean at 1440, 1024, 820, 768 and 390;
  - consistency `--quick` 0 FAIL at 1440 and 390;
  - copy-lint 0 FAIL / 0 WARN (795 words);
  - `npm test` passes;
  - impeccable (1440, 390): **2 findings, both from the client's type spec and kept on purpose**: `overused-font`
    (Inter as the primary face) and `italic-serif-display` (the italic serif in the hero h1; impeccable notes that
    an editorial register may want it). Change either by swapping `--font-sans` or removing the `<em>` in the h1.

