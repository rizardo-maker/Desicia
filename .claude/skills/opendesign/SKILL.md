---
name: opendesign
description: >-
  Router into the open-design library (169 functional skills, 52 web page templates, 152 brand
  design systems, 11 craft rules) vendored in skills-library/open-design. Use it to find the right
  specialist skill for each part of a website (research, strategy, copy, hero, pricing, FAQ, forms,
  icons, imagery, motion, 3D, SEO, brand extraction, design review) before doing that part, and to
  pick a reference design system. Search it, read only the hits, never load the whole library.
---

# open-design router

open-design is a library, not one skill. Its skills live in `skills-library/open-design/`
(not in `.claude/skills/`) so 169 skills do not all trigger at once. This router finds the one you
need for the job in front of you.

## Search

```bash
node .claude/skills/opendesign/find.mjs "<the job in plain words>"                  # top 6 of everything
node .claude/skills/opendesign/find.mjs "pricing page conversion" --kind skill,template
node .claude/skills/opendesign/find.mjs "calm trustworthy healthcare" --kind design-system --limit 8
node .claude/skills/opendesign/find.mjs "color contrast" --kind craft
```

Each hit prints a `read:` path. Read that `SKILL.md` (and only the `references/` files it tells
you to), then do the work. If nothing fits, broaden the words or skim
`skills-library/open-design/CATALOG.md`. Rebuild the index after an upgrade with
`node scripts/build-opendesign-catalog.mjs`.

## Kinds

| kind | what it is | how to use it |
|---|---|---|
| `skill` | a functional capability (copywriting, brand-extract, gsap-scrolltrigger, faq-page …) | follow its workflow for that one part of the page |
| `template` | a complete web page shape (saas-landing, pricing-page, web-prototype …) | study structure and section order; rewrite every word, picture and colour |
| `design-system` | a brand's `DESIGN.md` (stripe, linear-app, apple …) or a style (professional, editorial …) | a **reference** for rhythm, type scale and component tone; never clone a brand's colours, logo or signature look |
| `craft` | universal rules (anti-ai-slop, color, typography, accessibility-baseline, laws-of-ux …) | read the ones that apply before building that layer |

## Rules

1. Search once per job, before the job (the pipeline lists the jobs). Record the pick, and why, in
   the project's `SKILL-ROUTING.md`.
2. open-design ships its own older copies of `taste-skill`, `taste-skill-v1`, `gpt-tasteskill` and
   `impeccable-design-polish`. **Ignore those**: the canonical, newer packs are
   `.claude/skills/design-taste-frontend` and `.claude/skills/impeccable`.
3. Skills that need open-design's own desktop app (an "in-app browser", `od` daemon, Figma, fal,
   Replicate or other paid API keys) are used for their method only; do the steps with the tools
   you have, or skip them and say so.
4. Precedence when guidance disagrees: the user's brief > taste-skill house rules (it is the gate)
   > impeccable craft floor and colour decisions > the open-design skill.
5. `web-clone` and `brand-extract` are for **analysing** competitors. Never copy a competitor's
   code, copy, photographs or signature effect into the build.
