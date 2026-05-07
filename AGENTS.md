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

- Package manager: Bun (`>=1.3.13`)
- Workspace layout: `packages/*` and `apps`
- Task runner: Turbo (`turbo.json`)
- Lint and formatting: Ultracite, Oxlint, Oxfmt
- Language mode: ESM-first TypeScript tooling with Bun types available
- Change workflow: OpenSpec under `openspec/`
- Current maintained package surface: `packages/db`
- Current app surface: `apps/web-cms`

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
- `.github/skills/`: additional repository-local skills available to compatible agent workflows
- `.opencode/`: repository-local Opencode commands and experimental workflow skills

### packages/db

- Package name: `@repo/db`
- Current public export: `@repo/db/d1`
- Purpose today: shared database scaffolding for Drizzle ORM with Cloudflare D1
- See `packages/db/AGENTS.md` before editing anything in this package

### apps

### apps/web-cms

- TanStack Start app targeting Cloudflare Workers via `@cloudflare/vite-plugin`
- Authenticated dashboard shell code now lives under `src/features/dashboard-home/`
- Current server integrations live under `src/integrations/`
- Auth is backed by Better Auth plus D1/Drizzle using the shared `@repo/db/d1` package exports
- Public API foundation is mounted under `/api/public/*` using Hono, `@hono/zod-openapi`, and Scalar

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

- The repository currently has one maintained package and one maintained app implementation (`apps/web-cms`)
- The database package is still scaffold-level in places; some files are placeholders by design
- Validation commands may cover the whole workspace, so prefer the narrowest useful check for the files you changed
