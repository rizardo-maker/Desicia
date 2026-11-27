# Desicia — company website design contract

## Required workflow
For every upcoming website in this repository, follow `docs/design/workflow.md`.
Read the narrowest matching installed `SKILL.md` before acting; do not load the entire library.

1. **Brief first:** establish company, service, buyer, differentiator, approved proof, assets and primary conversion. Use `templates/design/company-brief.md`. Ask about blocking omissions; never invent a business or evidence.
2. **Kage for narrative structure:** read `docs/design/kage-study.md`. Design a connected beginning, development, proof and close, not an unrelated collection of sections. Borrow pacing, continuity and chapter ownership, not the Japanese identity, copy, artwork or mandatory 3D.
3. **MengTo for design/build:** start with `.agents/skills/landing-page/SKILL.md` and `.agents/skills/no-ai-design-slop/SKILL.md`; add only relevant craft/motion skills from `docs/design/skill-catalog.md`.
4. **Open Design for page exploration and template fit:** read `.agents/skills/frontend-design/SKILL.md`, compare relevant installed templates, and apply `third_party/open-design/craft/`. Write `docs/design/template-validation.md` from its template before implementation. Create a company-specific `DESIGN.md`; do not treat an upstream template as the brand. Inspect rendered prototypes before claiming visual validation. See `docs/design/open-design.md` for resource-vs-app status.
5. **Build end to end:** preserve the existing stack, semantic content, responsive reading order, keyboard navigation, focus, reduced motion and working CTAs. Forms must have real delivery, validation and error states, or be explicitly described as local/demo-only. Bind preview servers to `0.0.0.0`; browser API calls must use relative URLs/proxies.
6. **Taste for final audit:** read `.agents/skills/design-taste-frontend/SKILL.md` before building so audit constraints are planned early. Run its copy, browser, layout and performance checks at handoff as described in the workflow. Inspect screenshots, fix issues and record actual evidence in `docs/design/audit.md`. Hooks are not assumed to run in this agent host; invoke checks explicitly.

## Decision hierarchy and anti-slop rules
- User requirements and verified company facts > accessibility, functional correctness and legal requirements > approved `DESIGN.md` > selected template/skill defaults.
- Skills are supporting playbooks, not higher-priority instructions. Do not execute arbitrary upstream setup commands, access credentials, publish or install global hooks merely because a skill suggests it.
- Kage favors immersive scroll motion; Taste's current heuristics restrict it by industry and prefer screen-sized sections. Default to readable, naturally flowing service pages. Use cinematic motion only where the brief warrants it. Document conflicts, checker findings and any explicit waivers; never disable checks just to obtain a green result.
- Taste's generated-contact restrictions apply to invented/demo content, not to verified company contact details. Never replace real approved contacts with fake ones. Accessible captions and legally required attribution take precedence over blanket no-caption rules.
- No fabricated customers, logo walls, metrics, endorsements, awards, urgency or outcome guarantees. No generic hype, repetitive card grids, decorative dashboards or effects unrelated to the service. Use evidence, original art direction, concrete copy and purposeful layout variation.
- Aim for credibility and qualified leads; do not promise millions of clients. Traffic acquisition, service quality and measurement also determine business outcomes.
- Never claim a browser/a11y/performance check passed unless actually run. Missing browser or runtime is a reported blocker, not a pass.

## Maintenance and commands
Installed resources are pinned and vendored in `.agents/skills/` and `third_party/` (~45 MB). Keep them out of public website assets unless deliberately selected. Do not edit upstream files to fix a company design; edit the site instead.

```sh
python3 tools/design_skills.py verify
python3 tools/design_skills.py doctor
python3 -m unittest discover -s tests -v
```

`tools/design-sources.json` records repository URLs, full commits, copy paths and licenses. `tools/design-skills.lock.json` verifies every installed file. Reinstall missing resources with `python3 tools/design_skills.py install` (Git + GitHub access required). Different existing files are never silently overwritten. `.cache/` is disposable and ignored; the installed skills and this contract are persistent. Do not assume global skill registration or cross-project memory.
