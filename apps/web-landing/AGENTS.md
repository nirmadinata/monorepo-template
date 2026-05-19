# apps/web-landing AGENTS Guide

Read the root `AGENTS.md` before working in this app. This file adds app-specific context for `apps/web-landing`.

## App Purpose

`apps/web-landing` is a maintained Next.js App Router landing page that runs through OpenNext on Cloudflare Workers. Today it serves a single public landing page with cookie-based `next-intl` localization for English and Indonesian.

## Current App Surface

- Package name: `web-landing`
- Runtime: Next.js 16 App Router with OpenNext Cloudflare integration
- Build and local scripts: `dev`, `build`, `start`, `deploy`, `upload`, `preview`, `cf-typegen`
- Current route surface: `/` plus the framework not-found page
- Styling: Tailwind CSS v4 via `src/app/globals.css`
- Localization: `next-intl` with a cookie-based locale strategy, stable URLs, default `en`, and supported locales `en` and `id`
- Locale persistence cookie: `NEXT_LOCALE`
- Human-readable app guide: `README.md`
- Worker bindings in `wrangler.jsonc`: `ASSETS`, `IMAGES`, and `WORKER_SELF_REFERENCE`

## Source Map

- `src/app/layout.tsx`: root HTML shell, localized metadata, and `NextIntlClientProvider` wiring
- `src/app/page.tsx`: landing page content rendered from localized message catalogs
- `src/app/actions.ts`: server action that validates locale changes, writes the locale cookie, and redirects back to the current route
- `src/components/language-switcher.tsx`: client language control for switching between English and Indonesian
- `src/i18n/config.ts`: supported locale constants and cookie configuration
- `src/i18n/messages.ts`: locale-to-message-catalog mapping
- `src/i18n/request.ts`: request-scoped `next-intl` config using the locale cookie with English fallback
- `src/messages/`: app-owned `next-intl` message catalogs for `en` and `id`
- `next.config.ts`: OpenNext dev setup plus `next-intl` plugin wiring
- `open-next.config.ts`: Cloudflare OpenNext config
- `wrangler.jsonc`: Worker entrypoint and Cloudflare bindings
- `README.md`: human-readable app overview and command reference

## Editing Rules

1. Keep localization cookie-based; do not introduce locale-prefixed routing unless a new change explicitly requires it.
2. If you add locales, change scripts, or change Worker bindings, update this file in the same change.
3. Keep app-specific details here and leave shared workspace guidance in the root `AGENTS.md`.
