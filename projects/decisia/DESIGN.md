# Design system — DECISIA

> Phase 3. Colour by impeccable `colorize` (Persuade mode: colour may own regions; roles, not swatches), type by
> impeccable `typeset` + taste `start.mjs types`, mechanics by taste `system.md` / `layout-v4.md`, floor by
> impeccable `craft-floor`. Tokens live in `index.html` (repo root) `:root` (taste `start.mjs brand` output) and the page
> CSS block that maps the extra roles.

## World
**Paper, ink and a ledger green.** The use scene is an executive reading on a laptop in daylight, then forwarding
the link to a CTO: so a light page tinted toward the brand green (not dark-by-category), with one dark band where the working system runs.
Every picture is the system itself: consoles, run logs, pipelines, audit logs, diagrams with real tool marks.
No stock, no abstract AI art. One shader accent (gradient mesh, rendered once and held still) sits behind the hero
console as its lit ground.

## Colour strategy (colorize)
- Temperature: neutrals tinted toward the brand hue (green, h 135–150, chroma ≤ 0.016), one deep green accent.
  Dominant relationship: ink on paper, 90–95 % neutral. Revised after the impeccable detect pass flagged the first
  warm cream ground (#f9f6f1) as the reflexive "tasteful" default and as off-brand next to a green accent.
- Competitor gap (research/COMPETITORS.md palette map): blue, violet, black and navy+electric blue are taken. Green
  reads as "approved / running / within limits", which is exactly what the product's states mean.
- Accent placement: the primary button (only filled accent), focus ring, links, live/OK states inside UI, the
  approval action, the data pulse. Nowhere decorative.
- No violet anywhere (taste rule: hue 270–330 banned); no purple-blue gradient (brief).

| Role | Token | OKLCH | Hex | Contrast |
|---|---|---|---|---|
| Canvas | `--p-bg` | oklch(0.975 0.007 135) | #f5f8f3 | — |
| Raised surface / alt ground | `--p-surface` | oklch(0.947 0.010 135) | #ebefe8 | — |
| Ink (text, hairlines at 12–15 %) | `--p-ink` | oklch(0.205 0.014 150) | #131914 | 16.7:1 on canvas |
| Secondary text (tinted, never grey) | `--p-muted` | oklch(0.435 0.014 150) | #4c534d | 7.4:1 canvas, 6.8:1 surface |
| Action / accent (emerald ledger) | `--p-accent`, `--p-action` | oklch(0.47 0.115 158) | #006d41 | 6.0:1 on canvas; paper on it 6.4:1 |
| Accent wash (selected rows) | `--d-accent-wash` | oklch(0.93 0.04 158) | #d3f1de | ink 14:1 |
| Dark band ground | `--d-dark` | oklch(0.2 0.016 160) | #101814 | — |
| Dark band text | `--d-dark-ink` | oklch(0.955 0.007 135) | #eef1ed | 14.5:1 |
| Dark band secondary | `--d-dark-muted` | oklch(0.78 0.012 150) | #b3bcb5 | 7.5:1 on #1f2b25 |
| Signal green (on dark: live, pass, pulse) | `--d-signal` | oklch(0.78 0.15 158) | #50d492 | 9.6:1 on dark |
| Warning (UI state only) | `--d-warn` | oklch(0.62 0.14 60) | #c26e12 | 3.5:1 (icons/large only) |
| Error (form errors) | `--d-err` | oklch(0.52 0.17 28) | #b6322b | 5.6:1 |
| Secondary button / selected tab | — | oklch(0.84 0.017 135) | #c6cdc2 | 1.5:1 off canvas; ink on it 11.8:1 |

Light/dark polarity: the page is light; the demo section is the one inverse band (`.ground-inverse` remapped to the
green-black above, with its own elevation steps: band #101814 → window #17211c → raised #1f2b25 → hairline 9 %
paper). Dark UI windows sit only on light grounds (hero, services); on the dark band the window steps lighter.

## Type (typeset)
Three root tokens, defined in `css/fonts.css` (`:root`), mapped onto the kit's `--font-display` / `--font-text` in each
page's `:root`, so light sections and the dark `#demo` band share one hierarchy. All self-hosted woff2 from Fontsource
(SIL OFL, licences in `fonts/`): the same files Google Fonts serves, without a third-party request (CSP `font-src 'self'`).
- `--font-serif` **Instrument Serif** 400, roman and italic: the editorial display face for the h1, the section h2s and
  the wordmark. High contrast and condensed, so it reads as a firm's report, not a startup template.
- `--font-sans` **Inter** 400 / 500 / 600 (variable): body, subtitles, navigation, buttons, h3/h4, card titles, labels.
- `--font-mono` **JetBrains Mono** 400 / 500 with `font-variant-numeric: tabular-nums`: everything a reader compares or
  scans: the operations console, the demo workspace, the Gantt weeks W1 to W12, metrics, SKUs, timestamps, the audit log.
- Scale:

  | Role | Face | Size | Line height | Tracking |
  |---|---|---|---|---|
  | Hero h1 | serif 400 (italic on "from data to action") | `clamp(3.25rem, 6vw, 5.25rem)` (52 to 84 px) | 1.04 | −0.025em |
  | Section h2 | serif 400 | `clamp(2.25rem, 4vw, 3.5rem)` (36 to 56 px) | 1.08 | −0.02em |
  | Wordmark | serif 400, uppercase | 22 px (20 phone) | 1 | +0.06em |
  | h3/h4, card titles, feature labels | sans 600 | 18 px (FAQ 18) | 1.3 | −0.015em |
  | Body, subtitles | sans 400 | 16 / lead 18 px | 1.6 | 0 |
  | Nav links, buttons, tabs | sans 500 | 15 to 16 px | 1 | −0.005em |
  | Data | mono 400 / 500, `tnum` | 11 to 14 px (value figures 36 px at 500) | 1.4 | 0 |

- `-webkit-font-smoothing: antialiased` on the root; `text-wrap: balance` on headings, `pretty` on body; measure ≤ 62 ch.
- impeccable flags Inter (reflex face) and the italic serif h1 (common AI-startup hero). Both are the client's stated
  type spec (27 Nov 2026), kept on purpose and reported in REPORT.md.

## Space, grid, radius
- Spacing scale 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 (`--s-1`…`--s-10`).
- 12-column grid, 24 px gutter (12 on phone), wrap 1280 with 80 px gutters; split line at column 7 (x 732).
- Every section exactly one screen (taste layout-v4), h2 at 120 px from the section top.
- Radius `sharp` (4 / 6 / 8): data and finance tooling; windows 10 px with a 1 px line.
- Buttons `tonal` look, 44 px; one filled primary per view.

## Components and assets (all code-drawn)
- Hero: centred h1 over the operations console window (timed loop: signal → reading → proposal → approval).
- Diagrams (taste `diagram.js`): bowtie (thesis), hub (industries) with real tool marks via `icons.mjs`.
- Custom UI: forecast chart (SVG), automation run log, migration board, pipeline graph with animated packets,
  approval card, ROI calculator, 12-week Gantt, audit log.
- Shader accent: `gradient-mesh` behind the hero console, `speed: 0` (drawn once, held).

## Motion (taste motion.md + open-design ui-animation / review-animations)
1. Hero entrance: h1 rises line by line, lead/buttons fade up 12 px, console settles from .98 — once, ~1.1 s.
2. Signature moment A: the hero console loop with a pause control; its tool spinner turns only while that step is the
   one being worked on, then shows a full ring.
3. Signature moment B: the demo's data-to-automation flow. While the workspace is on screen a packet runs down every
   connector without end (`d-stream`, 2.4 s linear, staggered left to right, transform only; its own pause button in
   the workspace bar). "Run pipeline" takes the connectors over with its sweep, the steps tick, the forecast lands,
   then the stream resumes. The automation run waits for the visitor's Approve.
3b. Continuous loops (client, 27 Nov 2026: "flows must not stop mid-way"): the thesis bowtie and the industries hub loop
   without a cycle cap (`data-ui-cycles` removed, the hub's `pulse: none` removed) and keep looping on phones
   (`data-dg-phone="loop"`); the hero console loops on phones too (`js/demo.js` `phoneConsole`, the kit's `ui.loop`). Every loop
   pauses off screen and has a pause button.
4. Section transition: `iris-opens` on the dark demo band (dealt), scrubbed, still on phones / reduced motion.
5. Micro: kit hover layer gated to `(hover: hover) and (pointer: fine)`; press 100–160 ms; tab indicator.
- Easing `cubic-bezier(.22,1,.36,1)`; UI ≤ 300 ms; transform/opacity only; reserved sizes → zero CLS;
  `prefers-reduced-motion`: every loop, flow and moment shows its finished state.
