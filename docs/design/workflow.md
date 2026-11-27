# Company page: brief → narrative → validation → build → audit

This workflow implements the requested four-part stack. It is ready for an upcoming company brief; it does not assert that an unspecified company page has already been designed.

## 1. Establish the business case

Copy `templates/design/company-brief.md` to `docs/design/company-brief.md`. Ask for missing essentials in one compact batch. Separate verified facts, client-supplied claims, assumptions and unknowns. The minimum to start is the company name, service, buyer and desired action; determine brand/assets and proof before finalizing the page.

Set a measurable goal such as qualified consultation requests, not “millions of clients.” Record the primary CTA, its destination and what counts as a conversion. Analytics require the client's consent/privacy decisions; do not add trackers silently.

## 2. Plan an end-to-end story (Kage + MengTo)

Read `kage-study.md`, the installed `landing-page` skill and `no-ai-design-slop` skill. Use `templates/design/page-plan.md` to create `docs/design/page-plan.md`.

Write a one-sentence visual thesis and the copy argument before coding. For each chapter, record the buyer question, evidence, focal visual, transition, CTA and mobile behavior. Every section should earn its place; do not invent proof to fill a template slot. Choose original brand imagery and keep an asset/provenance list.

Decide whether the company needs a simple native document, a motion-led editorial treatment or a true spatial world. Default service businesses to native scrolling, photography/work samples and quiet interactions. Animation is an explanatory tool, not the offer.

## 3. Explore and validate page shape (Open Design)

Read `frontend-design`, relevant files in `third_party/open-design/craft/`, and at least two relevant template candidates. The installed set covers cinematic studios, software landing pages and typographic/editorial one-pagers. If none fits, use a custom composition guided by Open Design; do not force a choice.

1. Copy `templates/design/design-system.md` to root `DESIGN.md` and fill it from the real brief. It is the project's brand contract.
2. Copy `templates/design/template-validation.md` to `docs/design/template-validation.md`.
3. Compare candidates for business fit, narrative completeness, asset availability, mobile behavior, accessibility, conversion friction and implementation cost. Identify what to retain, replace or omit.
4. Build a small, company-specific prototype of the selected page shape (at least hero, a representative middle chapter and closing action). Read the full template source and its checklist, not just a thumbnail.
5. Render desktop and phone prototypes. Capture evidence, inspect text/crops/controls/continuity, and revise the chosen composition before expanding the full page.
6. If the full Open Design app is available, use its workspace for this exploration and critique, exporting the chosen artifact back into the project. Otherwise use the installed resources directly and explicitly label the review **resource-based**, not “validated in the Open Design app.”

A template is a hypothesis. Template fit is a reasoned design decision, not an automated certification or a guaranteed conversion result. `critique` provides a useful evidence-backed second opinion.

## 4. Implement a complete page

Use the existing framework when there is one; this repository currently has no app stack. Select a minimal stack after the brief. Build real sections, content, responsive layouts and interactions—not a hero mockup. Keep third-party skill libraries outside the production web root/bundle.

- One clear h1; semantic landmarks and heading hierarchy; meaningful alt text; skip link; visible focus; labelled fields and errors; sufficient contrast and touch targets.
- Navigation and CTA destinations work, including deep links and fixed-header offsets. A phone menu supports keyboard focus and Escape when applicable.
- Real form delivery needs a selected endpoint/provider and privacy handling. Implement pending, success and error states. Never show a fake success for an unsent lead.
- Use approved claims and legitimate media. Omit unavailable testimonials/client logos rather than fake them. Draft assumptions are documented, not shipped as facts.
- Content and actions remain available without animation. Test reduced motion, touch, slow images, missing assets and WebGL failure if used. Avoid scroll traps and forced viewport heights that clip text or translation.
- Use consistent tokens, deliberate whitespace, clear type hierarchy and varied content-led composition. Prefer one memorable brand idea over many unrelated effects.
- Optimize responsive images/fonts, defer noncritical code, reserve media dimensions, and pause/dispose animation work. Performance targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile **in field data**. Lab runs are diagnostics, not proof of field compliance.
- Include accurate metadata, social preview, canonical URL when known and truthful structured data where appropriate. Never fabricate review/rating schema.

Preview servers must bind to `0.0.0.0` and allow the preview host. Use same-origin browser requests and a server-side proxy for any separate backend.

## 5. Audit and revise (Taste + originality + Open Design critique)

Read `design-taste-frontend/SKILL.md` and the relevant `references/` before implementation so its plan/gate requirements are understood. These are **manual explicit commands** in this host; automatic skill hooks are not assumed.

Run from the company project directory. Commands below assume the page is in this repo root and the finished static output is `index.html`; adapt target/root to the chosen stack. For a framework, rebuild output before each audit and use the built HTML with the correct `--root`, or the local preview URL supported by the tool.

```sh
# Check resource integrity / runtime availability first.
python3 tools/design_skills.py doctor

# Arm the Taste gate when starting the actual page, not during skill setup.
# Replace the quoted category/action with approved brief content.
TASTE="$PWD/.agents/skills/design-taste-frontend"
node "$TASTE/scripts/gate.mjs" --start index.html --kind service \
  --category "approved service category" --primary "approved primary CTA"

# After implementing the page:
node "$TASTE/scripts/copy-lint.mjs" index.html --kind service
node "$TASTE/scripts/consistency.mjs" index.html --page service \
  --widths 1440,1024,820,768,390 --rhythm-widths 1440,820,768,390 \
  --out reports/design/consistency --profile .taste-skill/chrome-consistency
node "$TASTE/assets/layout/check.mjs" --url index.html \
  --sizes 1440x900,1024x768,820x1180,768x1024,390x844 \
  --shots reports/design/layout --profile .taste-skill/chrome-layout
node "$TASTE/scripts/shoot.mjs" --url index.html --w 1440 \
  --out reports/design/1440.png --profile .taste-skill/chrome-desktop
node "$TASTE/scripts/shoot.mjs" --url index.html --w 390 \
  --out reports/design/390.png --profile .taste-skill/chrome-phone
node "$TASTE/scripts/perf.mjs" index.html --profile .taste-skill/chrome-perf
node "$TASTE/scripts/gate.mjs" index.html
```

Use the correct Taste kind (`service`, `place`, `product`, `software`, `tech`, `gaming`), not `service` for every company. Consult the installed skill for classification, dealing/starter steps, claims/contact handling, gate evidence, framework roots and false-positive waivers. Do not run random palette/layout deals over an approved client brand. Upstream house rules may flag intentional Kage-inspired decisions: record the finding, evaluate it against the brief and accessibility, then fix or explicitly justify it. Do not suppress the rule and call it a pass.

The browser scripts require Chrome/Chromium/Edge (set `CHROME_PATH` to the executable). The current sandbox has Node 22 but **no detected browser**. Do not claim browser audits until this prerequisite is supplied. Network media generation and remote fonts may also be blocked; use approved local assets or report the blocker. Node-only tools remain usable.

### Human/agent visual and functional review

- Inspect **full-page plus per-section screenshots**, not just the first screen.
- Walk top → bottom and bottom → top; verify narrative handoffs, chapter state, mobile layout and final CTA.
- Test all links, mobile menu, focus order, FAQ, forms and real delivery/error behavior. Read console/network errors and missing assets. An automated checker is not a full accessibility audit.
- Test at least desktop 1440×900 and phone 390×844, plus tablet widths, reduced motion and keyboard-only use. Include text zoom and long-copy stress tests.
- Run the installed `audit-reference-originality`, `audit-ai-design-slop`, and Open Design `critique` against actual page evidence. Do not invent ratings.
- Fix blockers/high-impact defects and repeat checks. Three Taste rounds without a clean result is a reported remaining problem, not permission to declare completion.

## 6. Handoff with evidence

Fill `docs/design/audit.md` from `templates/design/audit.md`: commands, dates, targets, screenshots, actual results, deliberate exceptions, asset rights and remaining blockers. Keep heavy screenshots/reports in ignored `reports/design/` or external storage. Do not commit private lead data.

Deliver the end-to-end page, working preview, reproducible build/run instructions, a concise design rationale, verified checks and deployment/integration gaps. Conversion performance must be measured after launch; design quality alone cannot guarantee traffic or client volume.
