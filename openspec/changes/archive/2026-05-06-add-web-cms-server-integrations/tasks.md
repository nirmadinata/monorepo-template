## 1. Integration foundation

- [x] 1.1 Add the `@repo/db` workspace dependency to `apps/web-cms` and update any package metadata needed for the shared D1 integration.
- [x] 1.2 Expand `apps/web-cms` server environment and Worker binding typing for Better Auth secrets, Google OAuth credentials, and the `MAIN_DB` D1 binding.
- [x] 1.3 Create the `src/integrations/db` module(s) that resolve `MAIN_DB`, wrap `@repo/db/d1`'s `getDB()`, and expose the shared schema to app server code.

## 2. Better Auth integration

- [x] 2.1 Replace the placeholder Better Auth server setup with a D1-backed configuration that uses the shared auth schema and explicit adapter field/model mapping.
- [x] 2.2 Configure Google OAuth as the only enabled sign-in method and remove email/password behavior from the current auth setup.
- [x] 2.3 Implement the first-user bootstrap gate so only the initial Google identity can create a user, while returning linked accounts continue to sign in.
- [x] 2.4 Update the app auth client and `/api/auth/*` route delegation so transport code stays thin and points at the new integration layer.

## 3. Public API foundation

- [x] 3.1 Create the `src/integrations/api` Hono foundation using `OpenAPIHono`, shared API metadata, and a reusable validation/error hook.
- [x] 3.2 Add OpenAPI document and Scalar API reference endpoints within the chosen public API namespace.
- [x] 3.3 Add the dedicated catch-all TanStack Start server route that delegates the public API namespace to the Hono integration.
- [x] 3.4 Add the initial route registration structure for future public API modules using typed `@hono/zod-openapi` route definitions.

## 4. Verification

- [x] 4.1 Add focused tests or equivalent route-level checks covering shared DB access, first-user auth gating, and OpenAPI/Scalar endpoint exposure.
- [x] 4.2 Run the narrowest app validation needed for the change, including relevant `web-cms` type checks/tests, and fix any integration regressions.
