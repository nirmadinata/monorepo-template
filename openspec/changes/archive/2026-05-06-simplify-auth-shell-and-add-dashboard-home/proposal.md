## Why

The current welcome and login experiences are more elaborate than needed for the CMS bootstrap flow and do not provide a shared unauthenticated shell or a first dashboard landing route. Simplifying these routes now keeps the public entry points focused, establishes a reusable layout for unauthenticated pages, and closes the gap between successful sign-in and the in-app dashboard experience.

## What Changes

- Simplify the welcome and login pages to a minimal centered card with short instructions and a Google authentication button.
- Add a shared unauthenticated layout for public auth routes with a left-aligned CMS brand label and a right-aligned dark/light theme switcher.
- Mount a global Sonner toaster in the app shell so toast notifications can appear in the top-right corner from any route.
- Add a dashboard home page and update the auth callback flow so successful sign-in lands on the dashboard instead of returning to the public auth routes.

## Capabilities

### New Capabilities

- `dashboard-home`: Provide an authenticated dashboard landing page that acts as the initial in-app destination after sign-in.
- `global-toast-feedback`: Provide a globally mounted toast surface that can display notifications in the top-right corner.

### Modified Capabilities

- `dashboard-authentication-pages`: Simplify the welcome and login experiences and add a shared unauthenticated layout with theme controls.
- `web-cms-authentication`: Change post-auth routing so successful sign-in enters the dashboard home experience.

## Impact

- Affected code is primarily in `apps/web-cms/src/routes`, `apps/web-cms/src/features/dashboard-authentication`, the root app shell/providers, and shared UI composition for theme and toast behavior.
- Existing Better Auth server behavior remains in place, but auth client callback targets and route expectations change.
- New route coverage and page-level tests will be needed for the public shell and dashboard landing behavior.
