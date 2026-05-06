## ADDED Requirements

### Requirement: Authenticated users have a dashboard landing page

The `web-cms` application SHALL expose a dashboard home route that serves as the first authenticated destination after sign-in.

#### Scenario: Authenticated user opens dashboard home

- **WHEN** a signed-in user visits the dashboard home route
- **THEN** the application renders a dashboard landing page confirming access to the CMS workspace

#### Scenario: Unauthenticated user opens dashboard home

- **WHEN** a user without a valid auth session visits the dashboard home route
- **THEN** the application does not expose dashboard content and redirects the user to the login route
