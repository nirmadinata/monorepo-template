## ADDED Requirements

### Requirement: Authenticated dashboard routes render inside a reusable dashboard shell

The `web-cms` application SHALL provide a reusable authenticated dashboard shell that wraps dashboard routes and ensures only signed-in users can access dashboard content.

#### Scenario: Authenticated user opens a dashboard route

- **WHEN** a signed-in user visits a dashboard route that uses the dashboard shell
- **THEN** the application renders the route content inside the shared authenticated shell

#### Scenario: Unauthenticated user opens a dashboard route

- **WHEN** a user without a valid auth session visits a dashboard route that uses the dashboard shell
- **THEN** the application does not expose dashboard content and redirects the user to the login route

### Requirement: Dashboard shows shared navbar controls

The dashboard shell SHALL render the shared authenticated navbar controls used across dashboard routes.

#### Scenario: Dashboard shell renders the navbar

- **WHEN** a signed-in user views a dashboard route inside the shell
- **THEN** the navbar shows the company name and a dark/light theme switcher

### Requirement: Dashboard shows grouped sidebar navigation

The dashboard shell SHALL render grouped sidebar navigation for dashboard routes.

#### Scenario: Sidebar renders grouped navigation items

- **WHEN** a signed-in user views the dashboard shell
- **THEN** the sidebar renders grouped navigation items where a top-level item can be a direct link or expand to reveal submenu links

#### Scenario: User collapses the sidebar

- **WHEN** a signed-in user collapses the dashboard sidebar
- **THEN** the application keeps the dashboard shell usable while reducing the sidebar to its collapsed presentation

### Requirement: Dashboard sidebar footer exposes the current user account menu

The dashboard shell SHALL show the current user's identity in the sidebar footer and provide session-related account actions there.

#### Scenario: Sidebar footer shows current user identity

- **WHEN** a signed-in user views the dashboard shell
- **THEN** the sidebar footer shows the current user's display name and email in the account trigger

#### Scenario: Account menu opens above the sidebar footer trigger

- **WHEN** a signed-in user activates the account trigger in the dashboard sidebar footer
- **THEN** the application opens an account menu positioned above the trigger
- **AND** the menu includes `Profile` and `Sign out` actions

#### Scenario: Collapsed sidebar keeps only the avatar visible

- **WHEN** a signed-in user collapses the dashboard sidebar
- **THEN** the sidebar footer account trigger remains available
- **AND** it shows only the user's avatar without the text labels

#### Scenario: Profile action is visible but not implemented

- **WHEN** a signed-in user opens the account menu
- **THEN** the application shows a profile menu item without requiring a working profile route yet

#### Scenario: User signs out from the dashboard sidebar

- **WHEN** a signed-in user chooses `Sign out` from the sidebar account menu
- **THEN** the application starts the sign-out flow for the current session
