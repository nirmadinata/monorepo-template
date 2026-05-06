## Context

`apps/web-cms` currently has only a minimal Better Auth instance in `src/lib/auth.ts`, a React auth client in `src/lib/auth-client.ts`, and a TanStack Start file route that forwards `/api/auth/*` requests to `auth.handler()`. The app already ships with Cloudflare Workers deployment via TanStack Start, a D1 binding named `MAIN_DB`, and the server dependencies needed for Hono, OpenAPI, Scalar, and Better Auth.

`packages/db` already provides the durable part of the data model: `@repo/db/d1` exports the Better Auth-compatible D1 schema and a memoized `getDB()` helper. The auth schema uses custom table aliases and column aliases, which means the Better Auth Drizzle adapter cannot rely on default model names. This change needs to establish a clean server integration boundary without adding any end-user UI yet.

## Goals / Non-Goals

**Goals:**

- Create a server-only integration layer in `apps/web-cms/src/integrations` for shared D1 access, Better Auth, and Hono API composition.
- Reuse `@repo/db/d1` as the single source of truth for the app's Drizzle schema and D1 database getter.
- Configure Better Auth for Google OAuth only, backed by the shared D1 schema, with explicit adapter mapping for the aliased auth tables.
- Enforce bootstrap-style access control: the first successful Google account creation is allowed, and later sign-in attempts from unrecognized Google accounts are rejected.
- Introduce a Hono API foundation with OpenAPI document generation and Scalar UI, organized so future API modules can register routes without changing the transport layer.

**Non-Goals:**

- Building sign-in, sign-up, onboarding, or admin UI.
- Adding CMS domain models beyond the existing shared auth schema.
- Designing invitation flows, role management UX, or multi-user provisioning.
- Shipping public business endpoints beyond the minimum API shell and documentation surface needed to prove the foundation.

## Decisions

### 1. Keep route files thin and move server composition into `src/integrations`

The app will introduce dedicated integration modules, with file-route handlers acting only as transport adapters:

- `src/integrations/appenv`: expand environment parsing for auth and server settings.
- `src/integrations/db`: resolve Cloudflare bindings, expose a typed `getAppDB()` wrapper around `@repo/db/d1`'s `getDB()`, and re-export the shared schema as needed.
- `src/integrations/auth`: own Better Auth server configuration and client-facing auth utilities.
- `src/integrations/api`: own the `OpenAPIHono` instance, docs endpoints, route registration helpers, and future API modules.

`src/lib/auth.ts` and `src/lib/auth-client.ts` can remain as stable import points if desired, but they should delegate to the integration modules rather than hold implementation details.

Why this over continuing in `src/lib` and route files?

- The app already mixes transport (`src/routes/api/auth/$.ts`) and auth composition (`src/lib/auth.ts`). Scaling that pattern for DB access and Hono would spread Worker binding logic across unrelated files.
- A dedicated integrations layer makes Cloudflare-specific code discoverable and keeps future route/UI code independent from binding and adapter details.

### 2. Use `@repo/db/d1` as the only D1/Drizzle source in `web-cms`

`apps/web-cms` will add a workspace dependency on `@repo/db` and must not recreate the auth schema locally. The app-level database integration will:

- read the `MAIN_DB` D1 binding from the Worker environment,
- call `getDB(env.MAIN_DB)` from `@repo/db/d1`, and
- use the exported shared schema for any auth-related typing or adapter setup.

This preserves one schema definition across packages and keeps auth migrations centered on the shared package.

Alternative considered: duplicate a local Drizzle schema in `apps/web-cms`.

- Rejected because it creates drift risk for Better Auth table aliases and defeats the purpose of `packages/db`.

Constraint acknowledged: `getDB()` memoizes the first Drizzle instance at module scope.

- The design assumes one D1 binding for the app (`MAIN_DB`), which matches the current `wrangler.jsonc` setup. The app integration should document that assumption instead of trying to work around it locally.

### 3. Configure Better Auth with explicit Drizzle adapter mapping and Google-only access

Better Auth will move from the current placeholder configuration to a database-backed setup that:

- uses the Drizzle adapter with SQLite/D1 provider configuration,
- maps Better Auth models and fields to the aliased tables/columns from `@repo/db/d1`,
- enables only Google as a social provider,
- disables email/password and other sign-up methods,
- sets trusted origins and required secrets from environment, and
- keeps sessions persisted in the D1-backed auth tables.

To satisfy “signup is only allowed for first user,” the auth layer will implement a bootstrap gate:

- if the users table is empty, a first-time Google sign-in may create the initial account;
- if at least one user already exists, only previously linked Google identities may continue;
- any new Google identity after bootstrap is rejected before a new user/account row is persisted.

This rule belongs in the auth integration rather than UI because API- or callback-level enforcement is the only reliable protection once additional clients or endpoints exist.

Alternative considered: leave sign-up decisions to future UI logic.

- Rejected because OAuth callbacks can create users without any custom page involvement.

Alternative considered: implement allowlisting or invitation-based enrollment now.

- Rejected as out of scope; the user asked for first-user-only bootstrap, not a broader provisioning system.

### 4. Mount the public API foundation under a dedicated catch-all route backed by `OpenAPIHono`

The app will add a dedicated TanStack Start server route for a public API namespace, with a catch-all file-route delegating requests to an `OpenAPIHono` instance. The recommended namespace is `/api/public/*` so it does not collide with `/api/auth/*` and leaves room for separate internal or admin APIs later.

The Hono integration will:

- instantiate `OpenAPIHono` rather than plain `Hono`,
- register a default validation hook for consistent error responses,
- expose an OpenAPI JSON document endpoint,
- expose a Scalar-powered reference UI endpoint,
- centralize metadata such as API title/version/servers, and
- register route modules using typed helpers (`defineOpenAPIRoute`/`openapiRoutes`) so future endpoints can remain modular.

Alternative considered: mount a plain `Hono` app and generate docs separately.

- Rejected because it duplicates route definitions and weakens the contract between validation, handler types, and API documentation.

Alternative considered: mount Hono directly under `/api/*`.

- Rejected for initial setup because `web-cms` already owns `/api/auth/*` via TanStack routes, and a dedicated `/api/public/*` namespace keeps transport ownership explicit.

### 5. Treat environment and bindings as first-class typed infrastructure

The app will expand the existing env integration to capture the server requirements for this change, including:

- Better Auth base URL/secret,
- Google OAuth client ID and secret,
- optional API metadata values where useful,
- trusted origin configuration if separated from the base URL.

Worker bindings should be typed from the Wrangler configuration rather than handwritten ad hoc shapes, and secrets must remain in environment or Wrangler secrets, not source control.

## Risks / Trade-offs

- [Bootstrap gate is enforced at auth-callback time] → Mitigation: keep the first-user rule in auth hooks or adapter-adjacent logic so no UI path can bypass it.
- [Aliased auth tables increase adapter configuration complexity] → Mitigation: explicitly map model and field names in the Better Auth adapter and cover the setup with integration-focused tests.
- [Two API stacks now coexist: Better Auth file route and Hono public API] → Mitigation: separate namespaces (`/api/auth/*` and `/api/public/*`) and keep both routes as thin delegates into integrations.
- [Cloudflare binding access can become scattered] → Mitigation: isolate binding resolution in `src/integrations/db` and shared server context helpers instead of reading bindings directly across modules.
- [OpenAPI docs may expose implementation details if widened later] → Mitigation: start with only the intended public namespace and require explicit route registration for documented endpoints.

## Migration Plan

1. Add the `@repo/db` workspace dependency to `apps/web-cms` and introduce typed server integration modules for env and D1 access.
2. Replace the placeholder Better Auth setup with a shared-schema, Google-only configuration and keep the existing `/api/auth/*` route as a thin delegate.
3. Add the Hono public API integration and a dedicated catch-all route for `/api/public/*`, including OpenAPI JSON and Scalar docs endpoints.
4. Validate the foundation with narrow tests or route-level checks for DB access, auth bootstrap behavior, and docs endpoint exposure.

Rollback strategy:

- revert the new integration modules and restore the current placeholder auth configuration;
- remove the new public API catch-all route and workspace dependency if the change must be backed out before downstream features depend on it.

## Open Questions

None for this setup scope. The design assumes the API reference UI is intentionally reachable wherever the public API namespace is exposed; restricting docs by environment can be proposed later if needed.
