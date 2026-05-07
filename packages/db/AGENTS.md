# packages/db AGENTS Guide

Read the root `AGENTS.md` before working in this package. This file adds package-specific context for `@repo/db`.

## Package Purpose

`@repo/db` is the template's shared database package. Today it exposes the Cloudflare D1 Drizzle schema, utilities, and migration config used by Better Auth-backed apps in this workspace.

## Current Public Surface

- Package name: `@repo/db`
- Export map: `./d1 -> ./src/d1/index.ts`
- Runtime dependency: `drizzle-orm`
- Package scripts: `d1:generate`, `d1:migrate:local`
- Dev tooling: `drizzle-kit`, `dotenv`, `wrangler`, `zod`, `@t3-oss/env-core`, Bun types

## Source Map

- `src/d1/index.ts`: re-exports D1 constants, schema, and utilities
- `src/d1/constants.ts`: Better Auth table aliases and snake_case column aliases used by the D1 schema
- `src/d1/schema.ts`: SQLite schema for Better Auth core tables (`users`, `sessions`, `accounts`, `verification`) with Drizzle relations and Admin plugin columns on `users` and `sessions`
- `src/d1/utils.ts`: creates and memoizes a Drizzle client from a D1 binding
- `src/d1/drizzle.config.ts`: Drizzle Kit config for SQLite with the D1 HTTP driver
- `migrations/d1/`: checked-in SQL migrations and Drizzle metadata for the D1 schema
- `wrangler.jsonc`: local D1 binding config used by the migration workflow

## Editing Rules

1. Keep this package documented as it exists today; do not describe extra database backends or entrypoints until code and exports exist.
2. If you change the export map, major file responsibilities, commands, or runtime assumptions, update this file in the same change.
3. Treat `getDB()` memoization carefully: it currently caches the first created Drizzle instance at module scope.
4. Keep package guidance aligned with `packages/db/package.json` and the actual source tree.

## Implementation Notes

- The package uses strict TypeScript settings with `noEmit` and bundler-style module resolution
- The auth schema uses custom table aliases (`internal_*`) and snake_case column aliases, so Better Auth integrations need explicit schema/model or field mapping when using the Drizzle adapter
- The local migration command persists Wrangler state under the repository-level `.wrangler/state` directory
- This package remains intentionally narrow: migrations, schema, and the memoized D1 Drizzle client are the maintained surface today
- If a future task adds another backend, exports additional entry points, or changes the D1 client lifecycle, update both this file and the root `AGENTS.md`
