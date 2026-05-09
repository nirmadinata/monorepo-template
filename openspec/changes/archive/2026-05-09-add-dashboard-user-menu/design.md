## Context

`apps/web-cms` already has an authenticated dashboard shell under `src/features/dashboard-home/components/dashboard-shell.tsx`, and route protection is provided through `getDashboardSession()`. The dashboard index route already reads `session.user`, but the shell itself only receives `children`, so the sidebar footer cannot currently render account details.

The app also already includes shadcn-style `DropdownMenu` and `Avatar` primitives under `src/components/ui/`, which fit the requested interaction pattern. Better Auth client setup exists in `src/integrations/auth/client.ts`, but there is no current sign-out UI in the dashboard.

## Goals / Non-Goals

**Goals:**

- Show the current user's name and email in the authenticated dashboard sidebar footer.
- Add a tidy account trigger and top-positioned dropdown menu that matches the repo's existing shadcn-style UI language.
- Provide a working sign-out menu item.
- Include a profile menu item as a visible placeholder without implementing profile navigation yet.
- Keep the collapsed sidebar footer compact by showing only the user's avatar.

**Non-Goals:**

- Build a dedicated profile page or settings flow.
- Change authentication rules, session structure, or database schema.
- Add global account menus outside the dashboard shell.

## Decisions

### Pass the dashboard user into the shell from the route boundary

The `/dashboard` route already loads the authenticated session. The shell should accept `user` as a prop from the route so the sidebar footer can render identity details without re-fetching session state in a separate client hook. This keeps the route as the source of truth for authenticated shell data.

Alternative considered: read the session again inside the shell through a client auth hook. Rejected because the route already has authoritative session data and duplicating lookup adds unnecessary state coordination.

### Compose the account control from existing Avatar and DropdownMenu primitives

The new sidebar footer control should use the existing `Avatar`, `AvatarFallback`, `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, and `DropdownMenuItem` primitives instead of custom popover markup. This keeps the UI consistent with a typical shadcn app and minimizes new styling surface area.

Alternative considered: build a custom absolute-positioned popup. Rejected because the app already has the right primitives and custom overlay behavior would be harder to keep polished.

### Place the menu above the footer trigger to match the requested top-side popup

The dropdown content should open on the top side of the sidebar footer trigger and align to the end edge so it feels anchored to the user control while staying clear of the viewport edge.

Alternative considered: use the default bottom-side placement. Rejected because the request explicitly asks for the popup menu on the top side.

### Keep profile presentational and sign-out functional

The menu should include both `Profile` and `Sign out`, but only sign-out should be wired in this change. The profile item can be disabled or visually marked as not yet available so the UI structure lands cleanly without implying implemented navigation.

Alternative considered: omit the profile item until the page exists. Rejected because the request explicitly asks for both menu entries.

### Use a defensive display-name fallback

The sidebar footer account trigger should prefer `user.name`, but fall back to a stable derivative of `user.email` if needed so the control does not render an empty primary label.

### Collapse the footer trigger down to avatar-only

When the desktop sidebar is collapsed to icon mode, the footer account trigger should hide the name, email, and chevron while keeping the avatar as the visible affordance for opening the same menu. This preserves access to account actions without crowding the compact rail.

Alternative considered: hide the account control entirely in collapsed mode. Rejected because sign-out should remain accessible even when the sidebar is reduced.

Alternative considered: assume `user.name` is always present. Rejected because the UI should remain resilient even if an auth provider returns incomplete profile data.

## Risks / Trade-offs

- A long user name or email could crowd the footer trigger on narrower desktop widths -> Clamp the account trigger text with truncation and keep the trigger compact.
- Client-side sign-out may require redirect handling after the auth call resolves -> Keep the first implementation simple and explicit, with tests covering the invoked sign-out action rather than broader navigation flows.
- A disabled profile action can look unfinished if styled poorly -> Use standard muted menu presentation so it reads as an intentional placeholder.

## Migration Plan

No migration is required. Deploy the sidebar footer account control, route prop threading, and sign-out behavior together. If rollback is needed, revert the shell prop change and remove the account menu component.

## Open Questions

- None. The requested interaction is specific enough to implement with current session data and existing UI primitives.
