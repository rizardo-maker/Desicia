# Installed design resources

All directories below live in `.agents/skills/` and contain upstream `SKILL.md` files plus their shipped references/scripts/assets. They are copied, not symlinks into a disposable cache. Versions and exact file hashes are in `tools/design-sources.json` and `tools/design-skills.lock.json`.

## MengTo — 13 selected skills

| Folder | Load when |
| --- | --- |
| `landing-page` | Defining the offer, audience, conversion argument and page content. |
| `no-ai-design-slop` | Establishing bespoke visual direction and rejecting generic defaults. |
| `build-awwwards-quality-sites` | A brief genuinely needs premium motion-led art direction; not an award claim. |
| `build-threejs-scroll-worlds` | A continuous spatial story is justified; includes Kage anatomy, conductor example, QA and demo. |
| `cinematic-scroll-storytelling` | Planning chapter pacing and purposeful motion; tool recommendations are optional subject to the approved architecture. |
| `falling-leaves` | Kage-derived ambient leaves are relevant to the new brand. Never a default service-page decoration. |
| `pointer-trail-emitter` | Kage-derived pointer presence serves the concept, with coarse-pointer/focus fallbacks. |
| `html-to-interaction-prompts` | Extracting a small reusable interaction spec from HTML. |
| `stitched-full-page-capture` | Reviewing the entire rendered page, including sticky/fixed layers, not just the hero. |
| `audit-reference-originality` | Checking that references informed principles, not a copied identity/layout. |
| `audit-ai-design-slop` | Finding generic patterns, weak specificity and mismatched decoration. |
| `optimize-web-animations` | Resolving animation performance and lifecycle issues. |
| `iterate-until-verified` | Running an evidence-driven implementation/review loop. |

The full MengTo library also includes game, illustration, 3D and automation skills. Those unrelated bundles are deliberately not installed. Add future skills through the reviewed source manifest rather than downloading an unbounded library into the app.

## Open Design — 6 skills/templates + craft reference library

| Folder | Role / fit |
| --- | --- |
| `frontend-design` | Brief-led art direction, brand-system alignment and working interface craft. |
| `web-design-guidelines` | UI review against the bundled, pinned Web Interface Guidelines; no live fetch required. |
| `aster-atelier` | Cinematic creative-studio seed with five chapters, native dialogs/details and an explicit checklist. Strong structural candidate for a creative service firm, not a universal template. |
| `saas-landing` | Product/software landing structure respecting a project `DESIGN.md`. Do not impose subscription pricing on services. |
| `kami-landing` | Restrained, typographic paper/editorial one-pager for expertise-led content. Not a visual default for every company. |
| `critique` | Five-dimension evidence-based review: philosophy, hierarchy, detail, function and innovation. Scores require evidence. |

`third_party/open-design/craft/` contains typography, color, anti-slop, accessibility, animation, UX, form validation and state-coverage guidance. Outside the Open Design app there is no daemon injecting it: agents must explicitly read relevant files.

Only website-relevant seeds are selected. Open Design also has video, slide and audio templates; their impressive motion previews are not automatically suitable website templates. These resources work without the full workspace app; see `open-design.md`.

## Taste — 1 complete skill bundle

`design-taste-frontend` is the install name; upstream stores it at `skills/taste-skill`. Installed version: **tasteskill 2.5.1** at the pinned revision.

Includes the actual runnable copy linter, browser consistency checker, layout checker, screenshot tool, performance tool, finish gate, style libraries and referenced assets. Node 22+ is required; browser tools additionally need Chrome/Edge/Chromium. The full bundle is retained to keep relative imports and references working; none of it is automatically deployed to a company site.

Use Taste throughout planning to avoid late contradictions, and as the **final audit layer**, not a replacement for the approved company identity. Read `AGENTS.md` for how to handle strict house-rule conflicts without hiding failures.

## License inventory

- MengTo Skills: MIT (`third_party/licenses/mengto-skills.txt`).
- Taste: MIT (`third_party/licenses/taste-skill.txt`); individual photo and other resource notices remain in the original bundle.
- Open Design: Apache-2.0 (`third_party/licenses/open-design.txt`); nested licenses and asset-source notes remain in copied directories, including the adapted frontend skill and Aster artwork records.
- Kage: studied by pinned source reference; see the rights caveat in `kage-study.md`.

A root repository license does not erase asset-specific restrictions. Check and record the rights of every production-selected photo, font, icon and artwork in the company project.
