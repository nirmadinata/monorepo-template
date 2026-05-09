## ADDED Requirements

### Requirement: Web CMS auth uses Better Auth with Google-only sign-in

The `web-cms` application SHALL expose Better Auth backed by the shared D1 database integration, with explicit adapter mapping for the existing aliased auth schema in `src/integrations/db`. The authentication system MUST enable Google OAuth sign-in and MUST NOT enable email/password or additional social providers in this change.

#### Scenario: Auth server is initialized

- **WHEN** the Better Auth server configuration is created for `web-cms`
- **THEN** it uses the shared D1-backed adapter with the `src/integrations/db` auth schema mapping and exposes Google as the only sign-in provider

### Requirement: Sign-up is restricted to the first user

The `web-cms` authentication system SHALL allow creation of a new user through Google OAuth only when no user record exists in the shared auth schema. The first user created through this bootstrap flow MUST be persisted with the `superadmin` role. After the first user has been created, the system MUST reject sign-in attempts from previously unseen Google identities and MUST continue to allow returning users whose Google account is already linked.

#### Scenario: First Google user signs in to an empty system

- **WHEN** no user exists in the shared auth tables and a valid Google OAuth callback is received
- **THEN** the system allows the user and account records to be created
- **AND** the created user is stored with the `superadmin` role

#### Scenario: New Google identity signs in after bootstrap

- **WHEN** at least one user already exists and the Google identity is not linked to an existing account
- **THEN** the system rejects the sign-in attempt without creating a new user

#### Scenario: Existing linked Google user signs in after bootstrap

- **WHEN** at least one user already exists and the Google identity is already linked to an existing account
- **THEN** the system completes sign-in successfully

### Requirement: Better Auth remains reachable through the application API route

The `web-cms` application SHALL continue to serve Better Auth request handling through the `/api/auth/*` route namespace, and app code SHALL have a compatible auth client entry point for future UI work.

#### Scenario: Request targets the auth API namespace

- **WHEN** a request is sent to `/api/auth/*`
- **THEN** the request is delegated to the configured Better Auth handler

### Requirement: Authentication pages can read bootstrap availability from the server

The `web-cms` application SHALL expose a server-side bootstrap-state contract that the authentication pages can use to determine whether first-user onboarding is still available.

#### Scenario: Authentication page requests bootstrap state

- **WHEN** the welcome or login experience needs to know whether bootstrap onboarding is open
- **THEN** the application provides a typed server response that indicates whether any auth user already exists

### Requirement: Successful Google authentication enters the dashboard

The `web-cms` authentication flow SHALL direct both returning-user sign-in and first-user bootstrap completion to the dashboard home route after successful Google authentication.

#### Scenario: Returning user completes sign-in

- **WHEN** an existing linked Google user completes authentication successfully
- **THEN** the auth flow redirects the user to the dashboard home route instead of returning to a public auth page

#### Scenario: First user completes bootstrap sign-in

- **WHEN** the first valid Google user completes bootstrap authentication successfully
- **THEN** the auth flow redirects the user to the dashboard home route after the account is created
