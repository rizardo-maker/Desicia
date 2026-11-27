# Desicia

A website studio repo where every page goes through one process and three design skill packs:

- **[open-design](https://github.com/nexu-io/open-design)** — 169 skills, 52 web templates and 152 design systems, searched per job:
  `node .claude/skills/opendesign/find.mjs "pricing section"`
- **[impeccable](https://github.com/pbakaus/impeccable)** — colour selection, typography, the design world, critique and audit
- **[taste-skill](https://github.com/Leonxlnx/taste-skill)** — the anti-slop validation gate (`GATE: PASS` or it does not ship)

The process is `.claude/skills/website-pipeline/SKILL.md`:
clarity gate → live competitor research → open-design routing → impeccable colour & type → build → taste-skill gate → report.

```bash
./scripts/install-skills.sh            # reinstall packs at the pinned commits (skills.lock.json)
./scripts/install-skills.sh --update   # upgrade to upstream main and re-pin
source <(./scripts/setup-chrome.sh)    # headless Chromium for the gate, if the machine has no Chrome
```

Works with Claude Code (`.claude/skills`, hooks in `.claude/settings.json`) and Codex / other agents (`.agents/skills`). Agent rules: [AGENTS.md](AGENTS.md).

Licences: each vendored pack keeps its own LICENSE (open-design Apache-2.0, impeccable Apache-2.0, taste-skill MIT).
