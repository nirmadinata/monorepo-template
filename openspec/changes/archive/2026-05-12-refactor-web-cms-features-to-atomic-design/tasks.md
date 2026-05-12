## 1. Establish Atomic Feature Conventions

- [x] 1.1 Define the target atomic folder layout inside `apps/web-cms/src/features/*/components` and document when to use `atoms`, `molecules`, `organisms`, `templates`, and route-facing `*-page.tsx` entry files.
- [x] 1.2 Identify the current `apps/web-cms/src/features/` components that can remain as-is temporarily versus the ones that should move in the first implementation pass.

## 2. Migrate Lower-Risk Features First

- [x] 2.1 Refactor `dashboard-authentication` to align with the atomic convention while keeping the existing public route imports and Google auth behavior unchanged.
- [x] 2.2 Refactor `dashboard` shell and account-menu UI into the atomic layers that fit today without changing dashboard session or navigation behavior.
- [x] 2.3 Refactor `dashboard-home` into the smallest useful atomic structure while keeping `dashboard-home-page.tsx` as the stable route-facing entrypoint.

## 3. Decompose Dashboard Media Library Safely

- [x] 3.1 Split `dashboard-media-library` page composition into feature-local atomic components for the visible UI seams such as filters, upload progress, media table/actions, empty state, and pagination.
- [x] 3.2 Keep `dashboard-media-library` form schemas, loader data, upload/tag/delete actions, and route search behavior unchanged while updating internal imports.
- [x] 3.3 Use thin compatibility files or re-exports only where needed so the feature migration remains non-breaking during the transition.

## 4. Verify And Document The New Structure

- [x] 4.1 Update `apps/web-cms/AGENTS.md` to describe the new feature directory responsibilities once the refactor lands.
- [x] 4.2 Run the narrowest useful workspace checks for the touched app files and confirm the existing auth, dashboard home, and media-library routes still build and render with the same behavior.
- [x] 4.3 Remove any temporary compatibility files that are no longer needed after imports and checks pass.
