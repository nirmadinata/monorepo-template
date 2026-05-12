## Context

`apps/web-cms` is a TanStack Start application that already ships with `@tanstack/react-form` and `zod`, but its current interactive surfaces are inconsistent. The authentication pages trigger Google sign-in through a button and a feature hook that manually manages pending state and toast errors. The dashboard media library mixes route-level search validation with uncontrolled search input, local state for tag editing, direct file-input change handling, and manual toast-based error reporting.

The requested change is cross-cutting rather than isolated to one route: all concrete form surfaces in `apps/web-cms` should move to a TanStack Form-first pattern with form schemas and consistent error handling. In the current app, the meaningful form surfaces are the authentication Google sign-in submission, media upload selection/finalize, media search and filters, and media tag editing. The design needs to standardize how schemas, client state, and server/action failures are represented without changing the underlying Better Auth or media-library server contracts unless necessary.

## Goals / Non-Goals

**Goals:**

- Define a single TanStack Form-centered pattern for interactive forms in `apps/web-cms`.
- Reuse schema definitions where practical so form defaults, validation, and route/server contracts do not drift.
- Surface validation problems and submission failures consistently at the field level or form level instead of relying only on generic toasts.
- Migrate the current auth and media-library form interactions with minimal route or server-API churn.
- Keep the implementation small enough to apply incrementally inside existing feature folders.

**Non-Goals:**

- Replacing Better Auth, changing OAuth provider behavior, or redesigning authentication routes.
- Rebuilding the dashboard media-library UX beyond the form-state and error-handling changes needed for TanStack Form adoption.
- Introducing a separate shared package for forms; the pattern can stay app-local inside `apps/web-cms`.
- Converting non-form interactions such as delete confirmations into TanStack Form when a simple confirm action remains more appropriate.

## Decisions

### 1. Treat TanStack Form as the default state model for every user-editable form surface

The app should stop mixing uncontrolled inputs, ad-hoc local state, and button-only action handlers for form-like interactions. Every concrete user-editable form surface in `apps/web-cms` should have a TanStack Form instance that owns values, touched state, submit state, and error state.

This applies to the current app surfaces as follows:

- the Google auth action becomes a submit flow driven by a TanStack Form instance even if the only meaningful field is the form intent;
- media search and filters become one form-backed state object instead of separate handlers per input;
- media tag editing becomes a form with normalized tag input derived from schema-backed values;
- media upload uses a form-backed submission path for selected files and upload/finalize errors, while the native file input remains the browser file picker boundary.

Alternative considered: only use TanStack Form for multi-field forms and leave single-action auth or file-upload flows as bespoke handlers. Rejected because the user explicitly wants all forms in `apps/web-cms` to use TanStack Form, and splitting the rule would preserve the inconsistency this change is meant to remove.

### 2. Keep schemas close to the feature, but share them between form and server boundaries where the contract already exists

The app already validates media route search with `zod` in `src/routes/dashboard.media.tsx`, and the media server workflows already accept typed payloads. The best fit is to keep schemas near the owning feature and reuse them where possible across TanStack Form defaults, client-side validation, route search parsing, and server action payloads.

Recommended shape:

- authentication intent and submission schema stays in `src/features/dashboard-authentication/`;
- media-library search/filter schema stays tied to the dashboard media route and is reused by the filter form;
- media tag-edit schema lives with the media-library feature and drives both input normalization and submit validation;
- upload form schema defines the accepted client-side submission shape while server-side upload rules remain authoritative.

Alternative considered: create one central app-wide `forms/schema.ts` registry. Rejected because the current app has too few forms to justify a registry, and feature-local schemas will be easier to evolve alongside the routes and server functions they serve.

### 3. Add a small app-local error mapping layer instead of letting each form interpret failures independently

Current form-adjacent code mostly reports failures through `toast.error(error.message)` or a generic fallback. TanStack Form adoption should add a thin shared convention for translating failures into:

- field errors when the failure maps to a specific input;
- form-level errors when the failure blocks submission but does not belong to one field;
- toast notifications only as secondary feedback for completed submit results or broad failures.

The app does not need a large abstraction here. A small helper or feature-local utility that normalizes `Error`, unknown values, and validation failures into a consistent shape is enough.

Alternative considered: keep using toasts as the only error surface and use TanStack Form only for values. Rejected because the user explicitly asked for schema and error handling, and value-only adoption would leave the most important inconsistency unresolved.

### 4. Prefer minimal wrappers around existing UI primitives instead of introducing a large new form component system

`apps/web-cms` already uses app-local UI primitives under `src/components/ui/`. The migration should compose TanStack Form with those existing inputs and buttons rather than introducing a new broad form design system.

That means:

- existing `Input`, `Textarea`, `NativeSelect`, and `Button` components remain the rendered controls;
- any new form helpers should focus on binding TanStack Form state to those primitives and rendering error text consistently;
- feature files should keep most of their UI structure, changing only the parts needed to bind values, submit handlers, and errors.

Alternative considered: add a generic form-field framework before migrating any route. Rejected because it would widen the change significantly and is unnecessary for the current number of forms.

### 5. Keep route and server contracts stable where possible and let forms adapt to them

The existing route and server behavior is already working: auth uses Better Auth social sign-in, media search is parsed by route search validation, and media upload/finalize/tag actions already exist. The design should avoid unnecessary backend churn.

Recommended approach:

- TanStack Form submits continue to call the existing auth and media actions;
- search/filter form submission writes into router search state instead of replacing route validation;
- media tag form submission continues to call `updateMediaTags` with normalized tag arrays;
- upload form submission continues to request an upload intent, upload to R2, and finalize metadata in sequence.

Alternative considered: redesign the underlying server contracts first so every submit endpoint mirrors the form shape exactly. Rejected because the current requirement is about adopting TanStack Form across app forms, not rewriting stable server interfaces.

## Risks / Trade-offs

- [Schema duplication could persist between route validation, form validation, and server parsing] -> Mitigation: reuse existing `zod` schemas wherever the same contract already exists, especially for media search and tag payloads.
- [File inputs do not map as cleanly to controlled field patterns as text/select fields] -> Mitigation: let the browser own the native file input element while TanStack Form owns selected-file submission state, validation, and error reporting.
- [Moving errors from toast-only feedback to inline form errors can create duplicate messaging] -> Mitigation: reserve inline errors for actionable validation/submission issues and keep toasts for broader completion feedback.
- [A shared helper can become over-abstracted too early] -> Mitigation: start with the smallest helper surface needed by auth and media forms, and keep feature-specific logic inside those features.

## Migration Plan

1. Define the new form-flow capability and the auth/media requirement deltas in OpenSpec.
2. Add feature-local form schemas and the smallest shared helper surface needed to bind TanStack Form state and submission errors.
3. Migrate dashboard-authentication form interactions to TanStack Form while preserving existing Better Auth sign-in behavior.
4. Migrate dashboard media-library filter, tag-edit, and upload flows to TanStack Form while preserving route search and existing server workflows.
5. Run the narrowest useful validation for `apps/web-cms` and verify the main auth/media interactions still behave correctly.

Rollback strategy:

- revert the feature-level form wiring changes while leaving installed dependencies untouched, since `@tanstack/react-form` is already part of the app;
- keep route validation and server contracts unchanged so rollback is mostly client-side.

## Open Questions

- Should the app add a small reusable `FormMessage` or similar UI helper under `src/components/ui/`, or should error rendering stay fully feature-local in the first pass?
- Should media search submit immediately on field changes for select filters once converted to TanStack Form, or should every media filter control funnel through an explicit submit/apply action?
