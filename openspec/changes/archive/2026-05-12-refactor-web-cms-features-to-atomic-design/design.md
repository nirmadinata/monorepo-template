## Context

`apps/web-cms/src/features/` currently groups code by feature, but each feature uses a different level of UI decomposition. `dashboard-authentication` already has a feature-local atom under `components/atoms`, while `dashboard-home` is still a single page component, `dashboard` keeps shell and account UI together, and `dashboard-media-library` keeps an 800+ line page component that mixes page composition, dialogs, table sections, filters, and upload progress UI.

The refactor is intended to improve consistency and maintainability without changing route paths, loader contracts, auth behavior, or dashboard/media-library functionality. The route files currently import page entry components from `src/features/*/components/*-page.tsx`, so the migration needs to preserve those entrypoints while lower-level UI is reorganized.

Constraints:

- Keep `apps/web-cms` feature boundaries intact; this is not a package extraction or app-wide design-system rewrite.
- Leave non-UI concerns in `hooks`, `lib`, and `server`.
- Avoid empty directory boilerplate for features that do not yet justify every atomic layer.
- Update app documentation if feature directory responsibilities change.

## Goals / Non-Goals

**Goals:**

- Define one consistent atomic-design convention for feature-owned UI in `apps/web-cms/src/features/`.
- Allow the refactor to land incrementally, one feature at a time, without breaking current route behavior.
- Keep route-facing page components easy to locate while moving reusable feature UI into lower atomic layers.
- Prioritize the highest-value decomposition targets first, especially the large media-library page.

**Non-Goals:**

- Changing route URLs, route loader/search contracts, auth flows, or dashboard/media-library behavior.
- Moving feature-specific UI into `src/components/ui` unless it becomes a true app-wide primitive.
- Reorganizing non-feature areas such as `src/integrations/` or `src/components/` as part of this change.
- Forcing every feature to have every atomic layer regardless of its current complexity.

## Decisions

### 1. Keep atomic design scoped inside each feature

Atomic design will be applied inside each feature's existing `components` area instead of introducing a new cross-feature UI surface. The target convention is:

- `src/features/<feature>/components/atoms/`
- `src/features/<feature>/components/molecules/`
- `src/features/<feature>/components/organisms/`
- `src/features/<feature>/components/templates/`
- `src/features/<feature>/components/*-page.tsx` for route-facing page entry components

This keeps feature ownership intact and avoids confusing feature-local UI with the shared primitives already maintained under `src/components/ui`.

Alternative considered: moving reusable feature pieces into `src/components/` as part of the refactor. Rejected because the current request is about feature organization, not broadening the app-wide component surface.

### 2. Keep route-facing page entry imports stable

Page entry components such as `login-page.tsx`, `welcome-page.tsx`, `dashboard-home-page.tsx`, and `media-library-page.tsx` will remain the stable entrypoints consumed by route files. Internal composition can move beneath `atoms`, `molecules`, `organisms`, and `templates`, but routes should not need behavioral rewrites.

If a lower-level reorganization would otherwise break imports during the migration, thin compatibility files or temporary re-exports can preserve the existing import paths until all internal callers are updated.

Alternative considered: introducing a mandatory `pages/` directory and rewriting every route import immediately. Rejected because it adds route churn without providing meaningful runtime value.

### 3. Keep non-UI concerns outside atomic folders

Feature-local hooks, schemas, helpers, and server functions remain in `hooks`, `lib`, and `server`. Atomic folders only cover UI composition. This avoids mixing TanStack Form logic, route data loading, and server mutations into visual layers.

Alternative considered: classifying all feature files into atomic design, including hooks and helpers. Rejected because atomic design is useful for UI composition, not for data-fetching or validation concerns.

### 4. Migrate by feature risk, not all at once

The recommended implementation order is:

1. `dashboard-authentication`, because it already has one atomic subfolder and a small UI surface.
2. `dashboard`, because the shell and account menu can be decomposed with limited route impact.
3. `dashboard-home`, because it is small and should align with the dashboard shell structure.
4. `dashboard-media-library`, because it is the most complex feature and benefits most from decomposition after the conventions are proven.

Alternative considered: a single big-bang move of every feature directory. Rejected because it increases diff size and makes regression diagnosis harder.

### 5. Only introduce layers that a feature actually uses

The migration should not create empty `atoms`, `molecules`, `organisms`, or `templates` directories just to satisfy the pattern. A small feature may only need a page entry component and one `template`, while the media library may justify all layers.

Alternative considered: requiring the full atomic directory set in every feature. Rejected because it creates boilerplate without improving clarity.

## Risks / Trade-offs

- Temporary compatibility entrypoints can duplicate file paths briefly -> Keep them thin, document them in the change, and remove them once imports are fully updated.
- Atomic layer boundaries can be subjective -> Use a simple rule: classify by composition level and keep the smallest correct decomposition rather than splitting aggressively.
- `dashboard-media-library` can become a long-running refactor -> Split it along visible UI seams first (filters, upload status, table/actions, empty state, pagination) while preserving loader and action contracts.
- Documentation can drift after directory moves -> Update `apps/web-cms/AGENTS.md` and any related docs in the implementation change.

## Migration Plan

1. Establish the atomic folder convention in the first migrated feature and keep its page entry component import path stable.
2. Move reusable feature-owned UI pieces into the appropriate atomic subfolders while leaving `hooks`, `lib`, and `server` unchanged.
3. Update internal feature imports to use the new layered locations.
4. Verify route entry components still render the same behavior and data flows.
5. Remove any temporary compatibility files that are no longer needed once the workspace imports are updated and checks pass.

Rollback strategy: if a migration introduces regressions, restore the affected feature's previous file layout from git and retry with a smaller slice. Because the change is organizational, rollback is file-level and does not require schema, API, or data rollback steps.

## Open Questions

- Should `dashboard-home` keep its current single page component until more home-specific widgets exist, or should it still introduce a `templates` split immediately for consistency?
- After the refactor lands, should feature-owned page components continue to live directly under `components/`, or should a later follow-up introduce dedicated public entry barrels once the new structure stabilizes?
