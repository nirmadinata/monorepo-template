# apps/web-cms AGENTS Guide

Read the root `AGENTS.md` before working in this app. This file adds app-specific context for `apps/web-cms`.

## App Purpose

`apps/web-cms` is the repository's maintained TanStack Start app. Today it runs on Cloudflare Workers, serves the dashboard UI, handles Better Auth routes, and exposes the public API foundation.

## Current App Surface

- Package name: `web-cms`
- Runtime: TanStack Start on Vite with `@cloudflare/vite-plugin`
- Build and local scripts: `dev`, `build`, `preview`, `test`, `cf-typegen`, `deploy`
- Styling: Tailwind CSS v4 from `src/styles.css`
- UI primitives: shadcn-style components configured by `components.json` and stored under `src/components/ui/`
- Shared database dependency: `@repo/db/d1`

## Source Map

- `src/routes/`: file-based TanStack Router routes, including `/dashboard`, `/_public-auth/*`, `/api/auth/$`, and `/api/public/$`
- `src/features/dashboard-authentication/`: public auth pages, bootstrap-state logic, Google sign-in UI, and current-session helpers
- `src/features/dashboard-home/`: authenticated dashboard shell, route content, and dashboard session loader
- `src/integrations/auth/`: Better Auth server/client setup, adapter wiring, bootstrap-user preparation, and auth tests
- `src/integrations/api/`: Hono OpenAPI app and public API routes, including the system route and Scalar docs
- `src/integrations/db/`: app-level wrapper around `@repo/db/d1`
- `src/integrations/appenv/`: typed environment parsing and Cloudflare worker binding access
- `src/integrations/tanstack-query/`: router/query integration and devtools wiring
- `src/components/`: shared app components such as theming and reusable UI primitives
- `vite.config.ts`: TanStack Start, Cloudflare, Tailwind, devtools, and React Compiler plugin setup
- `wrangler.jsonc`: Worker entrypoint plus `MAIN_DB`, `MAIN_KV`, and `MAIN_R2` bindings

## Editing Rules

1. Keep this file focused on the app as it exists today; do not describe future CMS features that have not landed.
2. If you move feature directories, change route responsibilities, add or remove Worker bindings, or change app scripts, update this file in the same change.
3. Treat `src/routeTree.gen.ts` as generated output from the TanStack Router route tree.
4. Keep app-specific details here and leave cross-workspace database guidance in `packages/db/AGENTS.md`.

## Implementation Notes

- The protected dashboard route redirects unauthenticated users to `/login` through `src/features/dashboard-home/server/get-dashboard-session.ts`.
- Public auth route behavior depends on whether the database already has users; bootstrap-state logic lives under `src/features/dashboard-authentication/`.
- Better Auth uses the shared D1 schema, Google as the configured social provider, and Cloudflare KV as secondary storage in worker contexts.
- The public API docs are served from `/api/public/docs`, with OpenAPI JSON at `/api/public/openapi.json`.
