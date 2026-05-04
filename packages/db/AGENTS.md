# packages/db AGENTS Guide

Read the root `AGENTS.md` before working in this package. This file adds package-specific context for `@repo/db`.

## Package Purpose

`@repo/db` is the template's shared database package. Today it exposes Cloudflare D1-oriented Drizzle scaffolding plus a Better Auth-compatible core auth schema.

## Current Public Surface

- Package name: `@repo/db`
- Export map: `./d1 -> ./src/d1/index.ts`
- Runtime dependency: `drizzle-orm`
- Dev tooling: `drizzle-kit`, `dotenv`, `zod`, `@t3-oss/env-core`, Bun types

## Source Map

- `src/d1/index.ts`: re-exports D1 constants, schema, and utilities
- `src/d1/constants.ts`: placeholder table-name constants object
- `src/d1/schema.ts`: SQLite schema for Better Auth core tables (`users`, `sessions`, `accounts`, `verification`) with Drizzle relations and Admin plugin columns on `users` and `sessions`
- `src/d1/utils.ts`: creates and memoizes a Drizzle client from a D1 binding
- `src/d1/drizzle.config.ts`: Drizzle Kit config for SQLite with the D1 HTTP driver
- `src/turso/`: empty placeholder; not exported and not yet part of the public package surface

## Editing Rules

1. Keep this package documented as it exists today; do not describe `turso` support until code and exports exist.
2. If you change the export map, major file responsibilities, commands, or runtime assumptions, update this file in the same change.
3. Treat `getDB()` memoization carefully: it currently caches the first created Drizzle instance at module scope.
4. Keep package guidance aligned with `packages/db/package.json` and the actual source tree.

## Implementation Notes

- The package uses strict TypeScript settings with `noEmit` and bundler-style module resolution
- The auth schema uses custom table aliases (`internal_*`) and snake_case column aliases, so Better Auth integrations need explicit schema/model or field mapping when using the Drizzle adapter
- This package remains scaffold-oriented outside the concrete D1 auth schema; only convert other placeholders to concrete guidance when code actually lands
- If a future task adds Turso support, exports additional entry points, or changes the D1 client lifecycle, update both this file and the root `AGENTS.md`
