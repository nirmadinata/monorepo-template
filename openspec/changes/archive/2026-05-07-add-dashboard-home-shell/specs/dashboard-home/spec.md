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
