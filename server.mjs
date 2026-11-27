#!/usr/bin/env node
/*
  DECISIA local server: the static site + POST /api/contact, for development and for hosts that run Node.
  On Vercel this file is not used: the static files are served by Vercel and /api/contact runs as the function in
  api/contact.js. Both share the contact logic in api/_lib/contact.mjs.
  - No framework, Node 18+. `npm start` (or `node server.mjs`), binds HOST (default 0.0.0.0) and PORT (default 8080).
  - Every contact request is appended to data/requests.jsonl and, when SMTP_HOST is set, emailed to CONTACT_TO.
  - Env: see .env.example (read from .env when present).
*/
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleContact, validate, SECURITY } from './api/_lib/contact.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(ROOT, '.env'));
const PORT = +(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const DATA = path.resolve(ROOT, process.env.DATA_DIR || 'data');
const MAX_BODY = 32 * 1024;
// the repo root also holds the studio tooling and the project notes: none of it is served
const PUBLIC_DENY = /^\/(?:server\.mjs|package(?:-lock)?\.json|vercel\.json|\.[^/]+|data\/|node_modules\/|api\/|test\/|projects\/|scripts\/|templates\/|skills-library\/|[A-Z][A-Za-z-]*\.md$|skills\.lock\.json)/;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.woff2': 'font/woff2', '.glsl': 'text/plain' };

function loadEnv(file) {
  try {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}

const fileStore = async record => {
  await fsp.mkdir(DATA, { recursive: true });
  await fsp.appendFile(path.join(DATA, 'requests.jsonl'), JSON.stringify(record) + '\n');
};

async function contact(req, res) {
  const chunks = []; let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BODY) return send(res, new Response(JSON.stringify({ ok: false, error: 'The request could not be read.' }), { status: 413, headers: { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY } }));
    chunks.push(c);
  }
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  const request = new Request(`http://${req.headers.host || 'localhost'}${req.url}`, { method: req.method, headers, body: req.method === 'POST' ? Buffer.concat(chunks) : undefined });
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  return send(res, await handleContact(request, { ip, store: fileStore }));
}

async function send(res, response) {
  const h = {}; response.headers.forEach((v, k) => { h[k] = v; });
  res.writeHead(response.status, h);
  res.end(Buffer.from(await response.arrayBuffer()));
}

async function serveStatic(req, res) {
  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  if (url.endsWith('/')) url += 'index.html';
  if (PUBLIC_DENY.test(url)) return notFound(res);
  const file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end(); }
  let stat;
  try { stat = await fsp.stat(file); } catch { stat = null; }
  if (!stat || !stat.isFile()) return notFound(res);
  const ext = path.extname(file).toLowerCase();
  const long = /\/assets\/|\/fonts\/|\.(?:svg|woff2|png|jpg|webp)$/.test(url);
  res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Content-Length': stat.size,
    'Cache-Control': ext === '.html' ? 'no-cache' : long ? 'public, max-age=86400' : 'public, max-age=300', ...SECURITY });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}

function notFound(res) {
  res.writeHead(404, { 'Content-Type': TYPES['.html'], ...SECURITY });
  fs.createReadStream(path.join(ROOT, '404.html')).on('error', () => res.end('Not found')).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/contact')) {
    return contact(req, res).catch(e => { console.error(e); res.writeHead(500); res.end(); });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, SECURITY); return res.end(); }
  serveStatic(req, res).catch(() => { res.writeHead(500); res.end(); });
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(PORT, HOST, () => console.log(`DECISIA site on http://${HOST}:${PORT}  (contact -> ${process.env.CONTACT_TO || 'hello@decisia.example'}${process.env.SMTP_HOST ? ', SMTP on' : ', SMTP off: logging to data/requests.jsonl'})`));
}
export { server, validate };
