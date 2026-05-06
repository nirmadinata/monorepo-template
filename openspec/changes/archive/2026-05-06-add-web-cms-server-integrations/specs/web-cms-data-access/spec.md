## ADDED Requirements

### Requirement: Web CMS uses the shared D1 database integration

The `web-cms` application SHALL resolve its primary D1 binding from the Worker environment and obtain its Drizzle database instance through `@repo/db/d1`'s shared `getDB()` integration. Server-side application code MUST use this shared accessor instead of creating a local Drizzle client for the same binding.

#### Scenario: Server code requests the app database

- **WHEN** a server-side integration or route in `web-cms` needs database access
- **THEN** it receives a Drizzle instance derived from the `MAIN_DB` binding through the shared `@repo/db/d1` getter

### Requirement: Web CMS reuses the shared D1 schema contract

The `web-cms` application SHALL reuse the schema exported by `@repo/db/d1` for auth-related database access and MUST NOT define duplicate local auth table definitions for the same D1 database.

#### Scenario: Auth integration needs database table metadata

- **WHEN** the authentication integration references auth tables or fields
- **THEN** it uses the schema exported from `@repo/db/d1` rather than app-local duplicate definitions
