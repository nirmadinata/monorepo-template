## ADDED Requirements

### Requirement: First-user welcome page is available for bootstrap onboarding

The `web-cms` application SHALL expose a welcome page for bootstrap onboarding that is intended for the first user and presents a minimal centered TanStack Form-managed sign-up submission with short instructions and a Google sign-up action built from composed feature components under `src/features/dashboard-authentication`.

#### Scenario: Bootstrap is open

- **WHEN** no user exists in the shared auth tables and a user visits the welcome entry route
- **THEN** the application renders the first-user welcome page with short guidance that the first account becomes the bootstrap administrator and a Google sign-up action managed through TanStack Form

#### Scenario: Bootstrap is closed

- **WHEN** at least one user already exists and a user visits the welcome entry route
- **THEN** the application does not present first-user onboarding as available and routes the user to the registered-user sign-in experience

### Requirement: Registered-user login page supports Google sign-in

The `web-cms` application SHALL expose a dedicated login page for registered users that presents Google sign-in through a minimal centered TanStack Form-managed submission flow with short supporting copy, without modifying the shared UI primitives.

#### Scenario: Registered user visits login page

- **WHEN** a user visits the login route after bootstrap onboarding has already completed
- **THEN** the application renders a login page with short instructions for returning users and a Google sign-in submit action managed through TanStack Form

#### Scenario: Auth page components are composed from shared primitives

- **WHEN** the authentication pages are implemented
- **THEN** the page UI is built by composing existing components from `src/components/ui` inside feature-scoped components under `src/features/dashboard-authentication/components`

#### Scenario: Google sign-in submission is pending

- **WHEN** a user submits the Google sign-in form
- **THEN** the authentication form exposes pending submission state through TanStack Form so the submit control reflects the in-progress action consistently

#### Scenario: Google sign-in submission fails

- **WHEN** the Google sign-in attempt cannot be started or returns a submission error
- **THEN** the authentication form surfaces the failure through TanStack Form-managed error state instead of relying only on a toast notification

### Requirement: Authentication page code is feature-scoped

The `web-cms` authentication page implementation SHALL keep feature-specific UI, hooks, helpers, and TanStack Start server functions inside `src/features/dashboard-authentication`.

#### Scenario: Feature files are added

- **WHEN** the authentication page feature is implemented
- **THEN** the feature includes `components`, `hooks`, `lib`, and `server` subfolders for page composition, React hooks, feature utilities, and server functions respectively

### Requirement: Public authentication routes share a common layout

The `web-cms` application SHALL render unauthenticated authentication routes inside a shared public layout that includes a navbar with a mock CMS name on the left and a dark/light theme switcher on the right.

#### Scenario: User visits a public auth route

- **WHEN** a user visits the welcome or login route
- **THEN** the route renders inside the shared public layout with the common navbar visible above the centered auth form
