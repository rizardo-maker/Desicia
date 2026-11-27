// Contact endpoint checks: node test/contact.test.mjs (starts the server on a free port, no SMTP)
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
r = await fetch(base + '/server.mjs'); assert.equal(r.status, 404);
r = await fetch(base + '/'); assert.equal(r.status, 200); assert.match(await r.text(), /DESICIA/);

const log = fs.readFileSync(path.join(process.env.DATA_DIR, 'requests.jsonl'), 'utf8').trim().split('\n');
assert.equal(log.length, 1, 'only the valid, non-honeypot request is stored');
assert.equal(JSON.parse(log[0]).company, 'Company SA');
server.close();
console.log('contact endpoint: all checks passed');
