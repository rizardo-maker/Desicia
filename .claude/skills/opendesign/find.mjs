#!/usr/bin/env node
// Search the open-design catalog for the right skill / template / design system / craft rule.
//
//   node .claude/skills/opendesign/find.mjs "pricing section copy"
//   node .claude/skills/opendesign/find.mjs "fintech trust" --kind design-system --limit 8
//   node .claude/skills/opendesign/find.mjs "scroll animation" --json
//
// --kind   skill | template | design-system | craft   (comma-separated; default all)
// --limit  results to print (default 6)
// --json   machine-readable output
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const bool = n => { const i = args.indexOf(n); if (i < 0) return false; args.splice(i, 1); return true; };
const kinds = (flag('--kind', '') || '').split(',').filter(Boolean);
const limit = Number(flag('--limit', 6));
const asJson = bool('--json');
const query = args.join(' ').trim().toLowerCase();
if (!query) { console.error('usage: find.mjs "<need>" [--kind skill,template,design-system,craft] [--limit N] [--json]'); process.exit(2); }

const { entries } = JSON.parse(fs.readFileSync(path.join(here, 'catalog.json'), 'utf8'));

// Light synonym expansion so plain-English needs reach the right vocabulary.
const SYN = {
  color: ['colour', 'palette', 'oklch', 'contrast'], colour: ['color', 'palette'], palette: ['color', 'colour'],
  font: ['typography', 'type', 'typeface'], typography: ['font', 'type'], animation: ['motion', 'animate', 'gsap', 'scroll'],
  motion: ['animation', 'animate'], hero: ['landing', 'header', 'above-the-fold'], landing: ['marketing', 'homepage', 'hero', 'website'],
  website: ['web', 'landing', 'site'], copy: ['copywriting', 'writing', 'headline'], competitor: ['competitive', 'research', 'teardown'],
  competitors: ['competitive', 'research'], research: ['competitive', 'analysis', 'brief'], brand: ['brandkit', 'identity', 'guidelines'],
  conversion: ['cro', 'paywall', 'pricing', 'psychology'], pricing: ['paywall', 'cro', 'upgrade'], faq: ['questions'],
  review: ['critique', 'audit'], icons: ['icon'], image: ['imagegen', 'photo'], photo: ['image', 'photography'],
  '3d': ['threejs', 'webgl', 'shader'], shader: ['webgl', '3d'], accessibility: ['a11y', 'wcag', 'contrast'],
  trust: ['enterprise', 'fintech', 'professional'], saas: ['software', 'dashboard', 'b2b'], mobile: ['responsive', 'adapt'],
};
const STOP = new Set(['a', 'an', 'the', 'for', 'of', 'and', 'to', 'in', 'on', 'with', 'my', 'our', 'i', 'need', 'want', 'make', 'page']);
const terms = [...new Set(query.split(/[^a-z0-9]+/).filter(t => t && !STOP.has(t)))];
const expanded = new Map(terms.map(t => [t, 1]));
for (const t of terms) for (const s of SYN[t] || []) if (!expanded.has(s)) expanded.set(s, 0.5);

const has = (hay, t) => new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(hay);
function score(e) {
  let s = 0;
  const name = e.name.replace(/-/g, ' '), trig = e.triggers.join(' | '), desc = e.description, cat = `${e.category} ${e.scenario} ${e.mode}`;
  for (const [t, w] of expanded) {
    if (has(name, t)) s += 6 * w;
    if (has(trig, t)) s += 4 * w;
    if (has(cat, t)) s += 3 * w;
    if (has(desc, t)) s += 1.5 * w;
  }
  if (e.triggers.some(t => query.includes(t.toLowerCase()) || t.toLowerCase().includes(query))) s += 8;
  if (name.includes(query)) s += 10;
  // Website work should prefer web-surface entries.
  if (e.surface === 'web' || /prototype|template|design-system|craft/.test(e.mode)) s += 0.5;
  return s;
}

const results = entries
  .filter(e => !kinds.length || kinds.includes(e.kind))
  .map(e => ({ ...e, score: +score(e).toFixed(1) }))
  .filter(e => e.score > 1)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);

if (asJson) { console.log(JSON.stringify(results, null, 2)); process.exit(0); }
if (!results.length) { console.log(`No match for "${query}". Try broader words, or read skills-library/open-design/CATALOG.md.`); process.exit(1); }
for (const r of results) {
  const file = r.kind === 'craft' ? r.path : r.kind === 'design-system' ? `${r.path}/DESIGN.md` : `${r.path}/SKILL.md`;
  console.log(`[${r.kind}] ${r.name}  (score ${r.score}${r.category ? ', ' + r.category : ''})`);
  console.log(`  ${r.description.slice(0, 220)}${r.description.length > 220 ? '…' : ''}`);
  console.log(`  read: ${file}\n`);
}
