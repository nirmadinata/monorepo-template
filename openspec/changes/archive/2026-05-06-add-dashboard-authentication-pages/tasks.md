## 1. Feature foundation

- [x] 1.1 Create `apps/web-cms/src/features/dashboard-authentication/` with `components`, `hooks`, `lib`, and `server` subfolders.
- [x] 1.2 Add the feature-level bootstrap-state server function and any colocated input/output schemas or utility helpers needed by the auth pages.
- [x] 1.3 Add thin route-level composition so `apps/web-cms/src/routes/index.tsx` becomes the welcome entry route and a new login route delegates to the feature.

## 2. Authentication behavior

- [x] 2.1 Extend the existing Better Auth bootstrap user-creation flow to persist `role: "superadmin"` for the first created user.
- [x] 2.2 Expose any auth client or feature hook helpers needed to trigger Google sign-in consistently from the welcome and login pages.
- [x] 2.3 Keep bootstrap availability checks server-authoritative so the UI cannot bypass the first-user-only guard.

## 3. Auth page UI

- [x] 3.1 Build the first-user welcome page from composed feature components that reuse existing shadcn primitives from `apps/web-cms/src/components/ui`.
- [x] 3.2 Build the registered-user login page from the same feature system with Google sign-in actions and returning-user copy.
- [x] 3.3 Keep the implementation aligned with clean code, atomic design, and component composition by isolating page sections, button composition, and view helpers inside the feature.

## 4. Verification

- [x] 4.1 Add focused tests for bootstrap-state reads and first-user `superadmin` assignment.
- [x] 4.2 Add route or component-level tests covering the welcome-page versus login-page behavior.
- [x] 4.3 Run the narrowest relevant `apps/web-cms` validation for the implemented auth feature and fix any regressions.
