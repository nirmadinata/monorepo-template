## 1. Feature Boundary Refactor

- [x] 1.1 Create a new `apps/web-cms/src/features/dashboard/` feature area for the authenticated dashboard shell concerns.
- [x] 1.2 Move `DashboardShell`, dashboard navigation helpers, account-menu UI, and `getDashboardSession()` into the new `dashboard` feature without changing runtime behavior.
- [x] 1.3 Leave `apps/web-cms/src/features/dashboard-home/` focused on the dashboard landing page component and any home-specific code only.

## 2. Route And Test Updates

- [x] 2.1 Update `src/routes/dashboard.tsx` to import the shell and session loader from `dashboard` while keeping `src/routes/dashboard.index.tsx` pointed at the home-page component.
- [x] 2.2 Update or move dashboard component and server tests so shell tests live with `dashboard` and home-page tests stay with `dashboard-home`.
- [x] 2.3 Run the narrowest useful `web-cms` validation for the refactor and fix any issues introduced by the feature split.

## 3. Spec And Documentation Alignment

- [x] 3.1 Implement the new `dashboard` capability described in this change by ensuring the codebase structure matches the new shell ownership.
- [x] 3.2 Update the existing `dashboard-home` implementation and references so it reflects landing-page ownership only.
- [x] 3.3 Update `apps/web-cms/AGENTS.md`, the root `AGENTS.md`, and `apps/web-cms/README.md` so they describe the dashboard shell and dashboard home boundaries accurately.
