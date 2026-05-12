## ADDED Requirements

### Requirement: Web CMS forms use TanStack Form as the primary form state model

The `web-cms` application SHALL implement user-editable form interactions with TanStack Form so each form has explicit managed values, submit state, and error state instead of ad-hoc local state or button-only action handlers.

#### Scenario: A feature introduces a new form interaction
- **WHEN** a user-editable form interaction is added to `apps/web-cms`
- **THEN** the interaction is implemented with a TanStack Form instance that owns the form values, submission state, and surfaced validation or submission errors

#### Scenario: A form submission is pending
- **WHEN** a TanStack Form-managed submission is in progress in `apps/web-cms`
- **THEN** the form exposes pending submission state through the form model so the UI can disable or otherwise reflect the in-progress action consistently

### Requirement: Web CMS forms define schema-backed validation contracts

The `web-cms` application SHALL define a schema-backed validation contract for each TanStack Form-managed form so client-side form state does not drift from the route or server expectations that the feature depends on.

#### Scenario: A form reuses an existing route or server contract
- **WHEN** a form in `apps/web-cms` already corresponds to an existing route-search schema or server payload schema
- **THEN** the application reuses or derives the form validation contract from that schema instead of creating an unrelated validation shape

#### Scenario: A form captures invalid input
- **WHEN** a user enters a value that violates the form's schema-backed validation rules
- **THEN** the application surfaces the validation failure through the TanStack Form state before or during submission

### Requirement: Web CMS forms surface actionable field-level and form-level errors

The `web-cms` application SHALL present actionable validation and submission failures through the TanStack Form state so users can identify whether a problem belongs to a specific field or to the overall submission.

#### Scenario: A submission fails for one field
- **WHEN** a form submission fails because a specific field value is invalid or unacceptable
- **THEN** the application surfaces the failure on that field through the TanStack Form-managed error state

#### Scenario: A submission fails for a non-field reason
- **WHEN** a form submission fails for a reason that is not attributable to one field
- **THEN** the application surfaces a form-level error through the TanStack Form-managed error state
- **AND** the user can understand that the submission failed without relying only on a toast notification
