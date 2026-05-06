## Context

`apps/web-cms` currently has working Better Auth server integration under `src/integrations/auth`, a minimal auth client, and a placeholder `/` route that does not expose any real sign-in UI. The existing auth spec already limits account creation to the first Google user, and the shared D1 auth schema in `@repo/db/d1` already includes a nullable `role` column on `users`, which gives this change a place to persist `superadmin` without altering the core schema.

The requested implementation also carries explicit structural constraints inside `apps/web-cms`: new auth code should live under `src/features/dashboard-authentication/`, feature utilities should be split across `components`, `hooks`, `lib`, and `server`, and the UI should follow clean code, atomic design, and composition patterns while reusing the preinstalled shadcn components instead of editing them.

## Goals / Non-Goals

**Goals:**

- Add a first-user welcome page with a Google sign-up action for the bootstrap administrator.
- Add a separate login page for already registered users with a Google sign-in action.
- Keep the feature implementation isolated under `src/features/dashboard-authentication/` using small composable components, feature hooks, and server helpers.
- Reuse the existing Better Auth integration and extend it so the first created user is stored with the `superadmin` role.
- Expose a small server-side bootstrap-state surface that route components can use to decide whether to render the welcome experience or the returning-user login experience.

**Non-Goals:**

- Modifying shared shadcn primitives under `src/components/ui`.
- Adding non-Google auth providers, email/password flows, or invitation-based multi-user onboarding.
- Designing the post-login dashboard, permission system, or full admin management UX.
- Changing the shared database schema unless implementation reveals an actual mismatch with the existing `role` field.

## Decisions

### 1. Create a feature-scoped auth UI module under `src/features/dashboard-authentication`

The change will introduce a feature folder with this responsibility split:

- `components/`: atomic and composed UI building blocks such as page shells, auth cards, section copy, and Google action buttons.
- `hooks/`: React hooks that wrap feature behavior such as invoking the auth client or consuming bootstrap-state data.
- `lib/`: feature-only schemas and helpers such as callback URL builders or view-model utilities.
- `server/`: TanStack Start server functions and their input/output schemas for bootstrap-state reads and any auth-page server helpers.

Why this over placing everything directly in `routes/` or generic top-level folders?

- The user explicitly wants feature-local structure, and the current app has only generic top-level `components`, `hooks`, and `lib` folders with no auth feature boundary.
- Route files stay thin when they only compose feature exports and route-level redirects.

Alternative considered: keep auth screens directly in `src/routes` with ad hoc helper files.

- Rejected because it would spread page logic, bootstrap-state queries, and UI composition across unrelated top-level locations.

### 2. Use route-level page separation with bootstrap-aware redirects

The recommended route model is:

- `/`: the welcome entry route. It queries bootstrap state and renders the first-user welcome page when no user exists. If bootstrap is already closed, it redirects to `/login`.
- `/login`: the returning-user login route. It renders the sign-in page for registered users and may optionally redirect back to `/` when bootstrap is still open, depending on the final UX preference during implementation.

Why this over a single route that conditionally renders both screens?

- Separate routes make the intended user journeys explicit and match the request for both a welcome page and a login page.
- The current `/` placeholder route can be replaced cleanly with the welcome entry point, minimizing route churn.

Alternative considered: render both welcome and login variants from a single `/` page.

- Rejected because it makes URL semantics weaker and complicates testing for first-user versus returning-user flows.

### 3. Add a minimal server function that exposes bootstrap state to the UI

The feature should not guess whether first-user sign-up is available. Instead, it will add a feature-level server function that returns a small typed payload such as:

- `hasUsers: boolean`
- `isBootstrapOpen: boolean`

The implementation can delegate to existing auth/database integrations rather than duplicating queries inside React components. If needed, a companion schema file can live in `server/` or `lib/` to validate the server function output.

Why this over fetching directly from Better Auth routes or duplicating DB checks in page loaders?

- A dedicated feature server function keeps the bootstrap contract stable for the UI and avoids coupling page components to raw auth internals.
- It aligns with the requested `server` folder and TanStack Start server-function pattern.

Alternative considered: infer bootstrap state entirely on the client after an OAuth failure.

- Rejected because it creates a poor first-load UX and forces the UI to learn state from failed auth attempts instead of an explicit server contract.

### 4. Reuse existing shadcn primitives through composition-only feature components

The new UI should compose existing primitives like `Card`, `Button`, `Badge`, `Alert`, `Separator`, and `Spinner` from `src/components/ui`. Shared primitives remain untouched; any visual specialization belongs in new feature components or route-level layout wrappers.

This is the smallest safe way to satisfy both the user's request and the repository's UI guidance:

- atomic components remain small and reusable,
- composed feature sections can express a distinct welcome/login presentation,
- shared UI primitives stay stable for the rest of the app.

Alternative considered: edit shared shadcn components to add auth-specific variants.

- Rejected because the user explicitly asked not to modify existing components.

### 5. Persist `superadmin` in the existing first-user auth path

The current auth integration already uses a database hook to allow only the first user to be created. This change should extend that same bootstrap path so the first created user record is persisted with `role: "superadmin"`, while later returning users preserve their existing role value.

Why this over assigning the role in a separate post-login job or client mutation?

- The first-user role is security-sensitive bootstrap logic and belongs at the same server-side creation boundary that already enforces first-user-only account creation.
- The shared auth schema already contains the `role` field, so no extra persistence layer is needed.

Alternative considered: compute superadmin status outside the auth creation hook.

- Rejected because any path that separates role assignment from user creation risks a partially created first account without the required elevated role.

## Risks / Trade-offs

- [Bootstrap state can become stale between page load and OAuth callback] → Mitigation: use the UI state only for rendering, and keep the authoritative first-user and role-assignment checks inside the auth server integration.
- [A dedicated feature structure adds more files for a small UI surface] → Mitigation: keep the implementation minimal and avoid over-abstracting beyond the requested `components`, `hooks`, `lib`, and `server` folders.
- [Welcome and login routes may need redirect tuning once session-aware dashboard routing exists] → Mitigation: keep route logic thin and centralize redirect helpers so later protected-route work can adjust behavior without rewriting the UI.
- [Auth-page visuals could drift from the design system if styled ad hoc] → Mitigation: compose only the existing shadcn primitives and keep custom classes limited to layout concerns.

## Migration Plan

1. Add the feature folder structure under `apps/web-cms/src/features/dashboard-authentication/` and introduce the feature-level server function for bootstrap state.
2. Replace the placeholder `/` route with the welcome entry route and add a dedicated `/login` route that composes the new feature exports.
3. Extend the existing Better Auth user-creation path to assign `superadmin` to the first created user.
4. Add focused tests for bootstrap-state queries, first-user role assignment, and route/page behavior.

Rollback strategy:

- revert the new feature folder and route files,
- restore the placeholder `/` route,
- remove the `superadmin` assignment from the auth integration while preserving the existing first-user-only sign-up guard.

## Open Questions

None. This proposal assumes the welcome page is the default `/` route and the returning-user page lives at `/login`, which is the minimal route model that satisfies the requested split experience.
