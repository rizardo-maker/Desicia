/*
  DESICIA contact logic, shared by the Vercel function (api/contact.js) and the local server (server.mjs).
  Web-standard Request in, Response out, so the same code runs on Vercel and on plain Node 18+.
  - Accepts multipart/form-data (what the page's form sends), urlencoded, JSON or text/plain.
  - Validates every field (the same messages as the page's own error lines), drops bots (honeypot field "website"),
    rate-limits per IP (5 per 10 minutes, per running instance), and emails the request to CONTACT_TO through SMTP
    when SMTP_HOST is set (nodemailer, an optional dependency).
  - `store` decides where the record goes: the local server appends it to data/requests.jsonl; on Vercel (read-only
    disk) the record is written to the function log, so a request is never lost even before SMTP is configured.
  - Env: CONTACT_TO, CONTACT_FROM, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS (see .env.example).
    Nothing secret is ever written to the log or the response.
*/
const MAX_BODY = 32 * 1024;
const AREAS = new Set(['Data analytics', 'Automation', 'Transformation', 'Not sure yet']);

export const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; base-uri 'self'; form-action 'self' mailto:"
};

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

/* rate limit: 5 requests per IP per 10 minutes (in memory: per instance on Vercel, so a soft limit there) */
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > win) hits.delete(k);
  return list.length > 5;
}

async function parse(request) {
  const type = String(request.headers.get('content-type') || '');
  const len = +(request.headers.get('content-length') || 0);
  if (len > MAX_BODY) throw Object.assign(new Error('too large'), { status: 413 });
  const body = Buffer.from(await request.arrayBuffer());
  if (body.length > MAX_BODY) throw Object.assign(new Error('too large'), { status: 413 });
  if (type.includes('application/json')) return JSON.parse(body.toString('utf8') || '{}');
  if (type.includes('multipart/form-data') || type.includes('application/x-www-form-urlencoded')) {
    const fd = await new Request('http://local/', { method: 'POST', headers: { 'content-type': type }, body }).formData();
    const o = {}; for (const [k, v] of fd) if (typeof v === 'string') o[k] = v;
    return o;
  }
  if (type.includes('text/plain')) {
    const o = {};
    for (const l of body.toString('utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0) o[l.slice(0, i)] = l.slice(i + 1); }
    return o;
  }
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
  const to = process.env.CONTACT_TO || 'hello@desicia.example';
  const from = process.env.CONTACT_FROM || 'DESICIA website <no-reply@desicia.example>';
  await mailer.sendMail({ from, to, replyTo: `${f.name} <${f.email}>`,
    subject: `Call request: ${f.company} (${f.area})`,
    text: `New call request ${id}\n\nName: ${f.name}\nEmail: ${f.email}\nCompany: ${f.company}\nArea: ${f.area}\n\nWhat should change:\n${f.message}\n` });
  return 'sent';
}

export function json(status, body, extra = {}) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY, ...extra }
  });
}

/* store(record) -> Promise: where the record goes (a file locally, the function log on Vercel) */
export const logStore = async record => { console.log('[contact] request', JSON.stringify(record)); };

export async function handleContact(request, { ip = '', store = logStore } = {}) {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Use POST.' }, { Allow: 'POST' });
  if (limited(ip || 'unknown')) return json(429, { ok: false, error: 'Too many requests. Try again in a few minutes.' });
  let input;
  try { input = await parse(request); } catch (e) { return json(e.status || 400, { ok: false, error: 'The request could not be read.' }); }
  if (clean(input.website)) return json(200, { ok: true }); // honeypot: quietly accept, never store
  const { fields, errors } = validate(input);
  if (Object.keys(errors).length) return json(422, { ok: false, errors });
  const id = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const record = { id, at: new Date().toISOString(), ...fields, ua: String(request.headers.get('user-agent') || '').slice(0, 200), mail: 'pending' };
  try {
    record.mail = await sendMail(fields, id);
  } catch (e) {
    record.mail = `failed: ${e.code || e.message}`;
    console.error(`[contact] mail failed for ${id}:`, e.message);
  }
  try {
    await store(record);
  } catch (e) {
    console.error('[contact] could not store the request:', e.message);
    if (record.mail !== 'sent') return json(500, { ok: false, error: 'Not stored. Try again.' });
  }
  console.log(`[contact] ${id} ${fields.company} · mail ${record.mail}`);
  return json(200, { ok: true, id });
}

export const clientIp = headers =>
  String(headers.get('x-forwarded-for') || headers.get('x-real-ip') || '').split(',')[0].trim();
