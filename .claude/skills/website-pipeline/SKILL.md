---
name: website-pipeline
description: >-
  The house process for every website, landing page or company page built in this repo. Runs
  seven phases in order: a clarity gate (no build until every brief question is answered), deep
  competitor research on the live web, open-design skill routing for each part of the page,
  impeccable for colour, type and the design world, the build, taste-skill as the validation gate,
  and an evidence report. Use it whenever the user asks to design, build, redesign or ship a
  website, landing page, marketing page or company page.
---

# Website pipeline

Three packs, one job each:

| Pack | Location | Job in this pipeline |
|---|---|---|
| **open-design** | router `.claude/skills/opendesign`, library `skills-library/open-design` | find the right specialist skill for **each part** of the page (research, copy, sections, motion, imagery …) and a reference design system |
| **impeccable** | `.claude/skills/impeccable` | **colour selection**, type, the visual world (`PRODUCT.md`, `DESIGN.md`), critique and audit |
| **taste-skill** | `.claude/skills/design-taste-frontend` | **validation**: copy-lint, consistency checker, layout check, perf, and the finish gate that must read `GATE: PASS` |

Precedence when they disagree: **the brief > taste-skill house rules > impeccable > open-design**.

Each project lives in `projects/<slug>/`. Copy `templates/*.md` into it at the start.

---

## Phase 0 — Clarity gate (no code until this passes)

Fill `projects/<slug>/BRIEF.md` from the template. Every line in its **Clarity checklist** must be
answered by the user, found in their material, or explicitly marked `assumed` with the user's OK.
Ask in **one batch** of at most four questions at a time (multiple choice with a free-text
option), never drip-feed. Things to pin down:

- The company: name, what exactly is sold, price band, where it operates, what makes it different.
- The buyer: who decides, who uses, the top three objections, the one main action (Book a call,
  Start a trial, Get a quote …).
- Proof that really exists: logos, numbers, testimonials, certifications, case studies. **Nothing is
  invented**; missing proof becomes a slot the client fills, not a fake.
- Brand constraints: existing logo, colours, fonts, tone words, banned words, languages.
- Scope: one long page or several, sections required, forms and where they send, stack and hosting.
- Named competitors and sites the user admires or hates.

Clarity score = answered lines ÷ total lines. Do not leave Phase 0 below 100 %. Re-check after
Phase 1: research usually raises new questions (positioning gaps, pricing norms); ask them before
building.

## Phase 1 — Competitor research (live web, deep)

Goal: know the category better than the client's competitors do. Write
`projects/<slug>/research/COMPETITORS.md` from the template.

1. **Find 6–10 sites**: 3–5 direct competitors (same offer, same market), 2–3 category leaders
   (best in class anywhere in the world), 1–2 adjacent players the buyer also compares against.
   Use web search with several phrasings (`<service> <city>`, `best <service> company`,
   `<service> pricing`, `<competitor> alternatives`), review sites and directories.
2. **Read each site properly**, not just the homepage: home, pricing or packages, one service page,
   about, contact or booking. For every site record:
   positioning line and h1 · offer structure and prices · main action and how many clicks to it ·
   proof used (logos, numbers, reviews) · section order · visual system (palette hexes, type faces,
   radius, photo style) · motion · mobile behaviour · what is weak or missing.
   Methods from open-design: search `find.mjs "competitor research"`, `"brand extract"`,
   `"web clone"` (analysis only) and `"research decision"`; read their method, use your tools.
3. **Synthesise**: a comparison matrix, the category's clichés (what everyone does, so we avoid it),
   the white space (what nobody says or shows), the buyer's real objections, pricing norms, and a
   **palette map** of competitor colours so Phase 3 can pick something that stands apart.
4. **Do-not-copy list**: signature phrases, effects and layouts that belong to a competitor.

Exit when: every competitor row is complete, the white space is written as one positioning
sentence the client agrees with, and open questions are back through the clarity gate.

## Phase 2 — open-design skill routing (one search per job)

For each job below run `node .claude/skills/opendesign/find.mjs "<job>"`, read the best hit, and
record the pick in `projects/<slug>/SKILL-ROUTING.md` (job → skill → why → what you will take
from it). Typical jobs:

strategy and positioning · information architecture and section order · page template · reference
design system (`--kind design-system`) · headline and body copy · conversion psychology · hero ·
services/features · social proof · pricing · FAQ · forms and lead capture · icons · photography and
imagery · motion and scroll · 3D or shader (tech brands only) · accessibility · SEO and metadata ·
design review.

Always also read these craft rules: `anti-ai-slop`, `color`, `typography`, `accessibility-baseline`,
`laws-of-ux` (`find.mjs "<name>" --kind craft`).

## Phase 3 — Colour, type and the world (impeccable)

1. Run impeccable's setup (`.claude/skills/impeccable/SKILL.md`, Setup). If its launcher cannot
   download its engine, say so once and read the reference files directly.
2. `init` → write `projects/<slug>/PRODUCT.md` from BRIEF.md and the research (do not re-ask what is
   already answered).
3. Read `reference/new-work.md` and `reference/new-work-world.md`; choose the mode (a company page
   is **Persuade**) and the world.
4. **Colour** with `reference/colorize.md`: pick the colour strategy and an OKLCH palette (ground,
   ink, surface, muted, one accent, states) that fits the trade and **stands apart from the
   competitor palette map**. Cross-check with open-design `color-expert` and craft `color`. Verify
   every text pair ≥ 4.5:1 (large text ≥ 3:1). No violet or lavender (taste-skill rule).
5. **Type** with `reference/typeset.md`: one display face and one text face, loaded properly, never
   the overused defaults impeccable flags (Inter, Roboto, Geist, Space Grotesk, Plus Jakarta Sans,
   Fraunces) unless the brand already owns one.
6. Write `projects/<slug>/DESIGN.md` (impeccable `document` format) with the tokens and the reasons.
7. Hand the colours to taste-skill's kit with
   `node .claude/skills/design-taste-frontend/scripts/start.mjs brand --page <kind> --bg … --ink … --accent … --surface … --muted … --type <id> --radius <r>`
   so the build uses impeccable's palette inside taste-skill's system.

## Phase 4 — Build

Follow taste-skill's run (`SKILL.md` section 4) for structure, kit, sections and motion, with these
substitutions: the palette comes from Phase 3 (`start.mjs brand`, not `start.mjs deal`), section
choices come from the Phase 2 routing, and copy follows the Phase 1 positioning sentence.

- Read impeccable `reference/craft-floor.md` immediately before the first UI edit.
- Arm the gate before the page exists: `gate.mjs --start index.html --kind … --category … --primary …`.
- Write all copy first; every claim traceable to BRIEF.md or marked `data-assumed`.
- Real photographs (client's, else licensed stand-ins listed in the report); real icons.
- Static HTML/CSS by default in `projects/<slug>/site/`; a framework only when the brief asks.

## Phase 5 — Validation (taste-skill is the gate)

No browser on the machine? `source <(./scripts/setup-chrome.sh)` first.

```bash
S=.claude/skills/design-taste-frontend
node $S/scripts/copy-lint.mjs index.html --kind <kind>
node $S/scripts/consistency.mjs index.html --widths 1440,1024,820,768,390 --rhythm-widths 1440,820,768,390 --profile .taste-skill/chrome-check --page <kind> --category "<what is sold>" --primary "<main action>"
node $S/assets/layout/check.mjs --url index.html --profile .taste-skill/chrome-check --sizes 1440x900,1024x768,820x1180,768x1024,390x844 --shots shots/layout
node $S/scripts/perf.mjs index.html --profile .taste-skill/chrome-check
node $S/scripts/gate.mjs index.html            # must end in GATE: PASS
npx -y impeccable detect index.html            # impeccable's 60+ deterministic slop rules: 0 findings or waived with reason
```

Then impeccable `critique` (scored UX review) and `audit` (a11y, perf, responsive, P0–P3) on the
built page, and look at every screenshot at 1440, 1024, 768 and 390 yourself. Fix, re-run, repeat
(taste-skill allows three gate rounds). Waivers go in `.taste-skill/waivers.json` with a reason;
never game a check or edit the kit.

## Phase 6 — Report

Write `projects/<slug>/REPORT.md`: the `GATE:` line, impeccable detect result, critique and audit
scores, the positioning sentence and how the page delivers it, palette and type with reasons and
contrast numbers, the skill routing table, every assumed fact, every stand-in photograph and client
slot still to fill, and what could not be checked.
