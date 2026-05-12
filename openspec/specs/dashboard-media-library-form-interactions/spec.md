## ADDED Requirements

### Requirement: Media library filters use a TanStack Form-managed schema

The `web-cms` application SHALL manage the dashboard media-library search and filter controls with TanStack Form using the same schema-backed search contract that drives the route state.

#### Scenario: User updates media filters
- **WHEN** a signed-in user edits the media-library search, kind, or tag filters
- **THEN** the filter controls are managed by a TanStack Form instance backed by the media-library search schema

#### Scenario: User submits updated media filters
- **WHEN** a signed-in user applies the media-library search or filter form
- **THEN** the application updates the route search state using the schema-backed filter values
- **AND** resets pagination as needed for the new filter set

### Requirement: Media library tag editing uses TanStack Form validation and submission errors

The `web-cms` application SHALL manage media tag editing with TanStack Form so tag input normalization, validation, and submit failures are surfaced through the form state.

#### Scenario: User opens media tag editing
- **WHEN** a signed-in user opens the tag-edit interaction for a media item
- **THEN** the dialog initializes a TanStack Form instance with the media item's current tag values

#### Scenario: Tag submission fails
- **WHEN** the media tag update action fails during submission
- **THEN** the application surfaces the failure through the TanStack Form-managed error state for that tag-edit form

### Requirement: Media library upload uses TanStack Form-managed submission state and errors

The `web-cms` application SHALL manage media upload submission state and surfaced errors through TanStack Form even though file selection still relies on the browser's native file input behavior.

#### Scenario: User selects files to upload
- **WHEN** a signed-in user selects one or more files from the media-library upload control
- **THEN** the upload interaction enters a TanStack Form-managed submission flow for requesting upload intents, uploading file bytes, and finalizing metadata

#### Scenario: Upload or finalize fails
- **WHEN** an upload-related step fails for the selected files
- **THEN** the application surfaces the failure through the TanStack Form-managed submission error state
- **AND** the user is not limited to generic toast-only feedback to understand that the upload failed
