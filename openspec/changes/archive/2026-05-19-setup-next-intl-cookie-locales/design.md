## Context

`apps/web-landing` is a minimal App Router Next.js application running through OpenNext on Cloudflare. The package already includes `next-intl`, but the checked-in source still contains generated Paraglide artifacts under `src/paraglide`, including locale metadata that does not match the requested target languages. The requested behavior is a cookie-based language strategy for `en` and `id` only, with stable non-localized URLs.

Because this is an App Router app on Next 16, locale resolution on the server should use the async `cookies()` API and flow through a single request-level configuration path. The implementation also needs a small migration away from Paraglide so there is only one supported localization system in the package.

## Goals / Non-Goals

**Goals:**

- Establish `next-intl` as the only supported localization system in `apps/web-landing`.
- Support `en` and `id` messages with English as the default locale.
- Read the active locale from a cookie and keep URLs unchanged.
- Provide a simple way for users to change language and persist that choice.
- Remove leftover Paraglide-generated files and related configuration from the package.

**Non-Goals:**

- Adding locale-prefixed routes, domain-based locale mapping, or automatic locale negotiation from the pathname.
- Translating every future page or marketing surface in this change beyond the current app shell and home page needs.
- Preserving compatibility with Paraglide message files or keeping a dual i18n stack.

## Decisions

### Use request-scoped `next-intl` configuration backed by a locale cookie

The app will use `next-intl` request configuration to resolve the locale from a dedicated cookie, validate it against the supported locale list, and fall back to `en` when the cookie is missing or invalid.

Why this approach:

- It matches the requested cookie-based strategy and avoids route-level locale handling.
- It keeps locale resolution available to server components without duplicating parsing logic.
- It fits App Router rendering and keeps URLs stable for marketing pages.

Alternatives considered:

- `next-intl` routing strategy with locale prefixes: rejected because the user explicitly does not want routing-based locale handling.
- Reading locale only on the client from local storage: rejected because server-rendered content would not reliably match the user’s selected language.

### Store translations in app-local `next-intl` message catalogs for `en` and `id`

The app will add message files owned by `apps/web-landing` and load them through the request configuration so both server and client UI consume the same translations.

Why this approach:

- It keeps the localization data close to the app.
- It removes dependence on generated Paraglide artifacts.
- It scales cleanly as more landing-page copy is translated later.

Alternatives considered:

- Keeping generated Paraglide output as the source of truth: rejected because the requested change explicitly removes Paraglide.
- Hardcoding translated strings inside components: rejected because it does not provide a maintainable localization surface.

### Update language preference through an app-owned write path that sets the cookie and stays on the same route

The app will expose a small language-switching path, such as a server action or route handler, that validates `en` or `id`, writes the locale cookie, and re-renders the current page without locale redirects.

Why this approach:

- It centralizes cookie validation and persistence.
- It works with stable non-localized URLs.
- It keeps future locale controls simple to reuse.

Alternatives considered:

- Writing the cookie only from client JavaScript utilities: rejected because it spreads locale persistence logic across the UI.
- Full page navigation to locale-prefixed URLs: rejected because the change explicitly avoids routing strategy.

### Remove Paraglide assets completely instead of leaving them dormant

The implementation will delete `src/paraglide` and any app-local references or config tied to Paraglide so the package has one clear i18n path.

Why this approach:

- It prevents confusion about which localization system is active.
- It removes stale locale definitions such as the current generated `de` locale.
- It reduces maintenance burden and accidental drift.

Alternatives considered:

- Leaving Paraglide files unused in the repository: rejected because they would continue to misrepresent the package’s supported localization approach.

## Risks / Trade-offs

- Invalid or missing locale cookie could produce inconsistent language selection expectations -> Validate against the supported locale list and fall back to `en` consistently.
- Cookie writes may not occur from every rendering context -> Centralize writes in one supported mutation path and keep reads in request config.
- Removing generated Paraglide files could break hidden imports if any remain -> Search the package for Paraglide references and remove or replace them during implementation.
- Stable URLs mean there is no locale-specific pathname for crawlers or link sharing -> Accept this trade-off because the requested strategy prioritizes cookie-based persistence over route-based locale addressing.

## Migration Plan

1. Add the supported locale constants, message catalogs, and `next-intl` request configuration.
2. Update the root layout and any translated UI to use `next-intl` providers and translation hooks/utilities.
3. Add the language-switching write path that sets the locale cookie for `en` and `id`.
4. Remove `src/paraglide` and any remaining Paraglide-related references or config.
5. Validate the app in development or build mode to confirm the landing page renders in both languages with unchanged URLs.

Rollback strategy:

- Revert the change set to restore the previous app state if the new localization path breaks rendering.
- No data migration is required because locale persistence is cookie-based and ephemeral.

## Open Questions

- None at proposal time; the requested languages and cookie-based strategy are explicit.
