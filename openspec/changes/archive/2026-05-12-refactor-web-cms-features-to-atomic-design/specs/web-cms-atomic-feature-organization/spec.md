## ADDED Requirements

### Requirement: Feature-owned UI code follows atomic layering within each feature

The `web-cms` application SHALL organize feature-owned UI code inside each feature's `components` directory using atomic-design layers when the feature contains reusable visual parts, while keeping app-wide reusable primitives under `src/components`.

#### Scenario: Feature has reusable UI pieces below the page level

- **WHEN** a feature contains reusable visual pieces that are smaller than a route-facing page component
- **THEN** the feature stores those pieces in `components/atoms`, `components/molecules`, `components/organisms`, or `components/templates` according to their composition level
- **AND** the feature does not move feature-specific pieces into the app-wide shared component surface unless they become genuinely shared beyond that feature

### Requirement: Route-facing page components remain stable during the refactor

The `web-cms` application SHALL preserve the route-facing page component contracts used by existing routes while feature-owned UI files are reorganized.

#### Scenario: Existing route renders a migrated feature page

- **WHEN** a route such as `/`, `/login`, `/dashboard`, or `/dashboard/media` renders a feature page during the refactor
- **THEN** the route continues to consume the same feature-owned page component contract
- **AND** the route's user-facing behavior remains unchanged by the internal file reorganization

#### Scenario: Import compatibility is needed during migration

- **WHEN** a feature's internal UI files are moved into atomic-design subfolders before every caller is updated
- **THEN** the application may use thin compatibility files or re-exports to keep existing imports working until the migration of that feature is complete

### Requirement: Atomic organization does not force empty layer folders

The `web-cms` application SHALL adopt atomic-design layers incrementally and only introduce the layer folders that a feature currently needs.

#### Scenario: Feature has a small UI surface

- **WHEN** a feature does not yet have enough internal UI reuse to justify every atomic-design layer
- **THEN** the refactor may keep only the necessary page and lower-level component files
- **AND** the feature does not create empty `atoms`, `molecules`, `organisms`, or `templates` directories solely to satisfy the convention

### Requirement: Non-UI feature concerns stay outside atomic UI folders

The `web-cms` application SHALL keep feature-local hooks, helper code, schemas, and server functions outside the atomic UI layer directories.

#### Scenario: Feature includes form logic or server actions

- **WHEN** a feature contains TanStack Form logic, helper utilities, route loaders, or server mutations
- **THEN** those files remain in `hooks`, `lib`, or `server`
- **AND** the atomic folders are used only for UI composition
