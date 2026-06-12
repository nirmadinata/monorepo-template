# packages/db-schema AGENTS Guide

Read the root `AGENTS.md` before working in this package.

## Package Purpose

`packages/db-schema` is the repository's shared Drizzle schema package for the CMS database.

## Current Package Surface

- Package name: `@repo/db-schema`
- Runtime surface: ESM TypeScript source exported directly from `src/index.ts`
- Current responsibilities: shared table aliases, column aliases, Better Auth tables, CMS media-library tables, and CMS post-management tables for the `web-cms` app
- Current consumer: `apps/web-cms`

## Source Map

- `src/constants.ts`: shared table-name and column-name aliases used by schema definitions
- `src/better-auth-schema.ts`: Better Auth user, session, account, and verification tables plus relations
- `src/application-specific-schema.ts`: CMS tag, mime-type, media, media-tag, post, post-editor, and post-tag tables plus relations
- `src/index.ts`: package entrypoint re-exporting the full schema surface

## Editing Rules

1. Keep this file focused on the package as it exists today.
2. If you add or remove schema modules, consumers, or exports, update this file in the same change.
3. Keep runtime DB client logic, migrations, and app-specific Drizzle config outside this package unless they are intentionally being shared.
