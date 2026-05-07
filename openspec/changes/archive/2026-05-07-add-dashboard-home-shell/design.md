## Context

`apps/web-cms` already has authenticated route protection on `/dashboard`, an existing `ThemeToggle`, and a shared sidebar primitive under `src/components/ui/sidebar.tsx`. The current dashboard route is still a one-off landing page, and there is no feature-scoped authenticated shell that later dashboard sections can reuse.

The requested change is mostly frontend composition, but it crosses route structure, feature organization, and reusable navigation behavior. The implementation also needs to follow the repository preference for feature-scoped organization by introducing `src/features/dashboard-home/` with the same top-level folder layout used by `dashboard-authentication`.

## Goals / Non-Goals

**Goals:**

- Add a `dashboard-home` feature folder that mirrors the same `components`, `hooks`, `lib`, and `server` structure used by `dashboard-authentication`.
- Replace the current `/dashboard` page body with an authenticated application shell that includes a navbar and collapsible sidebar.
- Reuse the existing `ThemeToggle` in the navbar and show the company name there so authenticated pages keep the same brand-level controls as public auth pages.
- Provide example grouped navigation data where each top-level menu item can either link directly or expand into submenu items.

**Non-Goals:**

- Add real content management screens beyond the dashboard home example content area.
- Introduce server-driven navigation, permissions-aware menus, or persisted user preferences for active navigation state.
- Change authentication logic, auth redirect rules, or database behavior.

## Decisions

### Keep the dashboard shell feature-scoped

The dashboard shell should live under `apps/web-cms/src/features/dashboard-home/` with the same top-level folders as `dashboard-authentication`. This keeps the route thin and makes later authenticated dashboard work land in one feature boundary instead of expanding `routes/dashboard.tsx` into a large page file.

Alternative considered: keep everything inline in `routes/dashboard.tsx`. Rejected because the user explicitly asked for a matching feature structure and the shell is likely to grow.

### Reuse the existing sidebar primitive instead of introducing a second shell abstraction

`src/components/ui/sidebar.tsx` already supports desktop collapse, mobile sheet behavior, grouped content, and nested menu primitives. The new feature should compose those existing pieces with route-aware links and lightweight example navigation data rather than building a custom sidebar from scratch.

Alternative considered: create bespoke shell and sidebar components without the shared primitive. Rejected because it duplicates existing UI infrastructure and increases maintenance.

### Model grouped navigation as declarative menu data with two top-level item variants

The shell should define example grouped navigation data in feature-local `lib` code. Each top-level item should be either a direct link item or a parent item with submenu links. Rendering from typed data keeps the example easy to extend and makes the grouped menu behavior explicit in one place.

Alternative considered: hardcode each sidebar section directly in JSX. Rejected because the request explicitly calls for examples of both direct links and parent menu items, and typed data makes those states clearer.

### Keep the navbar responsibilities narrow

The navbar should show the company name, sidebar trigger, and `ThemeToggle`, while the main content area continues to render the current dashboard welcome messaging or a slightly adapted equivalent. This satisfies the requested shell without widening scope into account menus, breadcrumbs, or profile actions.

Alternative considered: add a fuller SaaS header with user menu and secondary actions. Rejected because it adds scope that is not required for this change.

## Risks / Trade-offs

- Sidebar primitive complexity can make the first feature integration feel heavier than a hand-rolled layout -> Limit this change to straightforward composition of the existing primitives and example data.
- Example navigation may imply routes that do not exist yet -> Use clearly presentational example items and avoid wiring them to unavailable product behavior beyond safe placeholder links.
- Feature-folder symmetry with `dashboard-authentication` may create mostly empty folders at first -> Accept the light scaffolding because matching the requested boundary is part of the change.
- Navbar branding may drift from the login page if copy changes independently -> Reuse the same visible company name string used by the public auth layout.

## Migration Plan

No data or infrastructure migration is required. Deploy the new feature-scoped shell and updated `/dashboard` route together. If rollback is needed, restore the previous single-page dashboard route and remove the feature-scoped shell files.

## Open Questions

- None. The request is specific enough to implement with existing route protection, theme, and sidebar primitives.
