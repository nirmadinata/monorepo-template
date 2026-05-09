## 1. Dashboard Header Account UI

- [x] 1.1 Add a feature-scoped dashboard account menu component that composes the existing avatar and dropdown primitives into a shadcn-style user trigger.
- [x] 1.2 Show the signed-in user's display name and email in the dashboard header trigger, including a sensible fallback when the name is unavailable.
- [x] 1.3 Configure the dropdown to open above the trigger and include `Profile` and `Sign out` menu entries with clean, restrained styling.

## 2. Dashboard Session Wiring

- [x] 2.1 Thread the authenticated dashboard user from the `/dashboard` route loader into `DashboardShell` so the header can render account state without duplicating session reads.
- [x] 2.2 Keep the existing dashboard content rendering and auth-gated route behavior unchanged aside from the new header account control.

## 3. Account Actions

- [x] 3.1 Wire the `Sign out` menu item to the existing Better Auth client so users can end their session from the dashboard header.
- [x] 3.2 Leave `Profile` presentational only for now without introducing a new route or unfinished backend behavior.

## 4. Validation

- [x] 4.1 Add or update dashboard component tests for user identity rendering, top-side dropdown content, and sign-out interaction.
- [x] 4.2 Run the narrowest useful `web-cms` validation for the dashboard account menu change and fix any issues introduced by the work.
