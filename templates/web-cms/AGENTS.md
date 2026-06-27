# templates/web-cms AGENTS Guide

Read the root `AGENTS.md` before working in this app. This file adds app-specific context for `templates/web-cms`.

## App Purpose

`templates/web-cms` is the repository's maintained TanStack Start app. Today it runs on Cloudflare Workers, serves the public authentication UI and protected dashboard UI, and handles Better Auth routes.

## Current App Surface

- Package name: `web-cms`
- Runtime: TanStack Start on Vite with `@cloudflare/vite-plugin`
- Build and local scripts: `dev`, `build`, `preview`, `d1:generate`, `d1:migrate:local`, `cf-typegen`, `deploy`
- Current public auth UI routes: `/` and `/login`
- Current dashboard routes: `/dashboard`, `/dashboard/media`, and `/dashboard/posts`
- Current server route surface: `/api/auth/*`
- Styling: Tailwind CSS v4 from `src/styles.css`
- UI primitives: shadcn-style components configured by `components.json` and stored under `src/components/ui/`
- App theming is handled through `src/components/theme-provider.tsx` and `src/components/theme-toggle.tsx`
- App-owned database integration: `src/integrations/db`, backed by shared schema source from `packages/db-schema`
- App-owned object storage integration: `src/integrations/r2`
- Worker bindings in `wrangler.jsonc`: `MAIN_DB`, `MAIN_KV`, and `MAIN_R2`
- Typed environment parsing lives under `src/integrations/appenv/`; `appenv` currently requires the Better Auth, Google OAuth, `BUCKET_NAME`, and R2 S3 credential values, and also supports optional client-side `VITE_APP_TITLE`
- Human-readable app guide: `README.md`

## Source Map

- `src/routes/`: file-based TanStack Router routes, including `/`, `/login`, `/dashboard`, `/dashboard/media`, `/dashboard/posts`, and `/api/auth/$`
- `src/features/dashboard-authentication/`: public auth pages, Google sign-in client actions, and feature-local auth UI split across `components/atoms`, `components/organisms`, `components/templates`, and route-facing page/layout entry files
- `src/features/dashboard/`: authenticated dashboard shell, dashboard navigation, dashboard account menu, and dashboard session loader, with centralized constants and navigation config in `lib/`, shell UI split across `components/molecules`, `components/templates`, and the stable `components/dashboard-shell.tsx` entrypoint
- `src/features/dashboard-home/`: dashboard landing page content rendered inside the authenticated shell, with the route-facing page entrypoint delegating to a feature-local template
- `src/features/dashboard-media-library/`: authenticated media-library page, TanStack Form-managed upload/filter/tag-edit flows, upload/list/delete server flows, and media-specific helpers, with page UI split across feature-local atomic component layers plus the stable `components/media-library-page.tsx` entrypoint
- `src/features/dashboard-post-list/`: authenticated post-list page with TanStack Form-managed search/filter/pagination flows, server-side post listing and delete flows, with page UI split across feature-local atomic component layers plus the stable `components/post-list-page.tsx` entrypoint
- `src/features/*/hooks/`: feature-local hooks that keep component logic separate from component view files
- `src/integrations/auth/`: Better Auth server/client setup, adapter wiring, bootstrap-state and current-session server helpers, trusted-origin parsing, and bootstrap-user preparation
- `src/integrations/app/`: app-level server-only bootstrap helpers and canonical app-level data such as first-signup data seeding and the media mime type registry
- `src/integrations/db/`: app-owned Drizzle D1 client helper, Drizzle config, checked-in migrations under `migrations/`, and app-facing `getDB()`/`dbSchema` exports backed by `@repo/db-schema`
- `src/integrations/r2/`: Cloudflare R2 S3 client setup, app constants, shared types, and server-only repository helpers for presigned URLs and object access
- `src/integrations/appenv/`: typed environment parsing and Cloudflare worker binding access
- `src/integrations/tanstack-query/`: router/query integration and devtools wiring
- `src/components/`: shared app components such as theming and reusable UI primitives
- `src/hooks/`: app-local client hooks such as `use-mobile.ts` and `use-mounted.ts` used by shadcn-style primitives
- `src/lib/forms.ts`: app-local TanStack Form helpers for shared field props and submission error mapping
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
- The authenticated dashboard shell now renders the theme toggle and a `Cmd/Ctrl+K` command palette trigger in the header, a user account dropdown in the sidebar footer, and desktop sidebar behavior that hover-expands in icon-collapse mode and pins open when the non-menu sidebar layout is clicked, with current-user data threaded from the `/dashboard` route loader into the shell.
- Dashboard navigation is still mostly static mock CMS navigation, with route paths centralized in `src/features/dashboard/lib/constants.ts` and navigation items configured in `src/features/dashboard/lib/navigation.ts`. Both files include concrete `/dashboard/media` and `/dashboard/posts` entries.
- `src/features/dashboard-home/` currently owns the dashboard landing page content for `/dashboard/` while the shared shell remains reusable for additional dashboard routes.
- `src/features/dashboard-media-library/` owns the `/dashboard/media` route's upload, paginated list, signed preview, tag-filter, tag-edit, and delete flows, backed by D1 metadata plus R2 object storage.
- `src/features/dashboard-post-list/` owns the `/dashboard/posts` route's paginated list, signed cover-image preview, search, status filter, and delete flows, backed by D1 metadata (plus related media/mime-type joins) and R2 object storage for cover images.
- Feature-owned UI under `src/features/*/components/` now follows an atomic-design convention where route-facing `*-page.tsx` or layout entry files stay stable and delegate into only the needed `atoms`, `molecules`, `organisms`, and `templates` subfolders for that feature.
- The first successful bootstrap signup seeds app-owned lookup data, including the media library's supported `mime_types` rows, from the app-level media mime type registry under `src/integrations/app/media-mime-types.ts`.
- Public auth route behavior depends on whether the database already has users; `/` stays open only during bootstrap and otherwise redirects to `/login`.
- The first successful Google bootstrap sign-in creates the initial `superadmin` account and runs the initial app data seeding.
- `/login` redirects authenticated users to `/dashboard` before rendering the login page.
- The public authentication submit action is now managed through TanStack Form with a feature-local auth schema and form-level error rendering.
- Better Auth uses the shared `@repo/db-schema` schema re-exported through `src/integrations/db`, Google as the configured social provider, and Cloudflare KV as secondary storage in worker contexts; email and password is disabled and the `/sign-in/email` plus `/sign-up/email` paths are turned off so the public auth UI relies on Google sign-in only.
- Cloudflare R2 access is wrapped through the app-local `src/integrations/r2/` helpers, which use an S3 client configured from `BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` plus presigned URL and object helper utilities.
- The media-library search/filter, tag-edit, and upload flows are now managed through TanStack Form with feature-local schemas reused by the route search contract where applicable.
- `wrangler.jsonc` keeps the checked-in default D1 migrations under `src/integrations/db/migrations/`, while its `env.development` override currently points `MAIN_DB` at a `src/integrations/db/migrations/d1` path that is not checked in.
- No maintained `/api/public/*` route or `src/integrations/api/` module exists in this app today.

## graphify

When `graphify-out/` is present, use it as the repository's local knowledge graph.

Rules:

- Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` for god nodes and community structure when that file exists
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep when graphify outputs are available
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
