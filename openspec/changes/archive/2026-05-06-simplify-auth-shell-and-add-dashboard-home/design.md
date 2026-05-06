## Context

`apps/web-cms` already exposes two public authentication routes: `/` for first-user bootstrap and `/login` for returning users. Those routes currently render more detailed marketing-style content through feature-scoped composition, while the app shell does not yet provide a shared unauthenticated navbar, theme switching, or a globally mounted toast surface. The auth client also routes successful Google flows back to the public auth pages because there is no dashboard landing route yet.

This change crosses route composition, auth client callback behavior, and shared app shell concerns. The implementation needs to stay consistent with the existing Better Auth bootstrap rules and with the repo's preference for minimal, factual UI composition.

## Goals / Non-Goals

**Goals:**

- Replace the current welcome and login page bodies with the smallest useful UI: a centered card, short instructions, and the Google action.
- Introduce a reusable public layout for unauthenticated routes with a brand label and explicit dark/light theme control.
- Mount a global Sonner toaster in the root shell so route and feature code can emit toast feedback without local setup.
- Add a dashboard home route and point successful sign-in there.

**Non-Goals:**

- Redesign or expand the authenticated dashboard beyond a simple landing page.
- Change Better Auth provider configuration, bootstrap authorization rules, or database schema.
- Add complex navigation, account menus, or broader theming customization beyond a light/dark toggle.

## Decisions

### Use a dedicated public route layout for unauthenticated pages

The welcome and login routes will share a route-level layout that renders a simple navbar and centers route content beneath it. This keeps public chrome out of each page component and avoids duplicating theme toggle and brand markup across auth pages.

Alternative considered: keep the navbar inside each page component. Rejected because it duplicates structure across two routes and makes later public-route additions harder.

### Keep auth page logic feature-scoped while simplifying page composition

The existing `src/features/dashboard-authentication` feature boundary will stay in place, but its page components will be reduced to minimal compositions instead of the current highlight panels and multi-section messaging. This preserves the current project organization without carrying forward unnecessary UI complexity.

Alternative considered: move the auth pages out of the feature folder into routes. Rejected because the current spec already treats auth pages as a feature-scoped surface and the request is to simplify the experience, not flatten the architecture.

### Mount theme and toast providers at the root shell

Theme state and Sonner rendering should live near `__root.tsx` so all public and future authenticated routes inherit the same behavior. The existing `src/components/ui/sonner.tsx` component can be reused, but it needs app-level theme context and should be configured for top-right placement.

Alternative considered: mount the toaster only in the public layout. Rejected because the user asked for universal toast behavior and the dashboard route should receive the same capability.

### Add a lightweight dashboard home route as the auth callback destination

The first authenticated route will be a minimal dashboard home page, likely at `/dashboard`, and Google auth callback URLs will target that route for both existing users and newly created bootstrap users. The page can start as a simple landing screen with enough structure to confirm that sign-in succeeded and to provide a stable destination for later CMS work.

Alternative considered: redirect to an existing auth route and then forward again after session detection. Rejected because it adds an unnecessary extra hop and keeps the public auth pages involved after authentication succeeds.

### Defer strong server-side dashboard route protection to implementation details already available in Better Auth/TanStack Start

The change requires an authenticated destination, but the current repository does not yet expose a shared route guard helper. The implementation should add the minimum route loader or server check needed to keep dashboard access tied to a valid session, while avoiding a broader authorization framework in this change.

Alternative considered: specify a full shared auth guard architecture in this design. Rejected because it adds scope not required for a single dashboard landing route.

## Risks / Trade-offs

- Public layout styling may duplicate future authenticated shell concerns -> Keep the public layout intentionally narrow and specific to unauthenticated routes.
- Theme toggling could cause hydration or provider mismatches if mounted incorrectly -> Add theme context once at the root shell and keep the toggle implementation minimal.
- Redirecting OAuth flows to a new dashboard route can expose gaps in session-aware routing -> Add route-level coverage for successful and unauthenticated dashboard access paths.
- Simplifying the auth pages could remove helpful bootstrap context -> Retain short instructional copy that still distinguishes first-user bootstrap from returning-user sign-in.

## Migration Plan

No schema or data migration is required. Deploy the new route layout, root providers, and dashboard route together so callback URLs and route availability change atomically. If rollback is required, revert the callback targets and remove the dashboard route so successful sign-ins return to the previous public auth flow.

## Open Questions

- None. The requested scope is specific enough to implement with existing auth and routing primitives.
