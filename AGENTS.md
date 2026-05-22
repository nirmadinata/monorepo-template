# Template Monorepo AGENTS Guide

This repository is a Bun-based monorepo template. Document what exists today, not the architecture you expect to add later.

## Required Workflow For AI Agents

1. Read this file before planning, proposing, or editing anything in the repository.
2. After reading this file and before planning or executing a task, check for relevant installed skills in repository-local agent tooling directories.
3. Treat `.agents/skills/`, `.github/skills/`, `.claude/skills/`, `.codex/skills/`, and `.opencode/skills/` as installed skill locations in this repository today. Also check `.agent/` or similar repository-local agent tooling folders when they are present.
4. If a relevant installed skill matches the task, read it and use its instructions as part of your working context before continuing. If no relevant skill exists, continue with the repository guidance in this file.
5. If your work touches a package, read the nearest package-level `AGENTS.md` before planning or editing in that area.
6. When you finish work, update every relevant `AGENTS.md` whose documented facts changed. Do not consider the task complete until those files match reality.

## Repository Snapshot

- Package manager: Bun (`1.3.13` via `packageManager`)
- Workspace globs: `packages/*` and `apps/*` (the `packages/` directory is currently empty)
- Task runner: Turbo (`turbo.json`)
- Lint and formatting: Ultracite, Oxlint, Oxfmt
- Language mode: ESM-first TypeScript tooling with Bun types available
- Workspace scripts currently cover `dev`, `build`, `check`, and `fix` (no test task)
- Change workflow: OpenSpec under `openspec/`
- Current maintained runtime surfaces: `apps/web-cms` and `apps/web-landing`
- There are currently no maintained workspace packages under `packages/`

## Commands

- Install dependencies: `bun install`
- Run all dev tasks: `bun run dev`
- Run all builds: `bun run build`
- Lint and check: `bun run check`
- Auto-fix formatting and lint issues: `bun run fix`

## Workspace Map

### Root

- `package.json`: root scripts, Bun workspace config, shared dev tooling
- `turbo.json`: shared task graph for `dev` and `build`
- `openspec/`: change proposals, designs, specs, and task plans
- `.agents/skills/`: repository-local installed skills maintained alongside the workspace
- `.claude/skills/` and `.claude/commands/`: repository-local Claude skill and command assets
- `.github/skills/`: additional repository-local skills available to compatible agent workflows
- `.github/prompts/` and `.github/hooks/`: repository-local GitHub Copilot prompt and hook configuration
- `.opencode/`: repository-local Opencode commands under `.opencode/command/`, including `/sync-agents`, `/sync-docs`, and `opsx-*` workflows, experimental workflow skills under `.opencode/skills/`, and `opencode.json` plugin wiring for `.opencode/plugins/graphify.js`
- `graphify-out/`: local graphify knowledge-graph outputs for repository exploration workflows when generated
- `docs/`: curated human-readable project documentation maintained alongside `AGENTS.md` guidance
- `.codex/skills/`: repository-local Codex skill assets
- `packages/`: workspace package root, currently empty

### apps/web-cms

- TanStack Start app targeting Cloudflare Workers via `@cloudflare/vite-plugin`
- Dashboard authentication UI code lives under `src/features/dashboard-authentication/`
- Authenticated dashboard shell code lives under `src/features/dashboard/`
- Dashboard landing page content for `/dashboard` lives under `src/features/dashboard-home/`
- Dashboard media-library route and feature code live under `src/routes/dashboard.media.tsx` and `src/features/dashboard-media-library/`
- Current server integrations live under `src/integrations/`
- Auth is backed by Better Auth plus the app-local D1/Drizzle integration under `src/integrations/db`
- The app-owned D1 schema, Drizzle client helper, Drizzle config, and checked-in migrations live under `src/integrations/db/`
- App-owned Cloudflare R2 client helpers, constants, and repository utilities live under `src/integrations/r2/`
- Current public auth UI routes are `/` and `/login` via `src/routes/_auth*`
- Current authenticated dashboard routes are `/dashboard` and `/dashboard/media`
- Public API foundation is mounted under `/api/public/*` using Hono, `@hono/zod-openapi`, and Scalar
- Shared UI primitives are configured through `components.json` and live under `src/components/ui/`
- See `apps/web-cms/AGENTS.md` before editing app-specific code

### apps/web-landing

- Next.js App Router app targeting Cloudflare Workers through OpenNext
- Current public landing route lives at `/` via `src/app/page.tsx`
- Root app shell and localized metadata live in `src/app/layout.tsx`
- Cookie-based `next-intl` setup lives under `src/i18n/` with message catalogs under `src/messages/`
- Locale switching uses an app-owned server action in `src/app/actions.ts` plus UI in `src/components/language-switcher.tsx`
- Current supported locales are `en` and `id`, persisted through the `NEXT_LOCALE` cookie without locale-prefixed routing
- Worker entrypoint and bindings live in `wrangler.jsonc`
- See `apps/web-landing/AGENTS.md` before editing app-specific code

## OpenSpec Expectations

- Use OpenSpec changes for planned work that benefits from proposal, design, and task artifacts
- Keep proposal content focused on why the change is needed
- Keep design content focused on technical decisions and constraints
- Keep task lists small, ordered, and checkable
- If implementation changes repository or package working context, update the relevant `AGENTS.md` files in the same change

## Editing Guidance

- Prefer minimal, factual documentation over generic best-practice boilerplate
- Do not treat hidden tool directories such as `.agents/`, `.github/skills/`, `.codex/`, or `.opencode/` as application runtime code unless the task explicitly targets agent tooling
- Avoid documenting placeholder surfaces as if they are fully implemented
- Keep package-level details out of this file when they can live closer to the code in a package `AGENTS.md`
- When adding a new maintained package, add a package-level `AGENTS.md` as part of that work

## Current Constraints To Remember

- The repository currently has two maintained app implementations (`apps/web-cms` and `apps/web-landing`)
- The D1 schema, Drizzle client helper, and checked-in migrations are owned directly by `apps/web-cms`
- The current R2 client and repository helpers are owned directly by `apps/web-cms`
- `packages/` is currently empty and not a source of maintained runtime code, exports, or workspace scripts
- The web app already includes dashboard authentication, a protected dashboard route, and public/auth API routes
- The web app already includes a protected dashboard media library backed by app-local D1 metadata and R2 object storage
- The landing app already includes cookie-based `next-intl` localization for `en` and `id` without locale-prefixed routing
- Validation commands may cover the whole workspace, so prefer the narrowest useful check for the files you changed

## graphify

When `graphify-out/` is present, use it as the repository's local knowledge graph.

Rules:

- Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` for god nodes and community structure when that file exists
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep when graphify outputs are available
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
