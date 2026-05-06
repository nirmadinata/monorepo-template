## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Authentication pages can read bootstrap availability from the server

The `web-cms` application SHALL expose a server-side bootstrap-state contract that the authentication pages can use to determine whether first-user onboarding is still available.

#### Scenario: Authentication page requests bootstrap state

- **WHEN** the welcome or login experience needs to know whether bootstrap onboarding is open
- **THEN** the application provides a typed server response that indicates whether any auth user already exists
