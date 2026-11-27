# DESICIA

A working five-chapter enterprise AI website: a continuous Three.js data lattice, editorial HTML, interactive analytics, a governed workflow simulation, a transformation capacity estimator and an audit-request API.

**Release status:** implementation is running; **Taste finish gate is not passed** (`GATE: OPEN 42`, 3 rounds exhausted; unresolved failures). See [the audit and remaining blockers](docs/AUDIT.md). Do not describe this as release-certified or as having established 60fps on all devices.

## Run locally

Requires **Node 22.13+** (Node 22.22.3 used here) and npm. No provider credentials, external database or paid service is required.

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. Both the website and `/api` use the same server, bound to `0.0.0.0` for preview compatibility.

### Production build

```sh
npm run build
npm start
```

The server serves only `dist/`, not the repository or skill library. Production assets are compressed and content-hashed assets use immutable caching. The backend has request limits, same-origin checks, input validation, security headers and durable local SQLite storage. Node 22 may print its native SQLite experimental-feature warning; this is not an application error.

## What actually works

- **One spatial world:** a persistent, instanced Three.js lattice with a custom flow shader; five scroll-authored camera/morph states, pointer inertia, capped/adaptive resolution, pause control and complete teardown. Low-performance devices fall back rather than continuing an unusable loop.
- **Analytics console:** Revenue / Operations / Supply chain views, chart/metric/feed changes and forecast control. All data is illustrative, never customer proof.
- **Automation studio:** selectable workflow steps, a finite execution simulation and a human-approval checkpoint before posting. No external ERP is connected.
- **Transformation scope:** four sliders recalculate weekly recovered hours and annual capacity value using a published formula. This is a scenario estimate, not guaranteed cash ROI or a client result.
- **Audit request:** accessible modal, native and server validation, consent, honeypot, request/error states and an actual receipt from the local storage API.
- **Diligence:** expandable private-deployment/data-handling and SOC 2 assurance questions. No certification or security capability is fabricated.
- **Responsive navigation:** real anchors, chapter rail, phone menu, focus protection, keyboard controls, reduced-motion/no-GPU paths and two self-hosted font families.

## Request storage and integrations

`POST /api/audit-requests` validates the shared schema and writes to `.data/audit-requests.sqlite` by default. It returns `201` with a UUID reference and `delivery: "local-storage"`. There is no public endpoint listing requests. `GET /api/health` reports service/storage mode without exposing submitted data.

**Important:** this build saves a lead; it does **not** email anyone, schedule a meeting or send data to a CRM. The UI says this explicitly. Add an approved server-side notification/CRM/calendar integration before a public launch. See [operations and deployment](docs/OPERATIONS.md).

Optional environment configuration is documented in [`.env.example`](.env.example). Defaults work without it. The app does not implicitly load dotenv; pass variables through your process manager or run `node --env-file=.env server-build/index.js` after building.

## Tests and browser audits

```sh
npm test                         # model + schema + API persistence/abuse tests
npm run typecheck
npm run format:check
python3 -m unittest discover -s tests -v
python3 tools/design_skills.py verify

# With the site running on port 3000:
npm run audit:browser             # 4 viewports, axe, 16 functional checks, screenshots
npm run audit:taste -- consistency
npm run audit:taste -- layout
npm run audit:taste -- perf
npm run audit:taste -- shoot
npm run audit:taste -- gate       # nonzero: known open findings, not silently waived
```

Browser tools use the npm-distributed Chromium plus its bundled NSS libraries in this Linux sandbox; `npm run browser:setup` prepares/reports the paths. The site itself never loads those dev-only packages. Heavy reports/screenshots remain in ignored `reports/design/`; lightweight audit evidence is saved in [`docs/audit/`](docs/audit/).

**Measured:** 0 horizontal overflow / 0 axe A/AA violations at 1440, 1024, 768 and 390; 15/16 functional checks; 5 × 900px desktop chapters; Taste performance 0 FAIL / 1 WARN. Software rendering measured around 10fps before static fallback, **not 60fps**. Full details, exceptions and before/after evidence: [AUDIT.md](docs/AUDIT.md).

## Phased artifacts

1. [Strategic positioning and full narrative script](docs/SCRIPT.md)
2. [Nine-section design system](DESIGN.md) and [Open Design structural validation](docs/design/template-validation.md)
3. [Spatial engine specification and skill traceability](docs/SCENE.md)
4. Implementation: `src/`, `shared/`, `server/`; [operations](docs/OPERATIONS.md)
5. [Browser/Taste audit and release status](docs/AUDIT.md)

## Design references and installed skills

[Kage](https://github.com/MengTo/kage) informs continuity and pacing, not copied identity/artwork. [MengTo Skills](https://github.com/MengTo/Skills) informs spatial implementation. [Open Design](https://github.com/nexu-io/open-design) resources inform template selection, typography and motion discipline. [Taste](https://github.com/Leonxlnx/taste-skill) supplies the unmodified audit tools.

The pinned repo-local bundles are in `.agents/skills/`; [catalog / rights](docs/design/skill-catalog.md), [Kage source study](docs/design/kage-study.md), [source manifest](tools/design-sources.json), [integrity lock](tools/design-skills.lock.json). **The full Open Design workspace application is not installed**; this project uses its resources directly. Browser support has now been installed for audits, superseding the initial setup's missing-browser note.

Keep the ~45MB development skill library out of website deployment assets. Font license notices are preserved in `third_party/licenses/`. [AGENTS.md](AGENTS.md) is the persistent workflow contract for future work.

## Before a public launch

Resolve the Taste gate and hardware/performance acceptance, configure real lead delivery, approve legal/privacy information and verify procurement claims. Provide genuine case studies rather than converting demo numbers into marketing evidence. Use managed storage/distributed abuse controls for multi-instance traffic. No design or local test establishes millions of visitors, customers or conversions.
