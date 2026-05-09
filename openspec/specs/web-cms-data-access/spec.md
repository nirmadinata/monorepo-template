## ADDED Requirements

### Requirement: Web CMS uses the app-local D1 database integration

The `web-cms` application SHALL resolve its primary D1 binding from the Worker environment and obtain its Drizzle database instance through the shared D1 integration owned under `src/integrations/db`. Server-side application code MUST use this shared accessor instead of creating another Drizzle client for the same binding.

#### Scenario: Server code requests the app database

- **WHEN** a server-side integration or route in `web-cms` needs database access
- **THEN** it receives a Drizzle instance derived from the `MAIN_DB` binding through the shared `src/integrations/db` getter

### Requirement: Web CMS reuses the app-local D1 schema contract

The `web-cms` application SHALL reuse the schema exported by `src/integrations/db` for auth-related database access and MUST NOT define duplicate auth table definitions for the same D1 database elsewhere in the app.

#### Scenario: Auth integration needs database table metadata

- **WHEN** the authentication integration references auth tables or fields
- **THEN** it uses the schema exported from `src/integrations/db` rather than duplicate auth table definitions elsewhere in the app
