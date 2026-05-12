## MODIFIED Requirements

### Requirement: Authentication page code is feature-scoped

The `web-cms` authentication page implementation SHALL keep feature-specific UI, hooks, helpers, and TanStack Start server functions inside `src/features/dashboard-authentication`, and SHALL allow the feature-owned UI files under `components` to be organized into atomic-design layers without changing the page contracts used by public auth routes.

#### Scenario: Feature files are added

- **WHEN** the authentication page feature is implemented
- **THEN** the feature includes `components`, `hooks`, `lib`, and `server` subfolders for page composition, React hooks, feature utilities, and server functions respectively
- **AND** the `components` area may further group feature-owned UI into folders such as `atoms`, `molecules`, `organisms`, or `templates`

#### Scenario: Public auth routes use page entry components during migration

- **WHEN** the welcome or login route renders a public authentication page while the feature is being reorganized
- **THEN** the route continues to import a feature-owned page entry component from `src/features/dashboard-authentication/components`
- **AND** the layered component reorganization does not change the route's user-facing behavior
