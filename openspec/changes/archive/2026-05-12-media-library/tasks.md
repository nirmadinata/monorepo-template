## 1. Refine the media schema

- [x] 1.1 Add `originalFilename` to `medias` so uploaded filenames are stored separately from the display `name`.
- [x] 1.2 Rename the MIME foreign-key column to an explicit SQL name such as `mime_type_id` while keeping the application mapping clear.
- [x] 1.3 Rename image-only width and height columns to generic media dimension fields.
- [x] 1.4 Rename `duration` to a seconds-based field such as `durationSeconds`.
- [x] 1.5 Decide whether alt text remains image-specific or is renamed to a more general `altText` field.
- [x] 1.6 Add `kind` to `mime_types` so dashboard filtering and labeling do not depend on parsing raw MIME prefixes at runtime.
- [x] 1.7 Align `created_by` and `updated_by` column types with `users.id`.
- [x] 1.8 Change the `medias -> mime_types` foreign key so deleting a MIME lookup row does not cascade-delete media records.

## 2. Generate and check in the database changes

- [x] 2.1 Generate the updated Drizzle migration for the refined media schema.
- [x] 2.2 Review the generated SQL to confirm the media tables, foreign keys, and indexes match the approved design.
- [x] 2.3 Check in the migration and any updated Drizzle metadata files.

## 3. Seed supported MIME types

- [x] 3.1 Create a seed path for the initial `mime_types` rows.
- [x] 3.2 Seed the approved image MIME rows: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, and `image/svg+xml`.
- [x] 3.3 Seed the approved video MIME rows: `video/mp4`, `video/webm`, and `video/quicktime`.
- [x] 3.4 Store explicit `kind` values for each seeded row.
- [x] 3.5 Keep `mime_types` system-managed for v1 instead of exposing dashboard CRUD for lookup rows.

## 4. Align upload validation with the MIME lookup surface

- [x] 4.1 Keep the upload-intent validation rules aligned with the approved image and video MIME set.
- [x] 4.2 Reject unsupported files before issuing presigned upload URLs.
- [x] 4.3 Keep PDF support out of the media-library upload flow unless the change scope is intentionally expanded.

## 5. Add server workflows for upload intent and finalize

- [x] 5.1 Add a media-library server action to request an upload intent.
- [x] 5.2 Validate file size and MIME type in the upload-intent step.
- [x] 5.3 Generate the `storageKey` during upload intent creation.
- [x] 5.4 Use the existing R2 helper surface to return a presigned upload URL.
- [x] 5.5 Add a finalize action that creates the `medias` row after a successful direct upload.
- [x] 5.6 Initialize the display `name` from the uploaded filename when no custom name is provided.
- [x] 5.7 Resolve the seeded MIME lookup row during finalize instead of storing raw MIME text directly on `medias`.
- [x] 5.8 Make finalize safe to retry around the chosen `storageKey` so repeated requests do not create duplicate media records.

## 6. Add server workflows for listing and preview access

- [x] 6.1 Add a paginated media-list query ordered by newest-first with a stable tiebreaker.
- [x] 6.2 Add name-based search to the list query.
- [x] 6.3 Add MIME kind and tag filtering to the list query.
- [x] 6.4 Return tag metadata with each media row needed by the dashboard list.
- [x] 6.5 Add signed preview or download URL generation for the current page of visible assets.
- [x] 6.6 Keep preview failures non-fatal so metadata still renders when a signed URL cannot be produced.

## 7. Add server workflows for tags

- [x] 7.1 Add a query or helper that lists available tags for media assignment.
- [x] 7.2 Add tag-creation behavior for freeform inline tag entry.
- [x] 7.3 Add media-tag assignment behavior using the `media_tags` join table.
- [x] 7.4 Prevent duplicate media-tag pairs by relying on the unique join constraint and handling retries cleanly.

## 8. Add server workflow for hard delete

- [x] 8.1 Load the media row before deletion so the server can resolve the `storageKey`.
- [x] 8.2 Delete the R2 object first.
- [x] 8.3 Delete the D1 media row second.
- [x] 8.4 Rely on cascade deletion for `media_tags` cleanup.
- [x] 8.5 Keep failed R2 deletes visible to the admin flow by not removing the D1 row first.

## 9. Add the dashboard route and navigation entry

- [x] 9.1 Add a dedicated nested dashboard route for the media library.
- [x] 9.2 Add a concrete media navigation item to the dashboard sidebar.
- [x] 9.3 Keep the dashboard shell and auth-gated route behavior unchanged aside from the new route and navigation entry.

## 10. Build the primary media list UI

- [x] 10.1 Add a page header with the media-library title and primary upload action.
- [x] 10.2 Add the default browse layout using the existing dashboard UI primitives.
- [x] 10.3 Show thumbnails or preview cells for visible media rows.
- [x] 10.4 Show metadata for display name, MIME type, size, and tags.
- [x] 10.5 Add search and filter controls for name, type, and tags.
- [x] 10.6 Add explicit pagination controls.

## 11. Build the non-default UI states

- [x] 11.1 Add the empty-library state with a first upload call to action.
- [x] 11.2 Add the uploading state with per-file progress feedback.
- [x] 11.3 Add a partial-failure state for preview or URL-loading problems without hiding metadata rows.
- [x] 11.4 Add delete confirmation before permanent removal.

## 12. Validate the feature and update guidance

- [ ] 12.1 Add or update narrow tests for schema-sensitive server flows, especially upload finalize, pagination, tag assignment, and hard delete.
- [ ] 12.2 Add or update narrow UI tests for the list, empty, upload, failure, and delete-confirmation states.
- [x] 12.3 Run the narrowest useful `web-cms` validation for the media-library changes and fix any introduced issues.
- [x] 12.4 Update app documentation and agent guidance if the dashboard navigation, maintained feature map, or data ownership descriptions change during implementation.
