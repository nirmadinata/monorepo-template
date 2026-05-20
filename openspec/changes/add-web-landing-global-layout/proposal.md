## Why

The `web-landing` app currently renders the homepage as a single page-level composition without a reusable global shell. Adding a shared navbar, responsive sidebar, and footer now creates a consistent layout foundation for future landing pages while improving navigation on smaller screens.

## What Changes

- Add a reusable public app shell for `apps/web-landing` that wraps page content with a shared navbar, sidebar, and footer.
- Define responsive behavior so navigation stays usable across mobile, tablet, and desktop layouts.
- Keep the existing cookie-based locale flow working inside the shared shell, including the current language switcher.
- Refactor the current homepage to render within the shared shell instead of owning all top-level structure itself.

## Capabilities

### New Capabilities

- `web-landing-global-layout`: A reusable responsive layout shell for public `web-landing` routes with shared navigation and footer structure.

### Modified Capabilities

- `web-landing-localization`: The shared shell must continue to expose the existing locale switcher and localized copy without changing the cookie-based routing model.

## Impact

- Affected code: `apps/web-landing/src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and new shared layout components under `src/components/`
- Affected systems: `next-intl` message usage in the landing app shell and homepage
- No new external APIs or runtime dependencies are required
