# DESICIA

The DESICIA website (enterprise AI, data analytics and automation) lives at the root of this repo: a static page
plus one serverless contact endpoint, ready for Vercel.

```
index.html  privacy.html  terms.html  404.html   the pages
css/  js/  fonts/  assets/                       styles, scripts, self-hosted fonts, the taste-skill kit
api/contact.js  api/_lib/contact.mjs             POST /api/contact (Vercel function + shared logic)
server.mjs                                       local server (static + /api/contact), not used on Vercel
vercel.json  .vercelignore                       headers and caching; what is uploaded
projects/desicia/                                brief, research, script, design notes, build report
```

## Deploy on Vercel

1. In Vercel, **Add New → Project** and import this GitHub repo.
2. Keep the defaults: Framework Preset **Other**, Root Directory **`./`**, no build command, no output directory.
3. Optional (so call requests are emailed): in **Settings → Environment Variables** add `CONTACT_TO`,
   `CONTACT_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER` and `SMTP_PASS`, then redeploy. Without SMTP
   every request is still written to the function log (**Logs** tab).

## Run locally

```bash
npm start      # http://localhost:8080 (requests saved to data/requests.jsonl)
npm test       # contact endpoint checks (local server and Vercel function)
```

Node 20 or later locally (Vercel runs Node 24, set in package.json). Copy `.env.example` to `.env` to set the contact and SMTP values.

## The studio around it

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
