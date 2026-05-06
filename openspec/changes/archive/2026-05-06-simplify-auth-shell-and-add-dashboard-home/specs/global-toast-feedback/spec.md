## ADDED Requirements

### Requirement: Toast notifications are mounted globally

The `web-cms` application SHALL provide a globally mounted toast surface so notifications can be displayed from public and authenticated routes without route-local setup.

#### Scenario: Application shell renders

- **WHEN** the root application shell is rendered
- **THEN** a Sonner toaster is mounted once for the app

#### Scenario: Toast is displayed

- **WHEN** application code triggers a toast notification
- **THEN** the notification appears in the top-right corner using the active theme
