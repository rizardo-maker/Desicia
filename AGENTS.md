# Desicia — agent guide

This repo builds websites with three design skill packs wired into one process.

**For any website, landing page or company page: follow `.claude/skills/website-pipeline/SKILL.md`.**

| Pack | Where | Role |
|---|---|---|
| open-design (nexu-io) | router `.claude/skills/opendesign` → library `skills-library/open-design` | pick the right specialist skill for each part of the page: `node .claude/skills/opendesign/find.mjs "<job>"` |
| impeccable (pbakaus) | `.claude/skills/impeccable` | colour selection, type, design world, critique, audit |
| taste-skill (Leonxlnx) | `.claude/skills/design-taste-frontend` | validation gate (`gate.mjs` must print `GATE: PASS`) |

Non-negotiables:
1. **Clarity gate first.** No build until `projects/<slug>/BRIEF.md` is 100 % answered.
2. **Research the live web.** 6–10 competitor sites read in depth before any design decision.
3. **Nothing invented.** No fake reviews, logos, numbers or clients; missing proof is a client slot.
4. **Precedence:** the brief > taste-skill house rules > impeccable > open-design.
5. **Never edit the vendored packs** to pass a check. Upgrade them with `./scripts/install-skills.sh --update`.

Layout:
- `projects/<slug>/` — one folder per client: BRIEF, research, routing, PRODUCT/DESIGN, `site/`, REPORT.
  **Exception: DESICIA's own site lives at the repo root** (index.html, css/, js/, fonts/, assets/, api/, server.mjs) so
  Vercel deploys it with no settings; its notes stay in `projects/desicia/`. Run the taste gate and checks from the root.
  `.vercelignore` keeps the tooling, the notes and the unused kit media out of the deployment.
- `templates/` — the phase documents to copy into a new project.
- `scripts/install-skills.sh` — reinstall packs at the commits in `skills.lock.json`.
- `scripts/setup-chrome.sh` — headless Chromium for taste-skill checks on machines with no Chrome.
- `.agents/skills/` — the same packs for Codex and other agents.
