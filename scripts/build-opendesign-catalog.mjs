#!/usr/bin/env node
// Builds a searchable index of everything in skills-library/open-design:
//   functional skills, web design templates, brand design systems and craft rules.
// Output:
//   .claude/skills/opendesign/catalog.json   (read by find.mjs)
//   skills-library/open-design/CATALOG.md    (human-readable table)
// Zero dependencies; the frontmatter reader handles the subset of YAML open-design uses.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OD = path.join(ROOT, 'skills-library/open-design');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const lines = m[1].split(/\r?\n/);
  const out = {};
  const unq = s => s.trim().replace(/^["']|["']$/g, '');
  let i = 0;
  const readBlock = (indentMin) => {
    const buf = [];
    while (i < lines.length && (lines[i].trim() === '' || lines[i].match(/^\s*/)[0].length >= indentMin)) {
      buf.push(lines[i].trim()); i++;
    }
    return buf.join(' ').replace(/\s+/g, ' ').trim();
  };
  let section = null; // 'od' while inside od:
  while (i < lines.length) {
    const line = lines[i];
    const top = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    const sub = line.match(/^  ([A-Za-z_][\w-]*):\s*(.*)$/);
    if (top) {
      const [, k, v] = top; i++;
      section = k === 'od' ? 'od' : null;
      if (k === 'od') continue;
      if (v === '|' || v === '>' || v === '>-' || v === '|-') out[k] = readBlock(1);
      else if (v === '') {
        const items = [];
        while (i < lines.length && /^\s+-\s/.test(lines[i])) { items.push(unq(lines[i].replace(/^\s+-\s/, ''))); i++; }
        out[k] = items.length ? items : '';
      } else if (/^\[.*\]$/.test(v)) out[k] = v.slice(1, -1).split(',').map(unq).filter(Boolean);
      else out[k] = unq(v);
      continue;
    }
    if (section === 'od' && sub) {
      const [, k, v] = sub; i++;
      if (['mode', 'surface', 'scenario', 'category', 'platform', 'example_prompt'].includes(k) && v && !['|', '>', '>-'].includes(v)) {
        out['od_' + k] = unq(v);
      } else if (k === 'example_prompt') out.od_example_prompt = readBlock(3);
      continue;
    }
    i++;
  }
  return out;
}

const entries = [];
const add = (kind, dir, fm, extra = {}) => {
  entries.push({
    id: `${kind}:${path.basename(dir)}`,
    kind,
    name: fm.name || path.basename(dir),
    description: (fm.en_description || fm.description || '').toString().slice(0, 600),
    triggers: Array.isArray(fm.triggers) ? fm.triggers.filter(t => /[a-z]/i.test(t)) : [],
    mode: fm.od_mode || '',
    category: fm.od_category || '',
    scenario: fm.od_scenario || '',
    surface: fm.od_surface || '',
    example: fm.od_example_prompt || '',
    path: rel(dir),
    ...extra,
  });
};

for (const kind of ['skills', 'design-templates']) {
  const base = path.join(OD, kind);
  if (!fs.existsSync(base)) continue;
  for (const d of fs.readdirSync(base).sort()) {
    const f = path.join(base, d, 'SKILL.md');
    if (!fs.existsSync(f)) continue;
    add(kind === 'skills' ? 'skill' : 'template', path.join(base, d), frontmatter(fs.readFileSync(f, 'utf8')));
  }
}

const dsBase = path.join(OD, 'design-systems');
if (fs.existsSync(dsBase)) {
  for (const d of fs.readdirSync(dsBase).sort()) {
    const f = path.join(dsBase, d, 'DESIGN.md');
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, 'utf8');
    const title = (t.match(/^#\s+(.+)$/m) || [, d])[1];
    const cat = (t.match(/^>\s*Category:\s*(.+)$/m) || [, ''])[1].trim();
    const blurb = (t.match(/^>\s*(?!Category)(.+)$/m) || [, ''])[1].trim();
    const theme = (t.match(/## 1\.[^\n]*\n+([^\n]+)/) || [, ''])[1].slice(0, 400);
    entries.push({
      id: `design-system:${d}`, kind: 'design-system', name: d, description: `${title}. ${blurb} ${theme}`.trim(),
      triggers: [d.replace(/-/g, ' ')], mode: 'design-system', category: cat.toLowerCase(), scenario: '', surface: 'web',
      example: '', path: rel(path.join(dsBase, d)),
    });
  }
}

const craftBase = path.join(OD, 'craft');
if (fs.existsSync(craftBase)) {
  for (const f of fs.readdirSync(craftBase).filter(f => f.endsWith('.md') && !/README|FUTURE/.test(f)).sort()) {
    const t = fs.readFileSync(path.join(craftBase, f), 'utf8');
    const title = (t.match(/^#\s+(.+)$/m) || [, f])[1];
    const para = t.replace(/^#.*$/gm, '').trim().split(/\n\s*\n/)[0].replace(/\s+/g, ' ').slice(0, 400);
    entries.push({
      id: `craft:${f.replace(/\.md$/, '')}`, kind: 'craft', name: f.replace(/\.md$/, ''), description: `${title}. ${para}`,
      triggers: [], mode: 'craft', category: 'craft', scenario: '', surface: 'web', example: '', path: rel(path.join(craftBase, f)),
    });
  }
}

const outDir = path.join(ROOT, '.claude/skills/opendesign');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'catalog.json'), JSON.stringify({ generated: new Date().toISOString(), count: entries.length, entries }, null, 1) + '\n');

const esc = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ');
const sections = [['skill', 'Functional skills'], ['template', 'Web design templates'], ['design-system', 'Brand design systems'], ['craft', 'Craft rules']];
let md = `# open-design catalog\n\nGenerated by \`scripts/build-opendesign-catalog.mjs\` — ${entries.length} entries. Search it with\n\`node .claude/skills/opendesign/find.mjs "<what you need>"\` instead of reading this whole file.\n`;
for (const [k, title] of sections) {
  const rows = entries.filter(e => e.kind === k);
  md += `\n## ${title} (${rows.length})\n\n| name | category | what it does | path |\n|---|---|---|---|\n`;
  for (const e of rows) md += `| ${esc(e.name)} | ${esc(e.category || e.mode)} | ${esc(e.description.slice(0, 160))} | \`${e.path}\` |\n`;
}
fs.writeFileSync(path.join(OD, 'CATALOG.md'), md);
console.log(`catalog: ${entries.length} entries (${sections.map(([k]) => `${entries.filter(e => e.kind === k).length} ${k}`).join(', ')})`);
