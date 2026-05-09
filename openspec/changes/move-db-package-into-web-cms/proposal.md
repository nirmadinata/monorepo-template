## Why

`packages/db` is currently a narrow workspace package that is only consumed by `apps/web-cms`. The app already wraps that package in `src/integrations/db`, and the package's Drizzle schema, migrations, Wrangler config, and scripts all exist solely to support the `web-cms` D1 binding. Keeping that database surface in a separate workspace package adds indirection without providing real reuse today.

Moving the database code into `apps/web-cms` will make ownership clearer, keep the migration workflow next to the only app that uses it, and remove the need for `web-cms` to depend on a workspace package for its own internal D1 integration.

## What Changes

- Move the `packages/db` D1 source files into `apps/web-cms/src/integrations/db`, including the shared schema, constants, memoized Drizzle client helper, and Drizzle config.
- Move the checked-in Drizzle migrations into the app-owned database integration so `web-cms` owns schema code and migration files together.
- Replace the current `@repo/db/d1` dependency with local imports from `apps/web-cms/src/integrations/db` while preserving the existing app-level database integration behavior.
- Move the database generation and local migration workflow into `apps/web-cms` scripts and configuration so the app owns its D1 tooling end-to-end.
- Retire the standalone `packages/db` workspace package and update repository guidance to reflect that `web-cms` now owns the maintained database integration surface.

## Capabilities

### Modified Capabilities

- `web-cms-data-access`: `web-cms` will keep using a shared app-level D1 accessor and schema contract, but that contract will be owned locally under `src/integrations/db` instead of coming from `@repo/db/d1`.

### New Capabilities

None.

## Impact

- Affected app code: `apps/web-cms/src/integrations/db/**`, auth/database consumers that currently import `@repo/db/d1`, `apps/web-cms/package.json`, and `apps/web-cms/wrangler.jsonc`.
- Affected workspace surface: `packages/db/**` will be removed or retired once no code depends on it.
- Affected tooling: Drizzle generation and local D1 migration commands move from the package into the app that owns the database binding.
- Affected documentation: root and app `AGENTS.md` files must be updated to describe the new app-local database ownership, and package-level guidance must no longer describe `packages/db` as an active maintained surface.
