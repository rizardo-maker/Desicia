# Kage: source study and transferable architecture

Studied on 2026-11-27 at commit `4399487d2fb42bce39c7b032fbbb50d230bf4f0b`.
This is a **source-code study**, not a claim that a live browser review was completed.

## Primary evidence

- [README: architecture, assets, operation and skill attribution](https://github.com/MengTo/kage/blob/4399487d2fb42bce39c7b032fbbb50d230bf4f0b/README.md)
- [PROMPT: experience, layout, motion and QA brief](https://github.com/MengTo/kage/blob/4399487d2fb42bce39c7b032fbbb50d230bf4f0b/PROMPT.md)
- [index.html: complete implementation](https://github.com/MengTo/kage/blob/4399487d2fb42bce39c7b032fbbb50d230bf4f0b/index.html)
- Installed companion: `../../.agents/skills/build-threejs-scroll-worlds/references/kage-anatomy.md` (path relative to this document).

## How it is built

Kage is a static HTML/CSS/JavaScript document with a local Three.js r149 build, no framework or build step, and local media/font resources. Its visual depth is **hybrid**, not entirely WebGL: a procedural live world, generated scene plates in HTML, and alpha-preserving foreground WebP cutouts. Semantic text and controls remain in the DOM.

| System | Source landmark | Why it matters |
| --- | --- | --- |
| One world | `initGL`, world-building functions | Temple, approach, moon, weather and lighting belong to one scene. The visitor travels through a place rather than seeing unrelated backgrounds. |
| Chapter route | `[data-cam]`, `SECS`, `measure`, `progressFor` | Six anchors represent the hero, Sanmon, Still Gardens, Sacred Craft, Afterlight and colophon. “Five chapters” in the marketing description is not five independent canvases. Section centers become fractional route progress. |
| Composed camera | `CAM`, `buildRig`, `applyCamera` | Six position/target/FOV keyframes; separate Catmull–Rom paths for position and look target, interpolated lens values and damped progress. Each endpoint is a designed composition. |
| Mobile recomposition | `vpW`, `vpH`, `aspectFix`, `fitAspect` | Layout-viewport sizing, camera pullback and wider field of view preserve landmarks on tall screens. Mobile is recomposed, not just cropped. |
| Near-plane continuity | `.fg`, `#fg-sky`, foreground ownership logic | The active section's cutouts move into one fixed foreground host. Incoming pieces settle; outgoing pieces fade/blur before returning to their source. Stable data attributes preserve styling when reparented. |
| Editorial layer | `wireReveals`, `splitHeadingWords` | Heading words arrive in sequence; supporting copy and media have their own timing. Accessible full phrases are preserved while visual word masks are hidden from assistive technology. |
| Interface state | chapter rail, navigation, measured anchors | Navigation identifies where the reader actually is, independently of camera inertia. Anchors work with the document's route. |
| Rendering finish | `initPost`, `renderPost` | Threshold/blur/upsample bloom passes, grading and atmosphere unify the scene. Strong underlying composition comes first. |
| Runtime budget | `LOW`, `DPR_CAP`, `PERF`, `resize`, visibility handlers | Coarse-pointer devices default to lower quality; DPR defaults cap at 1.4/1.8. Adaptive resolution and hidden-tab pause reduce load. Secondary card rendering is conditional. These are techniques, not proof of a performance score. |
| Resilience / review | `fallback`, `REDUCE`, `?shot=`, `?nogl=` | WebGL failure restores reading/reveal states; reduced-motion branches reduce choreography; deterministic chapter states aid review. A future site must independently test no-JS, reduced-motion and GPU-loss paths. |

Kage does **not** require GSAP or Lenis in its implementation. Some MengTo skills recommend those tools; do not confuse a reusable recommendation with Kage's actual dependency list.

## Why it reads as one narration

1. **Opening:** establish the place, atmosphere, identity and invitation.
2. **Threshold:** move closer; exchange intrigue for specific context.
3. **Exploration:** vary layout and viewpoint while keeping a shared visual world.
4. **Depth:** reveal craft and detail after the visitor understands the premise.
5. **Resolution:** create a quieter closing frame and a clear next step.
6. **Colophon:** finish deliberately instead of ending in a leftover utility footer.

Continuity comes from repeated visual anchors, coordinated section state and changes in pace. The lesson is not “put a dramatic animation on every section.”

## Translation to a professional services company

This is a starting argument, not a mandatory template. Validate it against the actual brief.

| Narrative beat | Business question answered | Useful content / visual |
| --- | --- | --- |
| Arrival | What do you do, for whom, and why should I care? | Concrete service/outcome headline, real work/people/product visual, primary action. |
| Recognition | Do you understand my situation? | Specific buyer problem, constraints and differentiator. |
| Offer | What will I actually get? | Deliverables and service boundaries, not vague capability labels. |
| Evidence | Why should I trust you? | Approved case study, demonstration, work samples or transparent methodology. Omit unsupported claims. |
| Engagement | What happens if we work together? | Process, expectations, commercial terms if provided, FAQs addressing real objections. |
| Resolution | What is the next step? | Same primary CTA, useful contact details and honest submission/booking behavior. |

Give each section one job, one focal point and an intentional handoff into the next. Vary composition to match the content; retain shared typography, edges and palette. Prefer photography, tangible work and restrained motion for service companies. Use one continuous WebGL world only if the subject and performance budget justify it.

## Which MengTo skills are actually connected?

- Kage's README explicitly links the MengTo skill library and identifies **falling leaves** and **pointer trail** as techniques extracted from Kage.
- The current library's **build-threejs-scroll-worlds** includes a Kage anatomy reference and an upstream-bundled Kage demo. It is useful implementation evidence, not proof that this exact current skill version was used before Kage was authored.
- **landing-page**, **no-ai-design-slop**, **cinematic-scroll-storytelling**, capture and audit skills are selected for the future workflow. Do not assert that every selected skill was historically used to make Kage.

## Originality and rights

The linked Kage repository has no top-level license at the inspected revision; public visibility alone is not a reuse grant. We did not directly vendor that repository. The separately MIT-licensed MengTo Skills bundle includes its own Kage demo; it is retained unmodified with the bundle's license for reference. That is not permission to claim Kage's identity/artwork as a company deliverable. Create or license company-specific assets, preserve applicable notices, and keep reference demos out of production output.
