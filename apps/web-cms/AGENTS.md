# apps/web-cms AGENTS Guide

Read the root `AGENTS.md` before working in this app. This file adds app-specific context for `apps/web-cms`.

## App Purpose

`apps/web-cms` is the repository's maintained TanStack Start app. Today it runs on Cloudflare Workers, serves the dashboard UI, handles Better Auth routes, and exposes the public API foundation.

## Current App Surface

- Package name: `web-cms`
- Runtime: TanStack Start on Vite with `@cloudflare/vite-plugin`
- Build and local scripts: `dev`, `build`, `preview`, `d1:generate`, `d1:migrate:local`, `cf-typegen`, `deploy`
- Current dashboard routes: `/dashboard` and `/dashboard/media`
- Styling: Tailwind CSS v4 from `src/styles.css`
- UI primitives: shadcn-style components configured by `components.json` and stored under `src/components/ui/`
- App theming is handled through `src/components/theme-provider.tsx` and `src/components/theme-toggle.tsx`
- App-owned database integration: `src/integrations/db`
- App-owned object storage integration: `src/integrations/r2`
- Worker bindings in `wrangler.jsonc`: `MAIN_DB`, `MAIN_KV`, and `MAIN_R2`
- Typed environment parsing lives under `src/integrations/appenv/`; `appenv` currently requires the Better Auth, Google OAuth, public API, `BUCKET_NAME`, and R2 S3 credential values, and also supports optional client-side `VITE_APP_TITLE`
- App-local test directory: `src/test/` exists today but is currently empty; the workspace still has no maintained test task
- Human-readable app guide: `README.md`

## Source Map

- `src/routes/`: file-based TanStack Router routes, including `/`, `/login`, `/dashboard`, `/dashboard/media`, `/api/auth/$`, and `/api/public/$`
- `src/features/dashboard-authentication/`: public auth pages, auth UI building blocks, and Google sign-in client actions
- `src/features/dashboard/`: authenticated dashboard shell, dashboard navigation, account menu, and dashboard session loader
- `src/features/dashboard-home/`: dashboard landing page content rendered inside the authenticated shell
- `src/features/dashboard-media-library/`: authenticated media-library page, upload/list/delete server flows, and media-specific helpers
- `src/integrations/auth/`: Better Auth server/client setup, adapter wiring, bootstrap-state and current-session server helpers, trusted-origin parsing, and bootstrap-user preparation
- `src/integrations/api/`: Hono OpenAPI app and public API routes, including the system route and Scalar docs
- `src/integrations/db/`: app-owned D1 schema, Drizzle client helper, Drizzle config, checked-in migrations under `migrations/`, and app-facing `getAppDB()` exports
- `src/integrations/r2/`: Cloudflare R2 S3 client setup, app constants, shared types, and server-only repository helpers for presigned URLs and object access
- `src/integrations/appenv/`: typed environment parsing and Cloudflare worker binding access
- `src/integrations/tanstack-query/`: router/query integration and devtools wiring
- `src/components/`: shared app components such as theming and reusable UI primitives
- `src/test/`: currently empty app-local test directory
- `vite.config.ts`: TanStack Start, Cloudflare, Tailwind, devtools, and React Compiler plugin setup
- `wrangler.jsonc`: Worker entrypoint plus `MAIN_DB`, `MAIN_KV`, and `MAIN_R2` bindings
- `README.md`: human-readable app overview, local setup, and deployment notes

## Editing Rules

1. Keep this file focused on the app as it exists today; do not describe future CMS features that have not landed.
2. If you move feature directories, change route responsibilities, add or remove Worker bindings, or change app scripts, update this file in the same change.
3. Treat `src/routeTree.gen.ts` as generated output from the TanStack Router route tree.
4. Keep app-specific details here and leave cross-workspace guidance in the root `AGENTS.md`.

## Implementation Notes

- The protected dashboard route redirects unauthenticated users to `/login` through `src/features/dashboard/server/get-dashboard-session.ts`.
- The authenticated dashboard shell now renders the theme toggle in the header and a user account dropdown in the sidebar footer, with current-user data threaded from the `/dashboard` route loader into the shell.
- Dashboard navigation is still mostly static mock CMS navigation, but `src/features/dashboard/lib/navigation.ts` now includes a concrete `/dashboard/media` entry.
- `src/features/dashboard-home/` currently owns the dashboard landing page content for `/dashboard/` while the shared shell remains reusable for additional dashboard routes.
- `src/features/dashboard-media-library/` owns the `/dashboard/media` route's upload, paginated list, signed preview, tag-filter, tag-edit, and delete flows, backed by D1 metadata plus R2 object storage.
- The media library seeds supported `mime_types` rows at runtime from the app's allowed image and video MIME constants instead of exposing dashboard CRUD for MIME lookup rows.
- Public auth route behavior depends on whether the database already has users; `/` stays open only during bootstrap and otherwise redirects to `/login`.
- The first successful Google bootstrap sign-in creates the initial `superadmin` account.
- `/login` redirects authenticated users to `/dashboard` before rendering the login page.
- Better Auth uses the app-local D1 schema under `src/integrations/db`, Google as the configured social provider, and Cloudflare KV as secondary storage in worker contexts.
- Cloudflare R2 access is wrapped through the app-local `src/integrations/r2/` helpers, which use an S3 client configured from `BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` plus presigned URL and object helper utilities.
- `wrangler.jsonc` keeps the checked-in default D1 migrations under `src/integrations/db/migrations/`, while its `env.development` override currently points `MAIN_DB` at `src/integrations/db/migrations/d1`.
- The public API docs are served from `/api/public/`, with OpenAPI JSON at `/api/public/openapi.json`.
