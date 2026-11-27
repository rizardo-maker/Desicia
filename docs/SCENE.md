# Phase 2 / spatial engine specification

## Shared world
One Three.js Scene / PerspectiveCamera / WebGLRenderer, dynamically imported after the semantic interface mounts. One persistent canvas behind the full document; no per-section contexts. Main topology: layered reveal. Seeded lattice positions, shared cube geometry, instanced PBR units; LineSegments for the conductive skeleton. A single ShaderMaterial signal field uses phased flow and depth attenuation. No external models/textures or HDR downloads. No postprocessing chain: modest emissive materials and tonal grading rather than expensive bloom. ACES filmic tone mapping once, sRGB output.

## Five authored endpoints
| Chapter | Camera xyz / target | Morph | Scene contribution |
| --- | --- | --- | --- |
| 01 Signal | [10,7,13] / [0,0,0] | Dispersed architectural lattice | Hero focal object on right, occupies ~45% of viewport; quiet left edge under text |
| 02 Intelligence | [7,9,15] / [0,0,0] | Regular analytical grid | World retreats into darker background so HTML console leads |
| 03 Execution | [13,5,10] / [0,0,0] | Routed columns with phased optical signal | Same units and world, no swap; pipeline in foreground HTML |
| 04 Transformation | [9,10,14] / [0,0,0] | Tighter consolidated core | Architecture metaphor resolves; estimator controls remain unobscured |
| 05 Resolution | [11,8,16] / [0,0,0] | Ordered, steady core | Quiet final state, reduced opacity behind trust and CTA |

GSAP ScrollTrigger maps section centers to fractional chapter index. Position/look-target interpolation uses Catmull–Rom curves with damping; lattice morph uses piecewise smoothstep between precomputed endpoints, reversible for reverse scroll and anchor navigation. Small fine-pointer camera offset is additive and damped; it cannot redirect the chapter route. One source of truth drives chapter UI and scene.

## Lighting / materials
Broad warm directional key, neutral hemisphere fill and opposing subdued rim. Roughness 0.5 brass units, 0.85 graphite base, fine pale wire geometry. A floor perspective grid gives the optical lattice context. All geometry/materials cached, no per-frame allocations. Static instancing; dynamic transforms update only the fixed-capacity instance buffer. Seeded random source makes comparisons reproducible.

## Budget and lifecycle
Desktop DPR cap 1.5, max ~400 instances, no realtime shadows, no multipass bloom. After sustained slow frames, DPR decreases to .75 and the instance count reduces to 196. Two sustained <24fps sampling windows switch to the static lattice fallback. Track draw calls, triangles and frame cadence through a non-production-secret debug surface. ResizeObserver/window resize recalculates composition. Page-hidden and user pause cancel RAF; resume resets delta. Unmount removes listeners, observers, RAF, geometry, materials and renderer. Context loss displays static fallback. Below 700px/coarse pointers or reduced motion: no WebGL context; native SVG lattice illustration and normal semantic HTML. The fallback is also present before the engine loads and when initialization fails.

## Skill traceability
- MengTo `build-threejs-scroll-worlds`: one conductor, measured endpoints, layered reveal topology, budget/lifecycle and semantic content.
- MengTo `interactive-topography` (read from pinned research checkout): deterministic field, batched segments and single-source projection. Adapted as an architectural data field rather than terrain art.
- MengTo `3d-feature-objects`: shared geometry/materials, broad key + edge + low fill and exponential damping `1-exp(-k*dt)`. No 3D card rotation: user explicitly forbids tilt.
- MengTo `gradient-border-flashlight`: one pointer listener, latest coordinates/one RAF, noninteractive overlay, normal border/focus retained. A quiet brass wash only.
- Open Design `animation-discipline`: state motion is short; continuous motion has a pause; reduced motion replaces the loop.

## Phase 2 structural validation (spec, not browser claim)
Aster Atelier's chapter continuity is the better structural reference; SaaS landing's generic feature/pricing sequence is unsuitable for an enterprise services offer. Kami's quiet grid informs typography but is too document-like for interactive demos. Choose an original five-chapter composition, not a copied template. The hero, representative console and closing block are implemented against these rules and then rendered in Phase 5 before final acceptance. See `docs/design/template-validation.md` for evidence status and later rendered checks.
