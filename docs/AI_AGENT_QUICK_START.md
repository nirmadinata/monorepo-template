# AI Agent Quick Start

This repository is a Bun-based template monorepo with two maintained runtime apps today: `apps/web-cms` and `apps/web-landing`.

## Read This First

1. Read `../AGENTS.md`
2. Read the nearest local `AGENTS.md` for the area you will edit
3. Use `./FEATURES_OVERVIEW.md` plus the relevant app README for human-readable context when needed

## Current Repo Snapshot

- Package manager: Bun `1.3.13`
- Workspace runner: Turbo
- Lint and formatting: Ultracite, Oxlint, Oxfmt
- Change workflow: OpenSpec under `openspec/`
- Maintained apps: `apps/web-cms`, `apps/web-landing`
- Maintained packages under `packages/`: none
- Repository-local Opencode config: `.opencode/opencode.json` loads `.opencode/plugins/graphify.js`

## Current Runtime Surfaces

### `apps/web-cms`

- Public auth pages at `/` and `/login`
- Protected dashboard shell at `/dashboard`
- Protected media-library route at `/dashboard/media`
- Better Auth API route at `/api/auth/*`
- Public API foundation at `/api/public/*`

Core implementation locations:

- `src/features/dashboard-authentication/`
- `src/features/dashboard/`
- `src/features/dashboard-home/`
- `src/features/dashboard-media-library/`
- `src/integrations/auth/`
- `src/integrations/api/`
- `src/integrations/db/`
- `src/integrations/r2/`
- `src/integrations/appenv/`

### `apps/web-landing`

- Public landing page at `/`
- Cookie-based `next-intl` localization for `en` and `id`
- Locale switching through the `NEXT_LOCALE` cookie with no locale-prefixed routing
- OpenNext Cloudflare deployment and preview workflow

Core implementation locations:

- `src/app/`
- `src/components/language-switcher.tsx`
- `src/i18n/`
- `src/messages/`
- `next.config.ts`
- `wrangler.jsonc`

## Common Commands

From the repository root:

- `bun install`
- `bun run dev`
- `bun run build`
- `bun run check`
- `bun run fix`

From `apps/web-cms/`:

- `bun run dev`
- `bun run build`
- `bun run preview`
- `bun run d1:generate`
- `bun run d1:migrate:local`
- `bun run cf-typegen`
- `bun run deploy`

From `apps/web-landing/`:

- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run preview`
- `bun run upload`
- `bun run deploy`
- `bun run cf-typegen`

## Documentation Shortcuts

- `/sync-docs` updates both `AGENTS.md` files and human-readable docs
- `/sync-agents` updates only `AGENTS.md` files
- `/opsx-explore` is the repo-local exploration command for OpenSpec work
- `/opsx-propose`, `/opsx-apply`, and `/opsx-archive` are the other repo-local OpenSpec workflow commands
- `docs/README.md` is the root index for human-readable docs

## High-Signal Pitfalls

- Document what exists today, not future architecture
- `packages/` is currently empty; do not document runtime code there
- `apps/web-cms/src/routeTree.gen.ts` is generated output
- `apps/web-landing` keeps locale selection in the `NEXT_LOCALE` cookie and does not use locale-prefixed routes
- Authentication UI lives under `src/features/dashboard-authentication/`, while bootstrap/session server helpers live under `src/integrations/auth/`
- `apps/web-cms/README.md`, `apps/web-landing/README.md`, and the root `docs/` surface are maintained docs, not starter scaffolding
- The workspace still has no maintained test task

## When You Finish Work

- Update every relevant `AGENTS.md` whose documented facts changed
- Update `docs/*.md` or maintained README files when human-readable documentation drifted
- Re-read the docs you touched and confirm paths, commands, and responsibilities match the codebase
