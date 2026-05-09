## 1. Move the database implementation into `web-cms`

- [x] 1.1 Copy the `packages/db` D1 source files into `apps/web-cms/src/integrations/db` and reshape the local exports so `getAppDB()` and `dbSchema` still provide the app-facing database entrypoint.
- [x] 1.2 Move the checked-in Drizzle migrations and metadata into `apps/web-cms/src/integrations/db/migrations/d1`.
- [x] 1.3 Update the moved source files to use app-local import paths and keep the existing schema and memoized `getDB()` behavior intact.

## 2. Re-home the database tooling in the app

- [x] 2.1 Add `web-cms` package scripts for Drizzle generation and local D1 migration using the moved `src/integrations/db/drizzle.config.ts`.
- [x] 2.2 Update `apps/web-cms/wrangler.jsonc` so the `MAIN_DB` binding owns the migration directory path used by the app-local workflow.
- [x] 2.3 Remove the `@repo/db` workspace dependency from `apps/web-cms/package.json` and clean up any package-level tooling references that are no longer needed.

## 3. Update app consumers and tests

- [x] 3.1 Replace remaining `@repo/db/d1` imports in `apps/web-cms` with local `src/integrations/db` module imports.
- [x] 3.2 Update database-related tests and mocks to target the moved local modules instead of the deleted package entrypoint.
- [x] 3.3 Verify auth and other server integrations still use the unchanged schema contract after the import move.

## 4. Retire the workspace package and update guidance

- [x] 4.1 Remove or retire `packages/db` once no maintained code depends on it.
- [x] 4.2 Update `AGENTS.md` files to describe the new app-local database ownership and remove stale references to `packages/db` as a maintained surface.

## 5. Validation

- [ ] 5.1 Run the narrowest useful `web-cms` tests for the moved database integration and fix any regressions.
- [ ] 5.2 Run the relevant app/workspace checks for the updated package metadata, import paths, and migration tooling.
