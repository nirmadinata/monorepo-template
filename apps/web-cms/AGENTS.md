# apps/web-cms AGENTS Guide

Read the root `AGENTS.md` before working in this app. This file adds app-specific context for `apps/web-cms`.

## App Purpose

`apps/web-cms` is the repository's maintained TanStack Start app. Today it runs on Cloudflare Workers, serves the dashboard UI, handles Better Auth routes, and exposes the public API foundation.

## Current App Surface

- Package name: `web-cms`
- Runtime: TanStack Start on Vite with `@cloudflare/vite-plugin`
- Build and local scripts: `dev`, `build`, `preview`, `test`, `d1:generate`, `d1:migrate:local`, `cf-typegen`, `deploy`
- Styling: Tailwind CSS v4 from `src/styles.css`
- UI primitives: shadcn-style components configured by `components.json` and stored under `src/components/ui/`
- App theming is handled through `src/components/theme-provider.tsx` and `src/components/theme-toggle.tsx`
- App-owned database integration: `src/integrations/db`
- Worker bindings in `wrangler.jsonc`: `MAIN_DB`, `MAIN_KV`, and `MAIN_R2`
- Required server env keys are documented in `.env.example`

## Source Map

- `src/routes/`: file-based TanStack Router routes, including `/`, `/login`, `/dashboard`, `/api/auth/$`, and `/api/public/$`
- `src/features/dashboard-authentication/`: public auth pages, auth UI building blocks, and Google sign-in client actions
- `src/features/dashboard-home/`: authenticated dashboard shell, route content, and dashboard session loader
- `src/integrations/auth/`: Better Auth server/client setup, adapter wiring, bootstrap-state and current-session server helpers, bootstrap-user preparation, and auth tests
- `src/integrations/api/`: Hono OpenAPI app and public API routes, including the system route and Scalar docs
- `src/integrations/db/`: app-owned D1 schema, Drizzle client helper, Drizzle config, checked-in migrations, and app-facing `getAppDB()` exports
- `src/integrations/appenv/`: typed environment parsing and Cloudflare worker binding access
- `src/integrations/tanstack-query/`: router/query integration and devtools wiring
- `src/components/`: shared app components such as theming and reusable UI primitives
- `vite.config.ts`: TanStack Start, Cloudflare, Tailwind, devtools, and React Compiler plugin setup
- `wrangler.jsonc`: Worker entrypoint plus `MAIN_DB`, `MAIN_KV`, and `MAIN_R2` bindings

## Editing Rules

1. Keep this file focused on the app as it exists today; do not describe future CMS features that have not landed.
2. If you move feature directories, change route responsibilities, add or remove Worker bindings, or change app scripts, update this file in the same change.
3. Treat `src/routeTree.gen.ts` as generated output from the TanStack Router route tree.
4. Keep app-specific details here and leave cross-workspace guidance in the root `AGENTS.md`.

## Implementation Notes

- The protected dashboard route redirects unauthenticated users to `/login` through `src/features/dashboard-home/server/get-dashboard-session.ts`.
- The authenticated dashboard shell now renders the theme toggle in the header and a user account dropdown in the sidebar footer, with current-user data threaded from the `/dashboard` route loader into the shell.
- Dashboard navigation is currently static mock CMS navigation defined in `src/features/dashboard-home/lib/navigation.ts` and routes all items back to `/dashboard`.
- Public auth route behavior depends on whether the database already has users; `/` stays open only during bootstrap and otherwise redirects to `/login`.
- `/login` redirects authenticated users to `/dashboard` before rendering the login page.
- Better Auth uses the app-local D1 schema under `src/integrations/db`, Google as the configured social provider, and Cloudflare KV as secondary storage in worker contexts.
- The public API docs are served from `/api/public/`, with OpenAPI JSON at `/api/public/openapi.json`.
