# Open Design integration: installed resources vs workspace app

## Installed in Desicia

Pinned from `nexu-io/open-design` at `10f3f96e7d3cadcadd25b2b2f3a188c96877be0e`:

- `frontend-design` and `web-design-guidelines` skills.
- `aster-atelier`, `saas-landing`, `kami-landing` and `critique` template bundles, including their examples/checklists where supplied.
- The complete `craft/` reference directory.
- License and nested attribution files.

These are usable now by reading their `SKILL.md` files and opening/adapting their HTML seeds. Template selection/validation must be recorded using `templates/design/template-validation.md`. No template has been selected for an unspecified company.

This lightweight integration supplies the page-design, template exploration and review material without turning a future company website into a dependency on a large design-workspace monorepo. Resources are pinned, reproducible and available even when `.cache/` is absent.

## Not installed or claimed

The full Open Design daemon, Next.js workspace UI, desktop app, agent-provider configuration and media-generation services are **not running or configured**. No page has been validated inside that UI. There is no Arena connected-app integration involved in this setup.

The inspected app requires **Node 24.x** and **pnpm 10.33.2**; the current sandbox provides Node 22.22.3. Some app downloads/providers also require network hosts outside this sandbox's allowlist. Do not silently replace the project's runtime, configure a provider, copy credentials or claim app validation from having its Markdown skills.

## If the full workspace is needed later

Use the pinned upstream [Quickstart](https://github.com/nexu-io/open-design/blob/10f3f96e7d3cadcadd25b2b2f3a188c96877be0e/QUICKSTART.md) and [agent guide](https://github.com/nexu-io/open-design/blob/10f3f96e7d3cadcadd25b2b2f3a188c96877be0e/AGENTS.md) in an environment with Node 24, pnpm and its required downloads available.

1. Obtain the complete upstream checkout in a disposable/ignored tools location, separate from the company app. The current `.cache/design-upstreams/open-design` is a **sparse research checkout**, not a ready-to-run app.
2. Materialize the pinned revision and all workspace files, read its setup and lifecycle instructions, inspect install scripts, then install with the pinned package manager and lockfile. Do not create or switch branches in the Desicia repository to do this.
3. Use upstream's `pnpm tools-dev` lifecycle interface (not nonexistent `pnpm dev` aliases). Keep workspace persistence/provider configuration out of this repo's tracked files. Any provider authentication should happen in its normal secure UI, never in chat.
4. Before exposing a workspace preview, check binding and allowed hosts/origins. Browser requests must use the same-origin Next.js proxy for daemon routes. Never expose a privileged daemon/API token unauthenticated to the public preview.
5. Explore page shapes, apply the company's `DESIGN.md`, inspect the prototype and export the chosen artifact back to the company project.
6. Record app version, selected template, screenshots and actual review results. Run Taste separately against the resulting company page.

Until then, use the installed resources directly and label the workflow **Open Design resource-based exploration/review**. This is a transparent fallback, not a claim that the full application was installed.
