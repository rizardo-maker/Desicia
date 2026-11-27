# DESICIA / implementation and operations

## System boundary

```text
Browser (React / GSAP / optional lazy Three.js)
  ├─ static content-hashed files, local fonts and SVGs
  └─ same-origin POST /api/audit-requests
       ├─ JSON size bound / Zod shared schema
       ├─ origin check / IP rate limit / consent / honeypot
       └─ parameterized SQLite insert → non-PII UUID receipt
```

Vite builds the frontend into `dist/`. tsup builds the Express server into `server-build/` with `node:` protocol preserved for native SQLite. The production server only exposes `dist/` and explicit API routes. Development Vite is middleware on the same server, so browser code never calls another service's localhost address.

## Local start

```sh
npm ci
npm run dev
# Or, after stopping dev:
npm run build
npm start
```

Port defaults to 3000, bound to `0.0.0.0`. Set `PORT` through the environment when necessary. Preview embedding permits the Arena/e2b preview origins in the production frame-ancestors policy; tighten that policy for the final deployment's actual embedding requirements.

## Lead API

`POST /api/audit-requests`, `Content-Type: application/json`:

```json
{
  "name": "Your name",
  "email": "you@company.example",
  "company": "Company name",
  "priority": "AI analytics",
  "context": "Optional non-confidential context",
  "consent": true,
  "website": ""
}
```

Priority must be `AI analytics`, `AI automation` or `AI transformation`. Honeypot `website` must remain empty. Name/company minimum 2 characters; email validation; context maximum 2,000 characters; total JSON limit 12KB. The API rejects malformed bodies, missing consent and invalid priorities. It allows 10 submissions per IP in 15 minutes. Responses expose no submitted PII:

```json
{"reference":"<generated UUID>","status":"saved","delivery":"local-storage"}
```

- 201: inserted into SQLite successfully.
- 400: invalid schema/JSON/honeypot.
- 403: nonmatching browser origin not explicitly allowed.
- 413/415: oversized body/unsupported content type.
- 429: submission rate limit.
- 503: storage unavailable; UI keeps the form recoverable.

There is deliberately **no unauthenticated lead-listing/admin API**, no fake calendar availability and no pretend email delivery. A UUID receipt confirms storage only. Add idempotent delivery/outbox/retry handling when integrating an actual provider; do not turn a notification failure into a lost lead. Secrets belong in server environment/secret storage, never client environment or source.

## Storage, retention and privacy

- `DATA_DIR` defaults to `.data`. Directory permissions request 0700, database 0600; WAL mode is enabled. Host backups and encryption-at-rest depend on deployment and are **not asserted by the site**.
- Mount persistent private storage before deploying. Ephemeral/serverless filesystem storage will lose leads; the current architecture is not ready for that hosting model without a managed database.
- `LEAD_RETENTION_DAYS` defaults to 30 and is bounded 1–365. Expired records purge on startup and new submissions; there is no scheduler claiming instant deletion at midnight.
- For stricter retention guarantees, add a scheduled deletion job and backup-retention policy. The live notice must reflect the actual legal terms and host behavior.
- Browser audit fixtures use `browser@example.test`; unit tests use an in-memory database. No real customer data is needed for tests. Do not commit `.data/`, SQLite files, backups or credentials.
- The local privacy notice is a truthful implementation disclosure, not counsel-approved production legal text. A real controller contact, lawful basis, handling agreements and request/deletion procedures are public-launch requirements.

## Deployment and security work remaining

- Run behind a managed HTTPS endpoint/reverse proxy; approve the canonical domain and a social-preview format appropriate to deployment platforms. No invented domain/canonical URL is shipped.
- If a trusted proxy changes the request Host relative to browser Origin, configure exact `ALLOWED_ORIGINS` values. Do not use a wildcard or blindly trust forwarded headers.
- The in-memory rate limiter and local SQLite suit a single persistent instance. For multi-instance/high traffic use a managed database and shared rate-limit store; do not claim million-visitor capacity based on this local build.
- Add approved CRM/notification/calendar integration, delivery monitoring, audit logs with PII minimization, operational alerts and real deployment smoke checks.
- Security headers and input validation are implemented; no penetration test, SOC 2 audit, blanket zero-retention architecture or private-VPC certification is claimed.
- Resolve the formal Taste gate and validate hardware GPU performance/assistive technologies before release certification. See `AUDIT.md`.

## Resource and dependency boundaries

Manrope and IBM Plex Mono are self-hosted; OFL notices are retained in `third_party/licenses/`. There are no runtime stock image, icon CDN, analytics or model-provider requests. The procedural scene and simple geometric interface diagrams are authored for this site. Demo telemetry is synthetic and labelled.

The vendored skills/reference demos are development resources, not application runtime dependencies. Production deployments need `dist/`, `server-build/`, package manifests/lockfile and installed runtime dependencies; **never serve the repository root**. `npm ci --omit=dev` is appropriate in the runtime stage after a separate full-dependency build stage. Build artifacts are intentionally ignored and must be regenerated on a new checkout.

## Audit commands

`npm run audit:browser` launches Chromium and verifies all four requested viewports, axe findings and interactions. `npm run audit:taste -- <consistency|layout|perf|shoot|gate>` runs the original pinned Taste tool with no hidden suppression/waiver flags. These tools need the dev dependencies and a running website; they should not be installed in the production public directory.

The npm-distributed Chromium build and bundled NSS extraction are intended for this Linux container. On other platforms, use an installed supported Chrome/Chromium executable with the upstream tools' `CHROME_PATH` environment variable. No system/global browser installation is required to run the website itself.
