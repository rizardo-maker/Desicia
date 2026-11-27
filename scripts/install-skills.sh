#!/usr/bin/env bash
# Install / refresh the three design skill packs this repo uses for website work.
#
#   ./scripts/install-skills.sh            # install at the commits pinned in skills.lock.json
#   ./scripts/install-skills.sh --update   # pull the latest upstream main and re-pin
#
# What lands where:
#   .claude/skills/design-taste-frontend/   taste-skill   (VALIDATION: build gate, copy-lint, layout checks)
#   .claude/skills/impeccable/              impeccable    (COLOUR, type, critique, audit, polish)
#   .claude/agents/impeccable-*.md          impeccable sub-agents (finish / motion reviewers ...)
#   .agents/skills/{impeccable,design-taste-frontend}   same packs for Codex / other agents
#   skills-library/open-design/             open-design   (169 skills, web templates, 150 design systems, craft rules)
#   .claude/skills/opendesign/catalog.json  searchable index, rebuilt by scripts/build-opendesign-catalog.mjs
#
# open-design is NOT dropped into .claude/skills directly: 169 auto-triggering skills would fight
# each other and the two packs above. The `opendesign` router skill searches the catalog instead.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK="$ROOT/skills.lock.json"
UPDATE=0
[[ "${1:-}" == "--update" ]] && UPDATE=1

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

pin() { # pin <key>  -> commit from lock file (empty if none)
  [[ -f "$LOCK" ]] || { echo ""; return; }
  node -e "const l=require('$LOCK');process.stdout.write((l['$1']||{}).commit||'')"
}

fetch() { # fetch <key> <github-slug>
  local key="$1" slug="$2" commit
  commit="$(pin "$key")"
  echo "==> $slug"
  git clone --quiet --filter=blob:none --no-checkout "https://github.com/$slug.git" "$WORK/$key"
  if [[ $UPDATE -eq 0 && -n "$commit" ]]; then
    git -C "$WORK/$key" checkout --quiet "$commit"
  else
    git -C "$WORK/$key" checkout --quiet HEAD
  fi
  echo "    $(git -C "$WORK/$key" rev-parse HEAD)"
}

fetch taste-skill Leonxlnx/taste-skill
fetch impeccable  pbakaus/impeccable
fetch open-design nexu-io/open-design

# ---------- taste-skill --------------------------------------------------------------------
# Folder name must be the skill's install name (design-taste-frontend): its Stop hook looks for
# $CLAUDE_PROJECT_DIR/.claude/skills/design-taste-frontend/scripts/gate.mjs
rm -rf "$ROOT/.claude/skills/design-taste-frontend" "$ROOT/.agents/skills/design-taste-frontend"
mkdir -p "$ROOT/.claude/skills" "$ROOT/.agents/skills"
cp -R "$WORK/taste-skill/skills/taste-skill" "$ROOT/.claude/skills/design-taste-frontend"
cp "$WORK/taste-skill/LICENSE" "$ROOT/.claude/skills/design-taste-frontend/LICENSE"
# Symlink (not a copy) for other agents: the pack is ~40 MB of photos and assets.
ln -s ../../.claude/skills/design-taste-frontend "$ROOT/.agents/skills/design-taste-frontend"

# ---------- impeccable ---------------------------------------------------------------------
# The repo ships per-harness compiled copies (paths inside differ), so copy each one natively.
rm -rf "$ROOT/.claude/skills/impeccable" "$ROOT/.agents/skills/impeccable"
cp -R "$WORK/impeccable/.claude/skills/impeccable" "$ROOT/.claude/skills/impeccable"
cp -R "$WORK/impeccable/.agents/skills/impeccable" "$ROOT/.agents/skills/impeccable"
mkdir -p "$ROOT/.claude/agents"
rm -f "$ROOT"/.claude/agents/impeccable-*.md
cp "$WORK"/impeccable/.claude/agents/impeccable-*.md "$ROOT/.claude/agents/"
for d in .claude/skills/impeccable .agents/skills/impeccable; do
  cp "$WORK/impeccable/LICENSE" "$ROOT/$d/LICENSE"
done
# Claude Code hooks: detector after each UI edit + deep pass on Stop.
[[ -f "$ROOT/.claude/settings.json" ]] || cp "$WORK/impeccable/.claude/settings.json" "$ROOT/.claude/settings.json"
# Detector config (no upstream-specific ignores).
mkdir -p "$ROOT/.impeccable"
[[ -f "$ROOT/.impeccable/config.json" ]] || cat > "$ROOT/.impeccable/config.json" <<'JSON'
{
  "detector": { "ignoreRules": [], "ignoreFiles": ["skills-library/**", ".claude/**", ".agents/**"], "ignoreValues": [] },
  "hook": { "enabled": true, "limits": { "maxFindings": 5, "maxChars": 8000 } }
}
JSON

# ---------- open-design --------------------------------------------------------------------
OD="$ROOT/skills-library/open-design"
rm -rf "$OD"; mkdir -p "$OD/design-templates" "$OD/design-systems"
cp "$WORK/open-design/LICENSE" "$OD/LICENSE"
cp -R "$WORK/open-design/craft" "$OD/craft"
cp -R "$WORK/open-design/skills" "$OD/skills"
# Web-page templates only (prototype / template modes); decks, video and audio are out of scope.
for f in "$WORK"/open-design/design-templates/*/SKILL.md; do
  d="$(dirname "$f")"
  if grep -qE '^\s+mode:\s*"?(prototype|template)"?\s*$' "$f"; then
    cp -R "$d" "$OD/design-templates/"
  fi
done
# Screenshots / media are previews only; keep the repo light.
find "$OD/design-templates" -type f \( -iname '*.png' -o -iname '*.gif' -o -iname '*.jpg' -o -iname '*.jpeg' \
  -o -iname '*.mp4' -o -iname '*.webm' -o -iname '*.mov' \) -delete
# Design systems: the English DESIGN.md + tokens + manifest are what an agent reads.
for d in "$WORK"/open-design/design-systems/*/; do
  n="$(basename "$d")"; [[ -f "$d/DESIGN.md" ]] || continue
  mkdir -p "$OD/design-systems/$n"
  for f in DESIGN.md tokens.css design-tokens.json tailwind-v4.css manifest.json USAGE.md; do
    [[ -f "$d/$f" ]] && cp "$d/$f" "$OD/design-systems/$n/"
  done
done
[[ -f "$WORK/open-design/design-systems/README.md" ]] && cp "$WORK/open-design/design-systems/README.md" "$OD/design-systems/"

# ---------- lock + catalog -----------------------------------------------------------------
node - "$LOCK" "$WORK" <<'NODE'
const [lock, work] = process.argv.slice(2);
const { execSync } = require('child_process');
const fs = require('fs');
const sha = k => execSync(`git -C ${work}/${k} rev-parse HEAD`).toString().trim();
const date = k => execSync(`git -C ${work}/${k} log -1 --format=%cs`).toString().trim();
const out = {
  'taste-skill': { repo: 'https://github.com/Leonxlnx/taste-skill', commit: sha('taste-skill'), date: date('taste-skill'), role: 'validation' },
  'impeccable':  { repo: 'https://github.com/pbakaus/impeccable',  commit: sha('impeccable'),  date: date('impeccable'),  role: 'colour-type-critique' },
  'open-design': { repo: 'https://github.com/nexu-io/open-design', commit: sha('open-design'), date: date('open-design'), role: 'skill-library' },
};
fs.writeFileSync(lock, JSON.stringify(out, null, 2) + '\n');
NODE
node "$ROOT/scripts/build-opendesign-catalog.mjs"
echo "Done. Pinned commits are in skills.lock.json"
