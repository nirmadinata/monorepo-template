## Why

The current `apps/web-cms/src/features/` tree mixes page composition, reusable UI fragments, and feature-specific helpers in inconsistent ways across features. Planning the refactor first is necessary so the team can adopt atomic design structure incrementally without breaking existing routes, imports, or dashboard behavior.

## What Changes

- Define a non-breaking migration plan for reorganizing feature UI code in `apps/web-cms/src/features/` around atomic design layers.
- Standardize how feature-owned UI files are split across `atoms`, `molecules`, `organisms`, `templates`, and page entry components while keeping non-UI concerns in existing `hooks`, `lib`, and `server` areas.
- Establish compatibility rules so route files and feature entrypoints can migrate one feature at a time without changing user-facing behavior.
- Document which current features can adopt the structure immediately and which ones should remain minimally reorganized until more UI surface exists.

## Capabilities

### New Capabilities

- `web-cms-atomic-feature-organization`: Define how `apps/web-cms` feature-owned UI code is organized into atomic design layers and migrated without breaking existing route behavior.

### Modified Capabilities

- `dashboard-authentication-pages`: Clarify that feature-scoped authentication UI components may be further organized into atomic-design layers within the existing feature-owned component area.

## Impact

- Affected code: `apps/web-cms/src/features/*`, route imports under `apps/web-cms/src/routes/`, and app documentation that describes feature responsibilities.
- Affected systems: TanStack Start route composition and feature-local component organization only; no API, auth, database, or R2 behavior changes are intended.
- Dependencies: No new runtime dependencies are expected.
