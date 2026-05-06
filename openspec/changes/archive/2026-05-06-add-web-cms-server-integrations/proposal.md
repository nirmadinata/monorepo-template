## Why

`apps/web-cms` already includes placeholder auth wiring and the core server dependencies, but it does not yet have a clean server integration layer for data access, authentication, or public APIs. Adding those foundations now prevents the app from coupling route files directly to bindings and makes later CMS features build on a single, typed server surface.

## What Changes

- Add a shared `src/integrations` server integration layer in `apps/web-cms` for D1-backed Drizzle access, Better Auth, and a Hono API app.
- Consume the existing `@repo/db/d1` package exports so `web-cms` uses the shared D1 schema and singleton `getDB()` helper instead of duplicating schema or database setup.
- Replace the current minimal Better Auth configuration with a D1-backed Google OAuth-only setup that maps to the existing `@repo/db/d1` auth schema and only allows account creation for the first user.
- Introduce a Hono-based API foundation for future public endpoints, including OpenAPI route registration and a Scalar documentation UI.
- Keep the scope server-only: no auth pages, sign-in UI, or end-user CMS screens are added in this change.

## Capabilities

### New Capabilities

- `web-cms-data-access`: Shared D1 and Drizzle integration for `apps/web-cms` using the exported schema and database getter from `@repo/db/d1`.
- `web-cms-authentication`: Better Auth server and client integration for Google sign-in backed by the shared D1 auth schema, with first-user-only sign-up gating.
- `web-cms-api-foundation`: Hono API composition for `apps/web-cms`, including OpenAPI registration and Scalar-powered API reference hosting.

### Modified Capabilities

None.

## Impact

- Affected app code: `apps/web-cms/src/integrations/**`, `apps/web-cms/src/lib/auth.ts`, `apps/web-cms/src/lib/auth-client.ts`, `apps/web-cms/src/routes/api/**`, and environment/binding helpers.
- Affected package usage: `apps/web-cms` will add a workspace dependency on `@repo/db` and rely on the existing `@repo/db/d1` schema and `getDB()` contract.
- Affected runtime systems: Cloudflare D1 bindings, Better Auth session/account storage, Google OAuth credentials, and the app's server routing surface.
- Expected follow-on work enabled by this change: future protected CMS features and public API endpoints can build on the same typed integration layer without reintroducing duplicate auth or database setup.
