## ADDED Requirements

### Requirement: Authenticated users can open a dashboard media-library route

The `web-cms` application SHALL expose a dedicated authenticated dashboard route for browsing and managing uploaded media inside the reusable dashboard shell.

#### Scenario: Authenticated user opens the media library

- **WHEN** a signed-in user visits the dashboard media-library route
- **THEN** the application renders the media-library page inside the authenticated dashboard shell

#### Scenario: Unauthenticated user opens the media library

- **WHEN** a user without a valid auth session visits the dashboard media-library route
- **THEN** the application does not expose media-library content and redirects the user to the login route through the existing dashboard shell protection

#### Scenario: Dashboard navigation exposes the media library

- **WHEN** a signed-in user views the dashboard sidebar navigation
- **THEN** the application shows a navigation item for the media-library route

### Requirement: Media library supports direct upload with stored metadata

The `web-cms` application SHALL let authenticated users upload supported image and video files through the dashboard media library while storing asset metadata in D1 and file bytes in R2.

#### Scenario: User uploads a supported media file

- **WHEN** a signed-in user uploads a supported image or video file from the media library
- **THEN** the application issues a validated upload intent
- **AND** the browser uploads the file bytes directly to R2
- **AND** the application finalizes the upload by storing the media metadata in D1

#### Scenario: Uploaded file initializes display metadata

- **WHEN** a newly uploaded file is finalized without a custom display name
- **THEN** the application stores the uploaded filename separately from the display `name`
- **AND** the display `name` is initialized from the uploaded filename

#### Scenario: Unsupported file type is uploaded

- **WHEN** a signed-in user attempts to upload a file whose MIME type is not supported by the media library
- **THEN** the application rejects the upload before issuing a presigned upload URL

#### Scenario: Oversized file is uploaded

- **WHEN** a signed-in user attempts to upload a file that exceeds the configured media-library size limit for its supported type
- **THEN** the application rejects the upload before issuing a presigned upload URL

#### Scenario: Upload finalize is retried after a successful direct upload

- **WHEN** a supported file has already been uploaded to R2 and the client retries the finalize step for the same `storageKey`
- **THEN** the application completes the finalize flow without creating duplicate media records for that upload

### Requirement: Media library stores normalized MIME metadata

The `web-cms` application SHALL associate each media record with a normalized MIME lookup row rather than storing raw MIME text directly on the media record.

#### Scenario: Media finalize resolves MIME lookup row

- **WHEN** a supported upload is finalized
- **THEN** the application links the media record to a seeded `mime_types` row for that MIME type
- **AND** the lookup row includes a broad `kind` classification used for dashboard filtering and labeling

#### Scenario: MIME lookup rows remain system-managed

- **WHEN** the media library is available in the dashboard
- **THEN** the supported MIME lookup rows are managed by the system seed and validation contract
- **AND** the application does not require dashboard CRUD for MIME lookup rows in the first release

### Requirement: Media library shows paginated asset results with metadata and previews

The `web-cms` application SHALL let authenticated users browse uploaded media through a paginated dashboard view that surfaces metadata, tags, and signed previews for the visible page.

#### Scenario: User opens a populated media library

- **WHEN** a signed-in user opens the media library and media records exist
- **THEN** the application shows a paginated list of media ordered newest-first with a stable tiebreaker
- **AND** each visible row includes enough metadata to identify the asset, including display name, MIME information, size, and tags

#### Scenario: User filters or searches media results

- **WHEN** a signed-in user searches by name or filters by media type or tag
- **THEN** the media-library view updates the paginated results to reflect the requested filter criteria

#### Scenario: User moves between result pages

- **WHEN** a signed-in user navigates from one media results page to another
- **THEN** the application renders the requested page of paginated media results using the same newest-first ordering and active filter criteria

#### Scenario: Media page requests previews for visible rows

- **WHEN** the media library renders a page of visible assets
- **THEN** the application generates signed preview or download access only for the assets needed by that page

#### Scenario: Preview generation fails for a visible asset

- **WHEN** preview or signed URL generation fails for a media row
- **THEN** the application keeps the row metadata visible in the media-library view
- **AND** the failure does not remove the rest of the current page results

### Requirement: Media library exposes clear empty and in-progress states

The `web-cms` application SHALL provide explicit dashboard states for an empty media library and in-progress uploads.

#### Scenario: User opens an empty media library

- **WHEN** a signed-in user opens the media-library route and no media records exist
- **THEN** the application renders an empty state explaining that no media has been uploaded yet
- **AND** the empty state includes a clear upload call to action

#### Scenario: User uploads multiple files

- **WHEN** a signed-in user uploads one or more files from the media library
- **THEN** the application exposes in-progress upload feedback for the files being uploaded

### Requirement: Media library supports global tags on media assets

The `web-cms` application SHALL allow authenticated users to organize media assets with globally reusable tags.

#### Scenario: User assigns tags to a media asset

- **WHEN** a signed-in user assigns one or more tags to a media asset
- **THEN** the application stores the relationship through the media-tag join table
- **AND** the media asset can hold multiple tags

#### Scenario: User reuses an existing tag

- **WHEN** a signed-in user assigns a tag name that already exists in the media library
- **THEN** the application reuses the existing global tag instead of creating a duplicate tag record

#### Scenario: User assigns a new tag name

- **WHEN** a signed-in user assigns a tag name that does not yet exist in the media library
- **THEN** the application creates a new global tag record
- **AND** links that tag to the selected media asset

### Requirement: Media library uses hard delete while media is standalone

The `web-cms` application SHALL let authenticated users permanently delete standalone media assets from the dashboard media library.

#### Scenario: User confirms media deletion

- **WHEN** a signed-in user confirms deletion of a media asset
- **THEN** the application deletes the backing R2 object first
- **AND** deletes the D1 media record second
- **AND** removes media-tag relationships through the configured cascade behavior

#### Scenario: Object deletion fails during media removal

- **WHEN** the application cannot delete the R2 object for a selected media asset
- **THEN** the application keeps the media metadata record available for retry instead of removing the database row first
