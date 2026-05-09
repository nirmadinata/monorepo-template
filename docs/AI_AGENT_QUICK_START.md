# AI Agent Quick Start

This repository is a Bun-based template monorepo with one maintained runtime app today: `apps/web-cms`.

## Read This First

1. Read `../AGENTS.md`
2. Read the nearest local `AGENTS.md` for the area you will edit
3. Use `./FEATURES_OVERVIEW.md` and `../apps/web-cms/README.md` for human-readable context when needed

## Current Repo Snapshot

- Package manager: Bun `1.3.13`
- Workspace runner: Turbo
- Lint and formatting: Ultracite, Oxlint, Oxfmt
- Change workflow: OpenSpec under `openspec/`
- Maintained app: `apps/web-cms`
- Maintained packages under `packages/`: none

## Current Runtime Surfaces

### `apps/web-cms`

- Public auth pages at `/` and `/login`
- Protected dashboard shell at `/dashboard`
- Better Auth API route at `/api/auth/*`
- Public API foundation at `/api/public/*`

Core implementation locations:

- `src/features/dashboard-authentication/`
- `src/features/dashboard-home/`
- `src/integrations/auth/`
- `src/integrations/api/`
- `src/integrations/db/`

## Common Commands

From the repository root:

- `bun install`
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run check`
- `bun run fix`

From `apps/web-cms/`:

- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run d1:generate`
- `bun run d1:migrate:local`
- `bun run cf-typegen`

## Documentation Shortcuts

- `/sync-docs` updates both `AGENTS.md` files and human-readable docs
- `/sync-agents` updates only `AGENTS.md` files
- `docs/README.md` is the root index for human-readable docs

## High-Signal Pitfalls

- Document what exists today, not future architecture
- `packages/` is currently empty; do not document runtime code there
- `apps/web-cms/src/routeTree.gen.ts` is generated output
- Authentication UI lives under `src/features/dashboard-authentication/`, while bootstrap/session server helpers live under `src/integrations/auth/`
- `apps/web-cms/README.md` and the root `docs/` surface are maintained docs, not starter scaffolding

## When You Finish Work

- Update every relevant `AGENTS.md` whose documented facts changed
- Update `docs/*.md` or maintained README files when human-readable documentation drifted
- Re-read the docs you touched and confirm paths, commands, and responsibilities match the codebase
