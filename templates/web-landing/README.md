# web-landing

`apps/web-landing` is a maintained Next.js 16 App Router application that runs through OpenNext on Cloudflare Workers. Today it serves a public landing page with cookie-based `next-intl` localization for English and Indonesian while keeping URLs unchanged.

## What Exists Today

- Public landing page at `/`
- Shared `PublicShell` layout with sticky header, mobile navigation, and footer resources
- Cookie-based locale switching between `en` and `id`
- `next-intl` request configuration with English fallback for missing or invalid locale cookies
- App-owned message catalogs under `src/messages/`
- OpenNext Cloudflare deployment and preview workflow
- Cloudflare Worker bindings for static assets, image optimization, and worker self-reference

## Commands

Run these from `apps/web-landing/` unless noted otherwise.

| Command              | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `bun run dev`        | Start the Next.js development server                |
| `bun run build`      | Build the app for production                        |
| `bun run start`      | Start the production Next.js server                 |
| `bun run preview`    | Build and preview the app on the Cloudflare runtime |
| `bun run upload`     | Build and upload the Cloudflare bundle              |
| `bun run deploy`     | Build and deploy the app to Cloudflare              |
| `bun run cf-typegen` | Regenerate Wrangler/Cloudflare types                |

From the repository root, `bun run dev`, `bun run build`, `bun run check`, and `bun run fix` operate across the workspace.

There is currently no maintained workspace test task.

## Important Paths

- `src/app/layout.tsx`: localized metadata plus `NextIntlClientProvider` wiring
- `src/app/page.tsx`: landing page content rendered from translation catalogs
- `src/app/actions.ts`: locale-switching server action that writes the `NEXT_LOCALE` cookie
- `src/components/language-switcher.tsx`: language switcher UI
- `src/components/public-shell.tsx`: shared responsive public shell with header, mobile menu, main content area, and footer
- `src/components/public-shell-navigation.ts`: shared landing-page anchor navigation and footer resource link definitions
- `src/i18n/`: supported locale constants, request config, and message mapping
- `src/messages/`: English and Indonesian translation catalogs
- `next.config.ts`: `next-intl` plugin configuration plus OpenNext dev support
- `open-next.config.ts`: OpenNext Cloudflare config
- `wrangler.jsonc`: Worker entrypoint and `ASSETS`, `IMAGES`, `WORKER_SELF_REFERENCE` bindings

## Localization Notes

- Supported locales are `en` and `id`
- `en` is the default locale
- Locale preference is stored in the `NEXT_LOCALE` cookie
- URLs stay stable; the app does not use locale-prefixed routing
- Server and client UI both read from the same app-owned `next-intl` message catalogs

## Documentation

- Read the repository root `AGENTS.md` before editing anything in this app.
- Read `apps/web-landing/AGENTS.md` for app-specific agent context.
- See `docs/README.md` for the repository's human-readable documentation index.
