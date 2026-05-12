## Why

`apps/web-cms` already depends on `@tanstack/react-form`, but the current auth and dashboard interactions still use ad-hoc local state, click handlers, and manual toast/error wiring instead of a consistent form state model. A dedicated change is needed now because new dashboard capabilities are landing on top of these patterns, and continuing without a shared form contract will make validation, schema reuse, and error handling drift across the app.

## What Changes

- Introduce a shared `web-cms-form-flows` capability that defines how `apps/web-cms` form interactions use TanStack Form for field state, submission state, schema-based validation, and surfaced errors.
- Migrate existing dashboard-authentication interactions to TanStack Form patterns so auth actions no longer depend on button-only pending state and one-off error handling.
- Migrate current dashboard media-library form surfaces, including upload selection, search/filter controls, and tag editing, to TanStack Form with explicit schema-backed values and submission feedback.
- Establish reusable app-local form helpers or conventions for mapping schema validation failures and server errors into field-level and form-level UI feedback.
- Keep the current route structure, Better Auth integration, and media-library server workflows intact while changing the client-side form contract used to drive them.

## Capabilities

### New Capabilities

- `web-cms-form-flows`: Shared TanStack Form-driven form behavior for `apps/web-cms`, including schema-based validation, submission state, and consistent field/form error handling across auth and dashboard forms.
- `dashboard-media-library-form-interactions`: TanStack Form-managed upload, filter, and tag-edit flows for the dashboard media library.

### Modified Capabilities

- `dashboard-authentication-pages`: Authentication page interactions change from direct button actions to TanStack Form-managed submission flows with schema-backed form state and visible submission errors.

## Impact

- Affected code: `apps/web-cms/src/features/dashboard-authentication/`, `apps/web-cms/src/features/dashboard-media-library/`, and any shared UI or helper code added for app-local form composition.
- Dependencies: reuses the existing `@tanstack/react-form` and `zod` dependencies already installed in `apps/web-cms`.
- Systems: authentication UI flows, dashboard media-library interactions, and shared toast/error feedback behavior for client-triggered form submissions.
