## Context

`packages/db` currently contains a small D1-specific surface: Better Auth table constants, the Drizzle schema, a memoized `getDB()` helper, Drizzle Kit config, checked-in migrations, a package-local Wrangler config, and two package scripts for generation and local migration. `apps/web-cms` is the only maintained consumer of that package, and its `src/integrations/db/index.ts` file is currently just a thin wrapper around `@repo/db/d1`.

At the same time, `apps/web-cms` already owns the runtime binding that matters for this database integration: `MAIN_DB` is defined in the app's `wrangler.jsonc`, and auth/data access code already lives inside the app's `src/integrations` layer. The proposed change is a relocation and ownership simplification, not a schema redesign.

## Goals / Non-Goals

**Goals:**

- Make `apps/web-cms/src/integrations/db` the single maintained source of truth for the app's D1 schema, Drizzle client helper, config, and migrations.
- Preserve the current runtime behavior of `getAppDB()` and the Better Auth schema contract during the move.
- Move database tooling into `apps/web-cms` so the app owns both the `MAIN_DB` binding and the migration workflow.
- Remove the `@repo/db` workspace dependency and retire the standalone package surface cleanly.

**Non-Goals:**

- Changing the underlying Better Auth table aliases, column aliases, or schema shape.
- Introducing a new reusable cross-workspace database package to replace `packages/db`.
- Changing auth bootstrap behavior, session handling, or public API behavior beyond import and configuration updates required by the move.
- Adding support for another app or service to reuse the same D1 integration in this change.

## Decisions

### 1. Move the D1 source files directly into `apps/web-cms/src/integrations/db`

The app-local database integration will absorb the current package contents instead of continuing to wrap them. The target layout should keep the existing `src/integrations/db` entrypoint while adding the moved implementation files alongside it.

Recommended layout:

- `src/integrations/db/index.ts`: app-facing exports such as `getAppDB`, `dbSchema`, and any minimal re-exports needed by existing consumers.
- `src/integrations/db/constants.ts`: Better Auth table and column alias constants.
- `src/integrations/db/schema.ts`: Drizzle schema definitions and relations.
- `src/integrations/db/utils.ts`: memoized `getDB()` helper.
- `src/integrations/db/drizzle.config.ts`: Drizzle Kit config owned by `web-cms`.
- `src/integrations/db/migrations/d1/**`: checked-in SQL migrations and Drizzle metadata.

Why this over keeping a nested `d1/` subtree inside `src/integrations/db`?

- The app already treats `src/integrations/db` as its database boundary. Flattening the moved files into that integration keeps local imports short and removes an extra nesting level that only existed to support the separate package export map.

### 2. Keep the app entrypoint stable while switching imports from package-based to local

The current app code already imports `getAppDB()` and `dbSchema` from `src/integrations/db`, while tests in that folder mock `@repo/db/d1` directly. The move should preserve the app entrypoint contract where practical, but internal consumers and tests should stop referencing `@repo/db/d1`.

This means implementation work should:

- update `src/integrations/db/index.ts` to call the moved local `getDB()` helper,
- re-export the moved schema locally,
- switch mocks/tests to the local integration modules, and
- avoid introducing a temporary compatibility layer back to `packages/db`.

Why this over keeping a compatibility bridge to the old package path?

- The package has no other maintained consumer today, so compatibility code would only extend the migration without preserving real external behavior.

### 3. Move migration ownership into `apps/web-cms` and use the app's Wrangler configuration

`packages/db` currently owns both the Drizzle generation script and a package-local Wrangler config with `migrations_dir`. After the move, `apps/web-cms` should own that workflow entirely.

The app should:

- add app-level scripts for Drizzle generation and local D1 migration,
- point Drizzle Kit at `src/integrations/db/drizzle.config.ts`,
- store migrations under `src/integrations/db/migrations/d1`, and
- add `migrations_dir` to the app's existing `wrangler.jsonc` `MAIN_DB` configuration instead of keeping a second Wrangler config just for migrations.

Why this over moving `packages/db/wrangler.jsonc` into the app unchanged?

- `apps/web-cms` already owns the real Worker binding configuration. A second Wrangler file in the app would duplicate the binding definition and create drift risk.

### 4. Preserve the current D1 client lifecycle and schema contract during the relocation

The moved `getDB()` helper should keep its current module-scope memoization behavior unless the implementation uncovers a concrete issue during the move. The schema files should remain structurally equivalent so Better Auth adapter mapping and existing migrations stay valid.

Why preserve this instead of refactoring the DB helper now?

- The requested change is about relocation and ownership. Altering client lifecycle behavior at the same time would widen risk and make verification less clear.

### 5. Remove `packages/db` from the maintained repository surface

Once all imports and scripts have moved, the package should no longer be documented as a maintained workspace surface. The implementation should remove the app dependency on `@repo/db`, retire the package files, and update `AGENTS.md` guidance accordingly.

This includes:

- root `AGENTS.md` no longer describing `packages/db` as the current maintained package surface,
- `apps/web-cms/AGENTS.md` describing `src/integrations/db` as the app-owned D1 schema/migration surface,
- removing or replacing `packages/db/AGENTS.md` if the package directory is removed.

## Risks / Trade-offs

- [Removing `packages/db` reduces future reuse] -> Mitigation: keep the moved DB integration modular inside `src/integrations/db` so it can be extracted again later if another maintained consumer appears.
- [Moving migrations into `src/` is unconventional for some toolchains] -> Mitigation: make the Drizzle config and Wrangler `migrations_dir` explicit and verify the scripts against the new paths.
- [Tests may be tightly coupled to the old package import path] -> Mitigation: update mocks to target local modules and keep the app-facing `src/integrations/db` API stable.
- [Doc drift is likely because root guidance currently calls out `packages/db`] -> Mitigation: treat AGENTS updates and package-surface cleanup as part of the same implementation, not follow-up work.

## Migration Plan

1. Copy the D1 source files and migrations from `packages/db` into `apps/web-cms/src/integrations/db` and update local imports/exports.
2. Update `apps/web-cms` scripts and `wrangler.jsonc` so Drizzle generation and local migration run from the app.
3. Replace remaining `@repo/db/d1` references in app code and tests with local integration imports.
4. Remove the `@repo/db` dependency and retire `packages/db` once no consumers remain.
5. Update repository guidance and run narrow validation for the moved DB integration, auth consumers, and migration tooling paths.

Rollback strategy:

- restore `packages/db` as the source of truth,
- point `apps/web-cms/src/integrations/db` back at `@repo/db/d1`, and
- remove the app-local migration/config changes if the move proves too disruptive.

## Open Questions

None. The change assumes `web-cms` remains the only maintained consumer of this D1 integration at the time of implementation.
