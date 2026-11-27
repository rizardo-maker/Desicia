// Contact endpoint checks: node test/contact.test.mjs (starts the local server on a free port and calls the Vercel
// function directly; no SMTP)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'desicia-'));
delete process.env.SMTP_HOST;
const { server, validate } = await import('../server.mjs');
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const good = { name: 'Ana Ruiz', email: 'ana@company.com', company: 'Company SA', area: 'Automation', message: 'Invoice matching takes our AP team two days a week.' };

assert.deepEqual(validate(good).errors, {});
assert.ok(validate({ ...good, email: 'nope' }).errors.email);
assert.ok(validate({ ...good, area: 'Other' }).errors.area);

const fd = new FormData(); for (const [k, v] of Object.entries(good)) fd.append(k, v);
let r = await fetch(base + '/api/contact', { method: 'POST', body: fd });
assert.equal(r.status, 200); assert.equal((await r.json()).ok, true);

r = await fetch(base + '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...good, email: 'x' }) });
assert.equal(r.status, 422); assert.ok((await r.json()).errors.email);

r = await fetch(base + '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...good, website: 'spam.example' }) });
assert.equal(r.status, 200);

r = await fetch(base + '/api/contact'); assert.equal(r.status, 405);
for (const p of ['/server.mjs', '/package.json', '/vercel.json', '/api/_lib/contact.mjs', '/AGENTS.md', '/projects/desicia/BRIEF.md', '/.claude/settings.json', '/.env.example', '/skills-library/', '/test/contact.test.mjs']) {
  r = await fetch(base + p); assert.equal(r.status, 404, `${p} must not be served`);
}
r = await fetch(base + '/'); assert.equal(r.status, 200); assert.match(await r.text(), /DESICIA/);

const log = fs.readFileSync(path.join(process.env.DATA_DIR, 'requests.jsonl'), 'utf8').trim().split('\n');
assert.equal(log.length, 1, 'only the valid, non-honeypot request is stored');
assert.equal(JSON.parse(log[0]).company, 'Company SA');
server.close();

// the Vercel function (api/contact.js): Web Request in, Response out
const fn = await import('../api/contact.js');
const req = (body, headers = {}) => new Request('https://desicia.example/api/contact', { method: 'POST', headers: { 'x-forwarded-for': '203.0.113.9', ...headers }, body });
const fd2 = new FormData(); for (const [k, v] of Object.entries(good)) fd2.append(k, v);
const logged = [];
const origLog = console.log; console.log = (...a) => { logged.push(a.join(' ')); };
let fr = await fn.POST(req(fd2));
console.log = origLog;
assert.equal(fr.status, 200); assert.equal((await fr.json()).ok, true);
assert.ok(logged.some(l => l.includes('"company":"Company SA"')), 'on Vercel the request is written to the function log');
fr = await fn.POST(req(JSON.stringify({ ...good, area: 'Other' }), { 'content-type': 'application/json' }));
assert.equal(fr.status, 422); assert.ok((await fr.json()).errors.area);
fr = await fn.POST(req('x'.repeat(40000), { 'content-type': 'text/plain' }));
assert.equal(fr.status, 413);
fr = fn.GET(); assert.equal(fr.status, 405);
console.log('contact endpoint (local server and Vercel function): all checks passed');
