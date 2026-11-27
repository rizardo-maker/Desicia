#!/usr/bin/env node
/*
  DESICIA site server: static files + POST /api/contact.
  - No framework, Node 18+. `npm start` (or `node server.mjs`), binds HOST (default 0.0.0.0) and PORT (default 8080).
  - /api/contact accepts multipart/form-data (what the page's form sends), urlencoded or JSON; validates every field,
    drops bots (honeypot field "website"), rate-limits per IP, appends every request to data/requests.jsonl and, when
    SMTP_HOST is set, emails it to CONTACT_TO through nodemailer (npm install pulls it in as an optional dependency).
  - Env: see .env.example. Nothing secret is ever written to the log or the response.
*/
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(ROOT, '.env'));
const PORT = +(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const DATA = path.resolve(ROOT, process.env.DATA_DIR || 'data');
const CONTACT_TO = process.env.CONTACT_TO || 'hello@desicia.example';
const CONTACT_FROM = process.env.CONTACT_FROM || 'DESICIA website <no-reply@desicia.example>';
const MAX_BODY = 32 * 1024;
const AREAS = new Set(['Data analytics', 'Automation', 'Transformation', 'Not sure yet']);
const PUBLIC_DENY = /^\/(?:server\.mjs|package(?:-lock)?\.json|\.env.*|data\/|node_modules\/|\.taste-skill\/|README\.md)/;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.woff2': 'font/woff2', '.glsl': 'text/plain' };

const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; base-uri 'self'; form-action 'self' mailto:"
};

function loadEnv(file) {
  try {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}

/* ------------------------------------------------ validation (mirrors the page's own error lines) */
const clean = v => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
export function validate(input) {
  const f = { name: clean(input.name), email: clean(input.email).toLowerCase(), company: clean(input.company),
    area: clean(input.area), message: clean(input.message) };
  const errors = {};
  if (!f.name || f.name.length > 120) errors.name = 'Write your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email) || f.email.length > 200) errors.email = 'Write a work email address with an @.';
  if (!f.company || f.company.length > 160) errors.company = "Write your company's name.";
  if (!AREAS.has(f.area)) errors.area = 'Pick the area closest to your problem.';
  if (f.message.length < 10 || f.message.length > 2000) errors.message = 'Write a sentence or two about the decision you want to improve.';
  return { fields: f, errors };
}

/* ------------------------------------------------ rate limit: 5 requests per IP per 10 minutes */
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > win) hits.delete(k);
  return list.length > 5;
}

async function readBody(req) {
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > MAX_BODY) throw Object.assign(new Error('too large'), { status: 413 }); chunks.push(c); }
  return Buffer.concat(chunks);
}

async function parse(req) {
  const type = String(req.headers['content-type'] || '');
  const body = await readBody(req);
  if (type.includes('application/json')) return JSON.parse(body.toString('utf8') || '{}');
  if (type.includes('multipart/form-data') || type.includes('application/x-www-form-urlencoded')) {
    const fd = await new Request('http://local/', { method: 'POST', headers: { 'content-type': type }, body }).formData();
    const o = {}; for (const [k, v] of fd) if (typeof v === 'string') o[k] = v;
    return o;
  }
  if (type.includes('text/plain')) { const o = {}; for (const l of body.toString('utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0) o[l.slice(0, i)] = l.slice(i + 1); } return o; }
  throw Object.assign(new Error('unsupported type'), { status: 415 });
}

let mailer = null;
async function sendMail(f, id) {
  if (!process.env.SMTP_HOST) return 'skipped (SMTP_HOST not set)';
  if (!mailer) {
    const { default: nodemailer } = await import('nodemailer');
    mailer = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: +(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || '') === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined });
  }
  await mailer.sendMail({ from: CONTACT_FROM, to: CONTACT_TO, replyTo: `${f.name} <${f.email}>`,
    subject: `Call request: ${f.company} (${f.area})`,
    text: `New call request ${id}\n\nName: ${f.name}\nEmail: ${f.email}\nCompany: ${f.company}\nArea: ${f.area}\n\nWhat should change:\n${f.message}\n` });
  return 'sent';
}

async function contact(req, res) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (limited(ip)) return json(res, 429, { ok: false, error: 'Too many requests. Try again in a few minutes.' });
  let input;
  try { input = await parse(req); } catch (e) { return json(res, e.status || 400, { ok: false, error: 'The request could not be read.' }); }
  if (clean(input.website)) return json(res, 200, { ok: true }); // honeypot: quietly accept, never store
  const { fields, errors } = validate(input);
  if (Object.keys(errors).length) return json(res, 422, { ok: false, errors });
  const id = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const record = { id, at: new Date().toISOString(), ...fields, ua: String(req.headers['user-agent'] || '').slice(0, 200), mail: 'pending' };
  try {
    record.mail = await sendMail(fields, id);
  } catch (e) {
    record.mail = `failed: ${e.code || e.message}`;
    console.error(`[contact] mail failed for ${id}:`, e.message);
  }
  try {
    await fsp.mkdir(DATA, { recursive: true });
    await fsp.appendFile(path.join(DATA, 'requests.jsonl'), JSON.stringify(record) + '\n');
  } catch (e) {
    console.error('[contact] could not write the log:', e.message);
    if (record.mail !== 'sent') return json(res, 500, { ok: false, error: 'Not stored. Try again.' });
  }
  console.log(`[contact] ${id} ${fields.company} · mail ${record.mail}`);
  return json(res, 200, { ok: true, id });
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY });
  res.end(JSON.stringify(body));
}

async function serveStatic(req, res) {
  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  if (url.endsWith('/')) url += 'index.html';
  if (PUBLIC_DENY.test(url)) { res.writeHead(404, SECURITY); return res.end('Not found'); }
  const file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end(); }
  let stat;
  try { stat = await fsp.stat(file); } catch { stat = null; }
  if (!stat || !stat.isFile()) {
    const nf = path.join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': TYPES['.html'], ...SECURITY });
    return fs.createReadStream(nf).on('error', () => res.end('Not found')).pipe(res);
  }
  const ext = path.extname(file).toLowerCase();
  const long = /\/assets\/|\.(?:svg|woff2|png|jpg|webp)$/.test(url);
  res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Content-Length': stat.size,
    'Cache-Control': ext === '.html' ? 'no-cache' : long ? 'public, max-age=86400' : 'public, max-age=300', ...SECURITY });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/contact')) {
    if (req.method !== 'POST') { res.writeHead(405, { Allow: 'POST', ...SECURITY }); return res.end(); }
    return contact(req, res).catch(e => { console.error(e); json(res, 500, { ok: false, error: 'Server error.' }); });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, SECURITY); return res.end(); }
  serveStatic(req, res).catch(() => { res.writeHead(500); res.end(); });
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(PORT, HOST, () => console.log(`DESICIA site on http://${HOST}:${PORT}  (contact -> ${CONTACT_TO}${process.env.SMTP_HOST ? ', SMTP on' : ', SMTP off: logging to data/requests.jsonl'})`));
}
export { server };
