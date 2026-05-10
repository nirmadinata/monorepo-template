## Why

The current `dashboard-home` feature mixes two concerns: the reusable authenticated dashboard shell and the dashboard landing page content that will evolve separately over time. Splitting those responsibilities now makes the shell easier to reuse across future dashboard routes and keeps the home feature focused on the actual dashboard home experience.

## What Changes

- Introduce a dedicated dashboard shell capability that owns the authenticated layout, including the dashboard navbar, sidebar, shared navigation structure, and session-gated shell rendering.
- Narrow the existing `dashboard-home` capability so it covers the dashboard landing page content rendered inside the shell rather than the shell itself.
- Move current shell-oriented code in `apps/web-cms` from `src/features/dashboard-home/` into a separate dashboard feature area and update route imports, tests, and documentation to match the new ownership.
- Update agent and app documentation so the documented feature boundaries match the codebase after the split.

## Capabilities

### New Capabilities

- `dashboard`: The authenticated dashboard application shell, including the navbar, sidebar, shared navigation, account affordances, and session-gated route wrapper for dashboard routes.

### Modified Capabilities

- `dashboard-home`: Limit the capability to the authenticated dashboard landing page content that renders within the dashboard shell, instead of owning the shell layout itself.

## Impact

- Affected code is primarily in `apps/web-cms/src/features/dashboard-home/`, `apps/web-cms/src/routes/dashboard*.tsx`, and related dashboard component and session tests.
- OpenSpec artifacts will add a new `dashboard` capability and update the existing `dashboard-home` requirements to reflect the new boundary.
- App documentation in `AGENTS.md` and `README.md` will need updates so feature ownership is described accurately.
