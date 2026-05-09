# web-cms

`apps/web-cms` is the repository's maintained TanStack Start application. It runs on Cloudflare Workers, serves the public authentication UI and protected dashboard shell, exposes the Better Auth API route, and mounts the public API foundation.

## What Exists Today

- Public auth UI routes at `/` and `/login`
- Protected dashboard shell at `/dashboard`
- Better Auth mounted at `/api/auth/*`
- Public API foundation mounted at `/api/public/*` with OpenAPI JSON and Scalar docs
- App-owned D1, KV, and R2 integrations configured through `wrangler.jsonc`

## Commands

Run these from `apps/web-cms/` unless noted otherwise.

| Command                    | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `bun run dev`              | Start the local Vite development server on port 3000 |
| `bun run build`            | Build the app for production                         |
| `bun run preview`          | Preview the built app locally                        |
| `bun run test`             | Run the app's Vitest suite                           |
| `bun run d1:generate`      | Generate Drizzle migrations from the current schema  |
| `bun run d1:migrate:local` | Apply D1 migrations to the local Worker state        |
| `bun run cf-typegen`       | Regenerate Wrangler/Cloudflare types                 |
| `bun run deploy`           | Build and deploy the app with Wrangler               |

From the repository root, `bun run dev`, `bun run build`, `bun run test`, `bun run check`, and `bun run fix` operate across the workspace.

## Environment And Bindings

Required server environment variables are documented in `.env.example`:

- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_TRUSTED_ORIGINS`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `PUBLIC_API_TITLE`
- `PUBLIC_API_VERSION`
- `PUBLIC_API_DESCRIPTION`

Cloudflare Worker bindings are configured in `wrangler.jsonc`:

- `MAIN_DB` for the app-owned D1 database
- `MAIN_KV` for Better Auth secondary storage
- `MAIN_R2` for app-owned object storage

## Important Paths

- `src/routes/`: file-based TanStack Router routes for public pages, dashboard pages, auth API, and public API
- `src/features/dashboard-authentication/`: public auth pages and Google sign-in UI
- `src/features/dashboard-home/`: dashboard shell, navigation, and authenticated route content
- `src/integrations/auth/`: Better Auth server/client setup plus bootstrap-state and session helpers
- `src/integrations/api/`: Hono OpenAPI app, system route, and Scalar docs
- `src/integrations/db/`: D1 schema, Drizzle config, migrations, and app-facing DB helpers
- `src/components/ui/`: shared UI primitives configured through `components.json`

## Auth And API Notes

- Authentication is Google-only through Better Auth in this app today.
- The first successful Google user bootstrap creates the initial `superadmin` account.
- The dashboard shell is protected through `src/features/dashboard-home/server/get-dashboard-session.ts`.
- The public API docs are served from `/api/public/`, with the OpenAPI document at `/api/public/openapi.json`.

## Documentation

- Read the repository root `AGENTS.md` before editing anything in this app.
- Read `apps/web-cms/AGENTS.md` for app-specific agent context.
- See `docs/README.md` for the repository's human-readable documentation index.
