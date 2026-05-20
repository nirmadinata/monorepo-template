## Context

`apps/web-landing` is a Next.js App Router application that currently serves a single localized landing page. The root layout only provides document metadata and `next-intl` context, while the page component owns the full visual structure. The change needs a reusable shell that can support future public routes without changing the existing cookie-based locale strategy.

The layout must work well on mobile and desktop because the requested shell includes both a navbar and a sidebar. The current language switcher is already a client component and should remain available without introducing locale-prefixed routing or new dependencies.

## Goals / Non-Goals

**Goals:**

- Introduce a reusable public shell with shared navbar, responsive sidebar, content area, and footer.
- Preserve the current `next-intl` flow and keep the language switcher accessible inside the shared shell.
- Make the shell responsive with a mobile-friendly navigation pattern and a desktop sidebar presentation.
- Keep the implementation local to `apps/web-landing` with minimal structural changes.

**Non-Goals:**

- Adding new routes, authentication, or account-specific navigation behavior.
- Changing locale persistence, supported locales, or URL structure.
- Introducing a design system migration or new component dependency.

## Decisions

### Build the shell in app-local shared components

The shared layout should be implemented with small app-local components under `src/components/` and composed from `src/app/layout.tsx`.

Rationale: the current app is small, and app-local shell components keep the change minimal while making future route reuse straightforward.

Alternative considered: keep the shell markup directly in `src/app/layout.tsx`. This was rejected because the shell includes multiple responsive regions that will be easier to maintain as named components.

### Use one navigation model with responsive presentation

The shell should use one shared navigation data structure that renders as a collapsible mobile sidebar and a persistent desktop sidebar, while the navbar remains visible across breakpoints.

Rationale: a single navigation source avoids drift between mobile and desktop links and keeps translation and styling updates consistent.

Alternative considered: separate mobile and desktop navigation definitions. This was rejected because it duplicates content and increases maintenance cost.

### Keep page content responsible only for route-specific sections

The current homepage should move route-specific hero and feature content into the main content area provided by the shell.

Rationale: this establishes the shell as the global frame and makes future pages easier to add without reimplementing top-level structure.

Alternative considered: keep page-level wrappers around shell sections. This was rejected because it would blur ownership between route content and app shell concerns.

### Keep localization integrated through existing messages and provider wiring

The shell should continue using the existing `NextIntlClientProvider` wiring from the root layout and reuse localized copy through the current message catalogs.

Rationale: the existing localization path already satisfies app constraints, and preserving it avoids behavioral regressions.

Alternative considered: introducing a separate shell-specific localization mechanism. This was rejected because it is unnecessary and would fragment message usage.

## Risks / Trade-offs

- [Responsive complexity across navbar and sidebar] -> Keep the shell structure simple, favor CSS-driven responsiveness, and avoid multiple divergent navigation implementations.
- [Potential regression to locale switcher placement or visibility] -> Make the language switcher part of the shared shell contract and capture it in spec scenarios.
- [Current homepage styling may need adjustment when moved into a shell] -> Keep route content focused on internal sections and allow the shell to own page-level spacing and framing.

## Migration Plan

1. Add the shared shell components and responsive navigation structure in `apps/web-landing`.
2. Refactor `src/app/layout.tsx` to wrap children with the shell while keeping metadata and `next-intl` wiring unchanged.
3. Refactor `src/app/page.tsx` so it renders only homepage-specific content within the shell's main area.
4. Update localized messages if the shell introduces new user-facing copy.
5. Run the narrowest useful validation for the landing app and verify responsive behavior manually in development.

Rollback is straightforward: revert the shell components and restore the previous page-owned top-level layout.

## Open Questions

- Whether the initial shared navigation should use localized labels from the message catalogs or ship with temporary static copy can be finalized during implementation, though localized labels are preferred.
