## 1. Feature Scaffold

- [x] 1.1 Create `apps/web-cms/src/features/dashboard-home/` with `components`, `hooks`, `lib`, and `server` folders to match `dashboard-authentication`.
- [x] 1.2 Move dashboard-home page composition out of `src/routes/dashboard.tsx` into feature-scoped components while keeping the existing session-gated route loader behavior.

## 2. Dashboard Shell

- [x] 2.1 Build an authenticated dashboard shell with a navbar, content area, and collapsible sidebar using the existing shared sidebar primitives.
- [x] 2.2 Add navbar branding with the company name and reuse the existing `ThemeToggle` in the authenticated shell.
- [x] 2.3 Define example grouped sidebar menu data where top-level entries can be direct links or expandable parents with submenu items.

## 3. Dashboard Home Content

- [x] 3.1 Render the dashboard landing content inside the new shell and preserve the signed-in confirmation for the current user.
- [x] 3.2 Add example grouped navigation rendering that demonstrates both direct-link and nested-menu states without requiring new backend routes.

## 4. Validation

- [x] 4.1 Add or update component and route tests for navbar controls, grouped sidebar rendering, collapse behavior, and unauthenticated redirect handling.
- [x] 4.2 Run the narrowest useful `web-cms` checks for the dashboard-home change and fix any issues introduced by the work.
