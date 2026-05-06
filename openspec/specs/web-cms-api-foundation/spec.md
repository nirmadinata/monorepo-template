## ADDED Requirements

### Requirement: Web CMS exposes a dedicated public API foundation

The `web-cms` application SHALL expose a dedicated public API namespace through a catch-all server route that delegates to a Hono application built with `OpenAPIHono`. Future public API endpoints MUST register through this shared Hono application rather than standalone transport-specific handlers.

#### Scenario: Request targets the public API namespace

- **WHEN** a request is sent to the configured public API namespace
- **THEN** the request is handled by the shared `OpenAPIHono` application for `web-cms`

### Requirement: Public API foundation publishes OpenAPI and Scalar docs

The `web-cms` public API foundation SHALL publish an OpenAPI document endpoint and a Scalar-powered API reference UI endpoint within the public API namespace.

#### Scenario: OpenAPI document is requested

- **WHEN** a client requests the configured OpenAPI document endpoint
- **THEN** the system returns the generated OpenAPI description for the public API foundation

#### Scenario: Scalar reference UI is requested

- **WHEN** a client requests the configured API reference UI endpoint
- **THEN** the system serves the Scalar-based documentation experience for the same OpenAPI document

### Requirement: Public API routes are defined with typed OpenAPI metadata

The `web-cms` public API foundation SHALL support route registration using `@hono/zod-openapi` route definitions and a shared validation/error-handling strategy so registered routes contribute both runtime validation and OpenAPI metadata.

#### Scenario: New OpenAPI route module is registered

- **WHEN** a route module is added through the shared public API registration mechanism
- **THEN** its request/response schema contributes to both request validation and the generated OpenAPI document
