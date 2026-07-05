# packages/db-schema AGENTS Guide

Read the root `AGENTS.md` before working in this package.

## Package Purpose

`packages/db-schema` is the repository's shared Drizzle schema package for the CMS database.

## Current Package Surface

- Package name: `@repo/db-schema`
- Runtime surface: ESM TypeScript source exported directly from `src/index.ts`
- Current responsibilities: shared table aliases, column aliases, Better Auth tables (users, sessions, accounts, verification), and media tables (media, tags, media_tags) for the `web-cms` app
- Current consumer: `templates/web-cms`
- Local scripts: `typecheck`

## Source Map

- `src/constants.ts`: shared table-name and column-name aliases used by schema definitions
- `src/schema.ts`: Better Auth user, session, account, and verification tables plus media, tags, media_tags with relations
- `src/index.ts`: package entrypoint re-exporting the full schema surface
- `tsconfig.json`: TypeScript configuration for type-checking

## Editing Rules

1. Keep this file focused on the package as it exists today.
2. If you add or remove schema modules, consumers, or exports, update this file in the same change.
3. Keep runtime DB client logic, migrations, and app-specific Drizzle config outside this package unless they are intentionally being shared.
