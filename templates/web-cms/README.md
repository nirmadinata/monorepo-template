# web-cms

`apps/web-cms` is the repository's maintained TanStack Start application. It runs on Cloudflare Workers, serves the public authentication UI and protected dashboard shell, exposes the Better Auth API route, and includes a dashboard media library backed by D1 and R2.

## What Exists Today

- Public auth UI routes at `/` and `/login`
- Protected dashboard shell at `/dashboard`
- Protected media-library route at `/dashboard/media`
- Better Auth mounted at `/api/auth/*`
- App-owned D1, KV, and R2 integrations configured through `wrangler.jsonc`
- Media-library upload, paginated browse, signed preview, tag filtering/editing, and hard-delete flows under `src/features/dashboard-media-library/`

## Commands

Run these from `apps/web-cms/` unless noted otherwise.

| Command                    | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `bun run dev`              | Start the local Vite development server on port 3000 |
| `bun run build`            | Build the app for production                         |
| `bun run preview`          | Preview the built app locally                        |
| `bun run d1:generate`      | Generate Drizzle migrations from the current schema  |
| `bun run d1:migrate:local` | Apply D1 migrations to the local Worker state        |
| `bun run cf-typegen`       | Regenerate Wrangler/Cloudflare types                 |
| `bun run deploy`           | Build and deploy the app with Wrangler               |

From the repository root, `bun run dev`, `bun run build`, `bun run check`, and `bun run fix` operate across the workspace.

There is currently no maintained workspace test task.

## Environment And Bindings

The app's typed environment parsing lives in `src/integrations/appenv/`.

`.env.example` currently documents these server environment variables:

- `BUCKET_NAME`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_TRUSTED_ORIGINS`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

The typed environment parser in `src/integrations/appenv/` also accepts:

- optional client-side `VITE_APP_TITLE`

Cloudflare Worker bindings are configured in `wrangler.jsonc`:

- `MAIN_DB` for the app-owned D1 database
- `MAIN_KV` for Better Auth secondary storage
- `MAIN_R2` for app-owned object storage

Current caveat:

- Checked-in D1 migrations currently live under `src/integrations/db/migrations/`, while `wrangler.jsonc`'s `env.development` override points `MAIN_DB` at a `src/integrations/db/migrations/d1` path that is not checked in

## Important Paths

- `src/routes/`: file-based TanStack Router routes for public pages, dashboard pages, and the auth API
- `src/features/dashboard-authentication/`: public auth pages and Google sign-in UI
- `src/features/dashboard/`: dashboard shell, navigation, account menu, and session-gated shell helpers
- `src/features/dashboard-home/`: dashboard landing page content rendered inside the shell
- `src/features/dashboard-media-library/`: media-library page, upload/list/delete server flows, and media-specific helpers
- `src/integrations/auth/`: Better Auth server/client setup plus bootstrap-state and session helpers
- `src/integrations/db/`: D1 schema, Drizzle config, migrations, and app-facing DB helpers
- `src/integrations/appenv/`: typed environment parsing and Cloudflare Worker binding access
- `src/integrations/r2/`: Cloudflare R2 S3 client setup, shared types, constants, and repository helpers
- `src/components/ui/`: shared UI primitives configured through `components.json`
- `src/components/theme-provider.tsx` and `src/components/theme-toggle.tsx`: app theming and the dashboard theme toggle

## Auth Notes

- Authentication is Google-only through Better Auth in this app today.
- The first successful Google user bootstrap creates the initial `superadmin` account.
- The dashboard shell is protected through `src/features/dashboard/server/get-dashboard-session.ts`.
- The app's maintained server route surface is Better Auth at `/api/auth/*`; no `/api/public/*` namespace exists today.
- The media library at `/dashboard/media` uses runtime-seeded `mime_types`, direct-to-R2 uploads with D1 finalize, newest-first pagination, signed preview URLs, tag filters/editing, and hard delete.
- Cloudflare R2 access is wrapped through `src/integrations/r2/`, which uses an S3 client configured from `BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY`.

## Documentation

- Read the repository root `AGENTS.md` before editing anything in this app.
- Read `apps/web-cms/AGENTS.md` for app-specific agent context.
- See `docs/README.md` for the repository's human-readable documentation index.
