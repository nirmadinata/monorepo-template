## 1. Shared Shell

- [x] 1.1 Add root-level theme provider and globally mount the Sonner toaster in the top-right corner.
- [x] 1.2 Create a shared public auth layout with a navbar, mock CMS name, dark/light switcher, and centered content area for unauthenticated routes.

## 2. Authentication Pages

- [x] 2.1 Simplify the welcome page to a minimal centered form with short bootstrap instructions and a Google sign-up button.
- [x] 2.2 Simplify the login page to a minimal centered form with short returning-user instructions and a Google sign-in button.
- [x] 2.3 Keep the simplified auth page implementation feature-scoped under `src/features/dashboard-authentication` and remove no-longer-needed page composition pieces.

## 3. Dashboard Flow

- [x] 3.1 Add a dashboard home route and minimal landing page for signed-in users.
- [x] 3.2 Add the minimum session-aware route protection needed so unauthenticated users are redirected from the dashboard home route to `/login`.
- [x] 3.3 Update Google auth callback targets so successful bootstrap and returning-user sign-in both land on the dashboard home route.

## 4. Validation

- [x] 4.1 Update or add route and component tests for the shared public layout, simplified auth pages, and dashboard redirect behavior.
- [x] 4.2 Run the narrowest useful app checks for `web-cms` and fix any issues introduced by the change.
