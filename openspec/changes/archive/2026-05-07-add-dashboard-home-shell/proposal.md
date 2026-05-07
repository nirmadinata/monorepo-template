## Why

The current `/dashboard` route proves that authentication succeeded, but it does not provide the reusable application shell that future CMS screens will need. Adding a feature-scoped dashboard home shell now creates a stable authenticated layout with navigation, keeps branding and theme controls consistent with the public auth experience, and gives later dashboard work a concrete place to plug into.

## What Changes

- Add a new `dashboard-home` feature under `apps/web-cms/src/features/` using the same folder shape as `dashboard-authentication`.
- Replace the current standalone dashboard landing page with an application shell that includes a top navbar and a collapsible grouped sidebar.
- Show the company name and the existing dark/light theme switcher in the dashboard navbar so authenticated pages share the same high-level brand controls as the login experience.
- Define example grouped sidebar navigation data where each top-level item can act as either a direct link or a parent that expands to reveal submenu links.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `dashboard-home`: Expand the authenticated dashboard landing route so it renders a reusable dashboard shell with navbar, collapsible sidebar, grouped menus, and example navigation states.

## Impact

- Affected code is primarily in `apps/web-cms/src/routes/dashboard.tsx`, a new `apps/web-cms/src/features/dashboard-home/` feature area, and shared UI composition that reuses the existing sidebar and theme-toggle components.
- No backend, auth provider, or database changes are required.
- Route and component tests should cover the authenticated shell, grouped navigation rendering, and the collapsible sidebar behavior at the component level.
