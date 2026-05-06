## ADDED Requirements

### Requirement: Web CMS auth uses Better Auth with Google-only sign-in

The `web-cms` application SHALL expose Better Auth backed by the shared D1 database integration, with explicit adapter mapping for the existing aliased auth schema in `@repo/db/d1`. The authentication system MUST enable Google OAuth sign-in and MUST NOT enable email/password or additional social providers in this change.

#### Scenario: Auth server is initialized

- **WHEN** the Better Auth server configuration is created for `web-cms`
- **THEN** it uses the shared D1-backed adapter with the `@repo/db/d1` auth schema mapping and exposes Google as the only sign-in provider

### Requirement: Sign-up is restricted to the first user

The `web-cms` authentication system SHALL allow creation of a new user through Google OAuth only when no user record exists in the shared auth schema. After the first user has been created, the system MUST reject sign-in attempts from previously unseen Google identities and MUST continue to allow returning users whose Google account is already linked.

#### Scenario: First Google user signs in to an empty system

- **WHEN** no user exists in the shared auth tables and a valid Google OAuth callback is received
- **THEN** the system allows the user and account records to be created

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
