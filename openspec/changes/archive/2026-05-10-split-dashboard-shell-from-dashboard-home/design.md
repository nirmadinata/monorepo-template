## Context

`apps/web-cms` currently places the authenticated dashboard shell, sidebar navigation, account menu, dashboard session loader, and dashboard landing page in one feature directory: `src/features/dashboard-home/`. The route structure already separates the shell boundary from the landing page boundary at `src/routes/dashboard.tsx` and `src/routes/dashboard.index.tsx`, but the feature naming does not reflect that split.

This causes two problems. First, code that really belongs to a reusable dashboard shell reads as if it only exists for the home page. Second, the existing OpenSpec `dashboard-home` capability currently bundles shell requirements and landing-page requirements together, which makes future home-page work harder to reason about independently from the shared shell.

## Goals / Non-Goals

**Goals:**

- Create a dedicated dashboard shell capability and implementation area that owns the authenticated shell layout.
- Keep `dashboard-home` focused on the landing page content rendered at `/dashboard`.
- Update route imports, tests, specs, and documentation so the new boundary is consistent across code and docs.
- Preserve existing runtime behavior while changing ownership and naming.

**Non-Goals:**

- Redesign the dashboard UI or navigation behavior.
- Introduce new dashboard routes beyond the current `/dashboard` home route.
- Change auth rules, session payloads, or API behavior.
- Expand the dashboard home page with new business features.

## Decisions

### Split the feature by responsibility, not by route file

The new `dashboard` feature should own `DashboardShell`, navigation helpers, account-menu composition, and `getDashboardSession()`, because these concerns define the authenticated dashboard chrome shared by dashboard routes. `dashboard-home` should keep only the landing page component and any future home-specific hooks or helpers.

Alternative considered: keep the current directory and only rename components. Rejected because the main problem is feature ownership, not just component naming, and route-level imports would still point at a misleading feature boundary.

### Keep the `/dashboard` route split exactly as it is

`src/routes/dashboard.tsx` should remain the shell route boundary that loads the authenticated session and wraps nested content, while `src/routes/dashboard.index.tsx` should remain the home-page route that renders landing-page content within that shell. The change only updates which feature each route imports from.

Alternative considered: collapse both routes into a single route during the refactor. Rejected because the current route split already models the desired shell/content layering and avoids mixing refactor scope with route restructuring.

### Create a new `dashboard` spec and narrow `dashboard-home`

OpenSpec should mirror the code ownership change. The new `dashboard` spec should capture requirements for the authenticated shell, navbar, sidebar, navigation, account affordances, and session-gated dashboard wrapper. The existing `dashboard-home` spec should be rewritten so it only covers the authenticated landing page content at `/dashboard/` as rendered inside the shell.

Alternative considered: leave the existing spec as-is and treat the split as implementation-only. Rejected because the current requirement text explicitly assigns shell behavior to `dashboard-home`, which would leave the spec contract inaccurate after the refactor.

### Update app documentation in the same change

`AGENTS.md` and `README.md` currently describe `src/features/dashboard-home/` as owning the shell. Those docs should be updated as part of this change so future work starts from accurate feature boundaries.

Alternative considered: defer documentation cleanup to a later documentation-only change. Rejected because the repository guidance explicitly requires `AGENTS.md` updates when working context changes.

## Risks / Trade-offs

- Import-path churn across routes, tests, and docs could leave stale references behind -> Update all known references in one change and validate with narrow app checks.
- The boundary between shell-owned user/session concerns and home-page concerns could still blur later -> Keep `getDashboardSession()` and shell composition in `dashboard` so future routes have a clear shared entry point.
- Spec rewrites can accidentally drop useful existing expectations -> Move shell-oriented requirements into the new `dashboard` spec and keep only home-page-specific behavior in `dashboard-home`.

## Migration Plan

Move shell-owned files into a new `src/features/dashboard/` area, update imports and tests, then update the matching OpenSpec capabilities and app documentation in the same change. Because runtime behavior stays the same, deployment is a normal no-migration release. Rollback is a straightforward revert of the feature move and documentation/spec updates.

## Open Questions

- None. The requested boundary is specific enough to define the feature split and spec ownership now.
