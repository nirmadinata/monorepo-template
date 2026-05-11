# Features Overview

This repository currently maintains one runtime app and no maintained workspace packages.

## Workspace Summary

| Surface             | Location                                                           | Current purpose                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maintained app      | `apps/web-cms`                                                     | TanStack Start app on Cloudflare Workers with auth UI, protected dashboard shell, dashboard media library, Better Auth API route, and public API foundation |
| Maintained packages | `packages/`                                                        | None today                                                                                                                                                  |
| Change workflow     | `openspec/`                                                        | Proposal, design, spec, task, apply, and archive workflow                                                                                                   |
| Human-readable docs | `docs/`                                                            | Curated project docs for humans and AI agents                                                                                                               |
| Agent tooling       | `.opencode/`, `.agents/`, `.github/skills/`, `.claude/`, `.codex/` | Local command, prompt, and skill surfaces                                                                                                                   |

## `apps/web-cms` Runtime Map

### Public Authentication UI

- Routes: `/` and `/login`
- Code: `src/features/dashboard-authentication/`
- Purpose: first-user bootstrap welcome flow plus returning-user login UI

### Protected Dashboard Shell

- Route: `/dashboard`
- Code: `src/features/dashboard/`
- Purpose: authenticated shell, mostly static dashboard navigation, header theme toggle, account menu, and session-gated shell wrapper

### Dashboard Home Content

- Route: `/dashboard/`
- Code: `src/features/dashboard-home/`
- Purpose: authenticated dashboard landing page content rendered inside the shared dashboard shell

### Dashboard Media Library

- Route: `/dashboard/media`
- Code: `src/features/dashboard-media-library/`
- Purpose: authenticated media upload, paginated browse, signed preview access, tag filtering/editing, and hard delete backed by D1 metadata plus R2 object storage

### Better Auth Integration

- Route surface: `/api/auth/*`
- Code: `src/integrations/auth/`
- Purpose: Google-only Better Auth server/client setup, bootstrap-state lookup, and current-session helpers

### Public API Foundation

- Route surface: `/api/public/*`
- Code: `src/integrations/api/`
- Purpose: shared Hono OpenAPI app with a system route, OpenAPI JSON, and Scalar docs

### Data Access, Storage, And Bindings

- Code: `src/integrations/db/`, `src/integrations/r2/`, and `src/integrations/appenv/`
- Purpose: D1 schema, Drizzle config, migrations, media/tag MIME metadata tables, app DB helpers, Cloudflare R2 S3 client and repository helpers, and typed Worker binding access
- Current Worker bindings: `MAIN_DB`, `MAIN_KV`, `MAIN_R2`

## Documentation Surfaces

- `AGENTS.md`: canonical agent-facing repo guide
- `apps/web-cms/AGENTS.md`: app-specific agent context
- `docs/README.md`: human-readable docs index
- `apps/web-cms/README.md`: human-readable app guide

## What Does Not Exist Today

- No maintained runtime packages under `packages/`
- No additional maintained apps under `apps/`
- No multi-app docs hierarchy beyond the single `web-cms` app surface
