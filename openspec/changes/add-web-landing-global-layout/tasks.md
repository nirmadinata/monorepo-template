## 1. Shared Shell Structure

- [x] 1.1 Create reusable `web-landing` shell components for the navbar, sidebar, footer, and shared navigation data.
- [x] 1.2 Update `src/app/layout.tsx` to wrap public route content in the shared shell while preserving existing metadata and `next-intl` provider wiring.

## 2. Route Integration

- [x] 2.1 Refactor `src/app/page.tsx` so the homepage renders route-specific content inside the shared shell instead of owning the full page frame.
- [x] 2.2 Add any new localized shell copy needed by the shared navigation and footer to both `en` and `id` message catalogs.

## 3. Responsive Behavior And Validation

- [x] 3.1 Update `src/app/globals.css` and component styling so the navbar, sidebar, content area, and footer remain usable on mobile and desktop viewports.
- [x] 3.2 Run the narrowest useful `web-landing` validation and verify the shell layout, navigation access, and language switcher behavior across responsive breakpoints.
