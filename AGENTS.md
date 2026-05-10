# Template Monorepo AGENTS Guide

This repository is a Bun-based template monorepo for future projects. Document what exists today, not the architecture you expect to add later.

## Required Workflow For AI Agents

1. Read this file before planning, proposing, or editing anything in the repository.
2. After reading this file and before planning or executing a task, check for relevant installed skills in repository-local agent tooling directories.
3. Treat `.agents/skills/` and `.github/skills/` as installed skill locations in this repository today. Also check `.agent/` or similar repository-local agent tooling folders when they are present.
4. If a relevant installed skill matches the task, read it and use its instructions as part of your working context before continuing. If no relevant skill exists, continue with the repository guidance in this file.
5. If your work touches a package, read the nearest package-level `AGENTS.md` before planning or editing in that area.
6. When you finish work, update every relevant `AGENTS.md` whose documented facts changed. Do not consider the task complete until those files match reality.

## Repository Snapshot

- Package manager: Bun (`1.3.13` via `packageManager`)
- Workspace globs: `packages/*` and `apps/*` (the `packages/` directory is currently empty)
- Task runner: Turbo (`turbo.json`)
- Lint and formatting: Ultracite, Oxlint, Oxfmt
- Language mode: ESM-first TypeScript tooling with Bun types available
- Change workflow: OpenSpec under `openspec/`
- Current maintained runtime surface: `apps/web-cms`
- There are currently no maintained workspace packages under `packages/`

## Commands

- Install dependencies: `bun install`
- Run all dev tasks: `bun run dev`
- Run all builds: `bun run build`
- Run all tests: `bun run test`
- Lint and check: `bun run check`
- Auto-fix formatting and lint issues: `bun run fix`

## Workspace Map

### Root

- `package.json`: root scripts, Bun workspace config, shared dev tooling
- `turbo.json`: shared task graph for `dev`, `build`, and `test`
- `openspec/`: change proposals, designs, specs, and task plans
- `.agents/skills/`: repository-local installed skills maintained alongside the workspace
- `.claude/skills/` and `.claude/commands/`: repository-local Claude skill and command assets
- `.github/skills/`: additional repository-local skills available to compatible agent workflows
- `.github/prompts/` and `.github/hooks/`: repository-local GitHub Copilot prompt and hook configuration
- `.opencode/`: repository-local Opencode commands, including `/sync-agents`, `/sync-docs`, and `opsx-*` workflows, plus experimental workflow skills
- `graphify-out/`: checked-in graphify knowledge-graph outputs for repository exploration workflows
- `docs/`: curated human-readable project documentation maintained alongside `AGENTS.md` guidance
- `.codex/skills/`: repository-local Codex skill assets
- `packages/`: workspace package root, currently empty

### apps/web-cms

- TanStack Start app targeting Cloudflare Workers via `@cloudflare/vite-plugin`
- Dashboard authentication UI code lives under `src/features/dashboard-authentication/`
- Authenticated dashboard shell code lives under `src/features/dashboard-home/`
- Current server integrations live under `src/integrations/`
- Auth is backed by Better Auth plus the app-local D1/Drizzle integration under `src/integrations/db`
- The app-owned D1 schema, Drizzle client helper, Drizzle config, and checked-in migrations live under `src/integrations/db/`
- App-owned Cloudflare R2 client helpers, constants, and repository utilities live under `src/integrations/r2/`
- Current public auth UI routes are `/` and `/login` via `src/routes/_auth*`
- Public API foundation is mounted under `/api/public/*` using Hono, `@hono/zod-openapi`, and Scalar
- Shared UI primitives are configured through `components.json` and live under `src/components/ui/`
- See `apps/web-cms/AGENTS.md` before editing app-specific code

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

- The repository currently has one maintained app implementation (`apps/web-cms`)
- The D1 schema, Drizzle client helper, and checked-in migrations are owned directly by `apps/web-cms`
- The current R2 client and repository helpers are owned directly by `apps/web-cms`
- `packages/` is currently empty and not a source of maintained runtime code, exports, or workspace scripts
- The web app already includes dashboard authentication, a protected dashboard route, and public/auth API routes
- Validation commands may cover the whole workspace, so prefer the narrowest useful check for the files you changed
