## 1. Establish the shared TanStack Form pattern

- [x] 1.1 Identify every current user-editable form surface in `apps/web-cms` and confirm the initial migration scope covers authentication submit, media filters, media tag editing, and media upload.
- [x] 1.2 Add the smallest app-local form helper surface needed to bind TanStack Form state to existing `src/components/ui` primitives.
- [x] 1.3 Add a shared error-mapping convention for TanStack Form submissions so field-level and form-level failures can be rendered consistently.

## 2. Define schema-backed form contracts

- [x] 2.1 Add a schema-backed authentication submission contract under `src/features/dashboard-authentication/` for the Google sign-in and sign-up flows.
- [x] 2.2 Reuse or extract the dashboard media search schema so the route search parser and filter form share one validation contract.
- [x] 2.3 Add a schema-backed media tag-edit contract under `src/features/dashboard-media-library/`.
- [x] 2.4 Add a schema-backed media upload submission contract for selected files and upload submission errors while keeping server-side upload validation authoritative.

## 3. Migrate dashboard-authentication forms

- [x] 3.1 Replace the current button-only Google auth interaction with a TanStack Form-managed submit flow in the authentication feature.
- [x] 3.2 Surface pending auth submission state from the TanStack Form model in the login and welcome page UI.
- [x] 3.3 Surface authentication submit failures through TanStack Form-managed form errors instead of relying only on toast feedback.

## 4. Migrate dashboard media-library forms

- [x] 4.1 Convert the media search and filter controls to a TanStack Form-managed form that updates router search state with schema-backed values.
- [x] 4.2 Reset media pagination appropriately when the TanStack Form-managed filters change.
- [x] 4.3 Convert the media tag-edit dialog to a TanStack Form-managed form with schema-backed tag normalization and submit handling.
- [x] 4.4 Surface media tag update failures through the tag form's error state.
- [x] 4.5 Convert the media upload flow to TanStack Form-managed submission state while preserving the native file input picker and the existing upload-intent/finalize sequence.
- [x] 4.6 Surface upload and finalize failures through the upload form's error state in addition to any toast feedback kept for broad status messaging.

## 5. Validate and document the migration

- [x] 5.1 Run the narrowest useful `web-cms` validation for the TanStack Form migration and fix any introduced issues.
- [x] 5.2 Update app documentation or agent guidance if the maintained description of auth or media form behavior changes as part of the migration.
