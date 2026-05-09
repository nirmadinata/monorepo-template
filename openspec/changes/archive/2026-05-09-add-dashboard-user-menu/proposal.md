## Why

The authenticated dashboard shell already establishes the app's navigation and theme controls, but it still lacks the standard account affordance users expect in a shadcn-style admin interface. Showing the signed-in user's name and email in the header gives clear session context, and attaching a clean account dropdown provides an obvious place for sign-out and future profile actions.

## What Changes

- Update the authenticated dashboard header to include a compact account trigger that displays the current user's name and email.
- Add a top-aligned account dropdown menu in the dashboard header using the existing shadcn-style dropdown and avatar primitives.
- Wire the dropdown to include a working sign-out action and a placeholder profile menu item that is presentational for now.
- Thread the authenticated user data already available from the dashboard session loader into the shell so header account UI stays route-aware and feature-scoped.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `dashboard-home`: Extend the authenticated dashboard shell so it shows the signed-in user's identity in the header and provides an account dropdown with sign-out and a placeholder profile action.

## Impact

- Affected code is primarily in `apps/web-cms/src/features/dashboard-home/components/`, `apps/web-cms/src/routes/dashboard.tsx`, and related dashboard tests.
- No database or auth schema changes are required because the session already includes user name and email.
- Validation should cover account identity rendering, dropdown placement/content, and the sign-out interaction path at the component level.
