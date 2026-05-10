## MODIFIED Requirements

### Requirement: Authenticated users have a dashboard landing page

The `web-cms` application SHALL expose a dashboard home route that serves as the first authenticated destination after sign-in and renders dashboard home content within the reusable authenticated dashboard shell.

#### Scenario: Authenticated user opens dashboard home

- **WHEN** a signed-in user visits the dashboard home route
- **THEN** the application renders dashboard home content confirming access to the CMS workspace inside the authenticated dashboard shell

#### Scenario: Dashboard home remains the first authenticated destination

- **WHEN** an authenticated user is directed to the default dashboard route after sign-in
- **THEN** the application routes the user to the dashboard home page

#### Scenario: Dashboard home content is feature-scoped

- **WHEN** the dashboard home route renders inside the authenticated shell
- **THEN** the route-specific page content is owned separately from the reusable shell layout, navbar, and sidebar concerns
