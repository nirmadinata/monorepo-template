## MODIFIED Requirements

### Requirement: Authenticated users have a dashboard landing page

The `web-cms` application SHALL expose a dashboard home route that serves as the first authenticated destination after sign-in and renders within a reusable authenticated application shell.

#### Scenario: Authenticated user opens dashboard home

- **WHEN** a signed-in user visits the dashboard home route
- **THEN** the application renders a dashboard landing page confirming access to the CMS workspace inside an authenticated shell with a navbar and sidebar

#### Scenario: Unauthenticated user opens dashboard home

- **WHEN** a user without a valid auth session visits the dashboard home route
- **THEN** the application does not expose dashboard content and redirects the user to the login route

#### Scenario: Dashboard navbar shows shared controls

- **WHEN** a signed-in user views the dashboard home route
- **THEN** the navbar shows the company name and a dark/light theme switcher

#### Scenario: Dashboard sidebar renders grouped navigation

- **WHEN** a signed-in user views the dashboard home route
- **THEN** the sidebar renders grouped navigation items where a top-level item can be a direct link or expand to reveal submenu links

#### Scenario: User collapses the sidebar

- **WHEN** a signed-in user collapses the dashboard sidebar
- **THEN** the application keeps the dashboard shell usable while reducing the sidebar to its collapsed presentation

## ADDED Requirements

### Requirement: Dashboard sidebar exposes an account menu for the current user

The `web-cms` authenticated dashboard shell SHALL show the current user's identity in the sidebar footer and provide a top-aligned account dropdown for session actions.

#### Scenario: Sidebar footer shows current user identity

- **WHEN** a signed-in user views the dashboard shell
- **THEN** the sidebar footer shows the current user's display name and email in the account trigger

#### Scenario: Account menu opens above the trigger

- **WHEN** a signed-in user activates the account trigger in the dashboard sidebar footer
- **THEN** the application opens a dropdown menu positioned above the trigger
- **AND** the menu includes `Profile` and `Sign out` actions

#### Scenario: Collapsed sidebar keeps only the avatar visible

- **WHEN** a signed-in user collapses the dashboard sidebar
- **THEN** the sidebar footer account trigger remains available
- **AND** it shows only the user's avatar without the text labels

#### Scenario: Profile action is visible but not implemented

- **WHEN** a signed-in user opens the account menu
- **THEN** the application shows a profile menu item without requiring a working profile route yet

#### Scenario: User signs out from the dashboard sidebar

- **WHEN** a signed-in user chooses `Sign out` from the account menu
- **THEN** the application starts the sign-out flow for the current session
