## Why

`apps/web-cms` already has Google-based Better Auth plumbing and first-user bootstrap protection, but it still ships with a placeholder home page and no user-facing authentication entry points. Adding a dedicated first-user welcome experience and a returning-user login page is the next necessary step so the existing auth contract can actually be used to bootstrap and access the CMS.

## What Changes

- Add a new `dashboard-authentication-pages` capability for `apps/web-cms` that introduces a first-user welcome page and a separate login page for registered users.
- Reuse and compose the preinstalled shadcn UI components under `src/components/ui` without modifying those shared component source files.
- Organize the new feature under `src/features/dashboard-authentication/` with `components`, `hooks`, `lib`, and `server` subfolders to keep auth UI, feature utilities, and TanStack Start server functions isolated.
- Add feature-level client and server composition to detect whether bootstrap sign-up is still available, render the correct page state, and trigger Google OAuth sign-in flows.
- Extend the existing `web-cms-authentication` capability so the first approved Google user is persisted as `superadmin` during bootstrap, while returning registered users continue to use Google sign-in.

## Capabilities

### New Capabilities

- `dashboard-authentication-pages`: Welcome and login experiences for `apps/web-cms`, built from composed shadcn components and feature-scoped modules.

### Modified Capabilities

- `web-cms-authentication`: The bootstrap flow now assigns the first created user the `superadmin` role and exposes the state needed by the authentication pages.

## Impact

- Affected app code: `apps/web-cms/src/routes/**`, `apps/web-cms/src/features/dashboard-authentication/**`, and supporting auth integration modules.
- Affected auth behavior: the first Google-authenticated user receives the `superadmin` role, and the app exposes a first-user welcome state distinct from the returning-user login state.
- Affected UI composition: new auth screens must be built by reusing `apps/web-cms/src/components/ui/*` components rather than editing shared primitives.
- Affected verification: focused tests should cover bootstrap-state detection, `superadmin` assignment, and page routing/rendering for first-user and returning-user flows.
