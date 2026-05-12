## Context

`apps/web-cms` currently provides a protected dashboard shell at `/dashboard`, a dashboard home page at `/dashboard/`, app-local D1 access under `src/integrations/db`, and app-local Cloudflare R2 helpers under `src/integrations/r2`. The R2 integration already supports presigned upload URLs, presigned download URLs, and object deletion, and the app already defines allowed image and video MIME types plus upload size limits.

The proposed media work adds a dashboard surface for managing uploaded assets. The user's intended experience is file-manager-like, but the current data model and app architecture are better aligned with an asset library: upload files, persist metadata, preview assets, browse paginated results, delete assets, and organize them with tags.

The schema groundwork is already present in `src/integrations/db/schema/application-specific-schema.ts` with `tags`, `mime_types`, `medias`, and `media_tags`. This design focuses on how that schema should participate in a first media-library feature without widening scope into folders, generic filesystem behavior, or media processing pipelines.

## Goals / Non-Goals

**Goals:**

- Add a new authenticated dashboard media-library surface for images and videos.
- Let users upload media into R2 while storing searchable metadata in D1.
- Support preview, paginated browsing, delete, and tag assignment from the dashboard.
- Reuse the existing dashboard shell, route layering, D1 integration, and R2 helpers instead of introducing a parallel stack.
- Keep the initial feature small enough to ship before adding richer CMS asset workflows.

**Non-Goals:**

- Building a true hierarchical file manager with folders, drag-and-drop tree navigation, or filesystem-like move semantics.
- Adding image transformations, video transcoding, thumbnail generation, or other derived-asset pipelines.
- Designing content-entry integrations that reference media from posts, pages, or blocks.
- Making media objects publicly accessible by default through a CDN or bucket policy change.
- Adding version history, trash/restore, or bulk-edit workflows in the first release.

## Decisions

### 1. Scope v1 as a dashboard media library, not a general file manager

The first release should behave like an asset library mounted inside the existing dashboard shell, not like a full filesystem UI. The main route should live under `/dashboard` as a dedicated media page, with the implementation owned by a feature area such as `src/features/dashboard-media-library/`.

This keeps the work aligned with the app's current route model:

- `src/routes/dashboard.tsx` remains the authenticated shell route.
- The media library becomes a nested dashboard route rather than a new top-level app surface.
- Dashboard navigation gains a concrete media entry instead of routing media work back to the generic `/dashboard` home.

Alternative considered: build a multi-pane file manager with folder trees and bulk operations from the start. Rejected because the current schema does not model folders or parent-child assets, and the app does not yet have the surrounding content workflows that would justify that complexity.

### 2. Treat D1 as the metadata source of truth and R2 as the binary store

The media library should separate concerns cleanly:

- R2 stores the uploaded file bytes.
- D1 stores media metadata, ownership timestamps, MIME information, and tag relationships.
- `storageKey` is the durable link between the metadata row and the object in R2.

The current schema is a reasonable foundation for that split:

- `medias` stores the core asset record.
- `tags` and `media_tags` model editorial organization.
- `mime_types` provides a normalized list of supported media types.

For v1, the implementation should preserve this normalized model rather than collapsing MIME type back into a freeform text column. That fits the schema already prepared and gives the app one place to seed or validate the media types it supports.

The schema review surfaced a few refinements worth adopting before implementation so the metadata model stays clear as the library grows.

The first release should continue to use one shared `medias` table for both images and videos. The current dashboard feature needs one browse surface, one pagination path, one tagging model, and one delete flow, and the proposed metadata shape is still mostly shared across those asset kinds. Nullable type-specific fields are an acceptable trade-off in v1 and avoid fragmenting the feature into parallel image/video tables before the product has differentiated processing or lifecycle requirements.

Field expectations should be explicit before implementation:

- `medias` should store both an upload filename and an editor-facing label. The recommended shape is an `originalFilename` field plus a separate optional display field named `name`.
- `name` should continue to mean the user-facing asset label and may be initialized from the uploaded filename on first upload.
- Media-management views should conceptually treat the display label as `name ?? originalFilename`.
- `storageKey` is immutable after upload and should not be treated as display text.
- Width and height should be modeled as generic media dimensions rather than image-only fields so the same columns can describe videos.
- Alt text should stay optional and should be named according to the intended semantics (`imageAltText` if strictly image-specific, or `altText` if the product wants a more general label field).
- Duration should use an explicit seconds-based field name such as `durationSeconds` and remain nullable when unavailable.
- Authored foreign keys must stay type-consistent with `users.id`; the current schema and checked-in migration should be aligned before implementation begins.
- The MIME lookup foreign key should use an explicit SQL column name and should not cascade-delete media records if a MIME lookup row changes.

Recommended v1 shape:

- `mime_types`: `id`, `mime_type`, `kind`, `title`, `description`
- `medias`: `id`, `mime_type_id`, `original_filename`, optional display `name`, `description`, `storage_key`, `size_in_bytes`, optional `width`, optional `height`, optional `alt_text`, optional `duration_seconds`, authored fields, timestamps

Alternative considered: store only raw MIME strings on `medias` and infer all other metadata later. Rejected because the current prepared schema already models MIME normalization and optional media-specific metadata well enough for the requested scope.

Alternative considered: omit `mime_types.kind` and derive broad categories entirely from the raw MIME string at query or UI time. Rejected because an explicit `kind` value keeps filtering and labeling simpler in the dashboard and leaves room for future document support without scattering MIME-prefix logic across the app.

Alternative considered: rename the display field to `title` while adding `originalFilename`. Rejected because keeping the existing `name` concept is simpler for the current app as long as the schema clearly distinguishes display name from uploaded filename.

Alternative considered: keep a single overloaded `name` field and image-specific metadata column names. Rejected because the library needs to distinguish uploaded filenames from editor-facing labels, and video assets also benefit from generic width/height semantics.

Alternative considered: split the data model into separate image and video tables in v1. Rejected because the current media-library requirements still share one administrative browse, upload, tag, preview, and delete workflow, and a split model would add query and UI complexity before type-specific processing needs justify it.

### 3. Use direct-to-R2 upload with a server-coordinated finalize step

The upload flow should minimize Worker memory usage and reuse the existing presigned-upload infrastructure.

Recommended flow:

1. The dashboard client requests an upload intent from the server.
2. The server validates file type and size, generates a `storageKey`, and returns a presigned R2 upload URL.
3. The browser uploads the file directly to R2.
4. The client calls a finalize action that inserts the `medias` row and any tag relationships into D1.

This flow matches the current `src/integrations/r2/repository.ts` surface and avoids proxying large uploads through application handlers.

Alternative considered: stream the file through an app server function and write both R2 and D1 in one request. Rejected because the app already has presigned URL helpers, and direct upload is a better fit for larger media payloads and Cloudflare deployment constraints.

Trade-off acknowledged: direct upload introduces a failure mode where an object may exist in R2 before the metadata finalize step succeeds. For v1 this is acceptable if the implementation keeps the sequence explicit and treats orphan cleanup as an operational edge case rather than blocking the main flow.

The finalize step should also be designed for safe retry behavior around the chosen `storageKey` so a successful upload can be completed without creating duplicate metadata if the first finalize attempt fails partway through.

### 4. Use signed preview and download URLs instead of assuming public objects

The current app does not document public bucket access for media objects, but it already has a presigned download helper. The media library should therefore treat previews and downloads as signed URL use cases.

That means:

- the list page reads metadata from D1,
- visible assets request short-lived signed URLs for preview or download,
- the feature does not require a public CDN policy as part of the first release.

Alternative considered: expose all uploaded media through stable public URLs. Rejected because it would couple the library to bucket-publicity decisions that the current app has not made yet.

### 5. Paginate from D1 and sort newest-first

The main media browse view should be driven by paginated D1 queries ordered by newest upload first. A simple paginated admin view fits the current dashboard better than an infinite-scroll asset browser.

The initial list should be designed around:

- descending `createdAt` ordering,
- a stable secondary sort such as `id` for ties,
- page-level queries rather than loading the full library at once,
- lightweight filter extensions for media type and tags when needed.

To support that query shape cleanly, the database design should plan for indexes that match the browse experience, especially a newest-first pagination path keyed by `createdAt` plus a stable tiebreaker.

This keeps the data model compatible with a table or grid presentation without requiring the user to navigate a folder hierarchy.

Alternative considered: start with infinite scroll and cursor-driven browse behavior. Rejected for v1 because the current request is for a paginated list, and numbered pages are easier to reason about in an admin-style dashboard.

### 6. Design the first media UI around explicit admin states

The first dashboard media page should behave like a clear administrative workspace rather than a generic gallery. The app already has dashboard card, table, empty-state, alert-dialog, badge, pagination, and skeleton primitives, so the media experience should stay close to that language.

Recommended primary states:

```text
Default list state

┌──────────────────────────────────────────────────────────────┐
│ Media Library                            [Upload files]     │
│ Search by name...   [Type filter] [Tag filter]              │
├──────────────────────────────────────────────────────────────┤
│ [thumb]  Hero image        image/jpeg   1.8 MB   3 tags     │
│ [thumb]  Launch reel       video/mp4    24 MB    1 tag      │
│ [thumb]  Logo alt          image/svg+xml 42 KB   0 tags     │
├──────────────────────────────────────────────────────────────┤
│ Pagination controls                                         │
└──────────────────────────────────────────────────────────────┘
```

```text
Empty state

┌──────────────────────────────────────────────┐
│              No media uploaded yet           │
│ Upload your first image or video to start.   │
│              [Upload files]                  │
└──────────────────────────────────────────────┘
```

```text
Uploading state

┌──────────────────────────────────────────────┐
│ Uploading 3 files                            │
│ hero.jpg      [##########....] 72%           │
│ reel.mp4      [######........] 43%           │
│ logo.svg      [##############] done          │
└──────────────────────────────────────────────┘
```

```text
Load or preview failure state

┌──────────────────────────────────────────────┐
│ Some media previews could not be loaded.     │
│ Metadata remains visible and retry is        │
│ available without hiding the media rows.     │
└──────────────────────────────────────────────┘
```

```text
Delete confirmation

┌──────────────────────────────────────────────┐
│ Delete media?                                │
│ This permanently removes the file from R2    │
│ and deletes its metadata and tag links.      │
│      [Cancel]             [Delete media]     │
└──────────────────────────────────────────────┘
```

The page does not need every view mode on day one. One strong default browse mode is enough for v1 as long as it supports:

- a visible page title and primary upload action,
- name-based search,
- lightweight type and tag filtering,
- a preview column or thumbnail area,
- metadata columns or badges for type, size, and tags,
- explicit pagination controls,
- empty, loading, and error states that do not hide useful metadata.

Alternative considered: lead with a visually rich masonry or gallery-first interface. Rejected because the requested feature is an editorial management tool with upload, tagging, deletion, and pagination needs that fit an admin-style list more naturally.

### 7. Seed `mime_types` from the currently allowed upload surface

The app already defines its allowed upload surface in `src/integrations/r2/constants.ts`. The initial `mime_types` seed should match that supported set so validation rules and metadata lookup rows stay aligned.

For v1, `mime_types` should stay system-managed and seed-driven rather than dashboard-editable. In the current app, the real supported upload surface is still defined by validation logic and constants, so exposing dashboard CRUD for MIME rows would create drift risk unless the entire validation pipeline moved to a database-driven configuration model.

Recommended v1 seed set:

- `image/jpeg` with kind `image`
- `image/png` with kind `image`
- `image/gif` with kind `image`
- `image/webp` with kind `image`
- `image/svg+xml` with kind `image`
- `video/mp4` with kind `video`
- `video/webm` with kind `video`
- `video/quicktime` with kind `video`

PDF support should stay out of the initial media-library scope unless the product explicitly decides that documents belong in the same dashboard library. The app already defines a PDF MIME constant, but the current media upload constants separate `ALLOWED_MEDIA_MIME_TYPES` from the PDF type, which is a useful signal that documents should remain a separate decision.

Alternative considered: seed a broader MIME catalog up front. Rejected because the library only needs rows for types the current app actually accepts, and a narrower seed set reduces ambiguity around preview behavior, validation, and UI labeling.

Alternative considered: expose `mime_types` CRUD in the dashboard. Rejected for v1 because MIME support is infrastructure configuration rather than editorial content, and allowing manual edits would make it too easy for the dashboard lookup rows to diverge from the actual upload validation rules.

### 8. Keep tags global and many-to-many in the first release

The existing `tags` and `media_tags` tables already model the simplest useful editorial tagging system: one global tag namespace with many-to-many assignment.

V1 should keep that shape:

- tags are reusable across all media assets,
- a media asset can have many tags,
- tag creation can happen inline from media-management flows,
- tag uniqueness remains global through unique `name` and `slug` values.

Alternative considered: add folders first and defer tags. Rejected because tags are already in the prepared schema and provide organization value without introducing hierarchy semantics.

Trade-off acknowledged: a single global tag namespace may become noisy as the CMS grows. That is acceptable now because the app does not yet have teams, workspaces, or other scoping concepts attached to media.

### 9. Use hard delete for v1 while no other app features reference media

The current app does not yet model content entries or other records that reference uploaded media. Because of that, the first release should use hard delete semantics:

- load the media row to resolve its `storageKey`,
- delete the corresponding R2 object first,
- delete the D1 metadata row second,
- remove tag links through cascade behavior.

Deleting R2 before D1 keeps failed deletes visible in the admin surface. If object deletion fails, the metadata row still exists and the operation can be retried instead of silently orphaning an object after the database record disappears.

Alternative considered: add soft delete or a trash bin immediately. Rejected because there is no current content-reference graph to protect, and a recycle-bin workflow would add UI and query complexity before the rest of the CMS depends on media records.

This decision should be revisited as soon as content models start storing `medias.id` references. At that point, deletion may need reference checks, usage indicators, or soft-delete behavior.

### 10. Keep infrastructure in integrations and feature logic in the new media feature area

The repository already separates app infrastructure from route presentation:

- D1 and R2 clients live under `src/integrations/`.
- The dashboard shell owns authenticated layout concerns.
- Route files remain thin.

The media library should follow the same pattern:

- `src/integrations/db` and `src/integrations/r2` remain the infrastructure boundary.
- feature-specific server actions, queries, and page components live under a dedicated dashboard media feature area.
- route files under `src/routes/` only compose loaders/components and do not become the home for storage logic.

Alternative considered: place all media logic inside `src/integrations/` because uploads touch infra concerns. Rejected because media-library behavior is an application feature built on top of integrations, not an integration by itself.

## Risks / Trade-offs

- [R2 objects can become orphaned if direct upload succeeds and metadata finalize fails] -> Mitigation: make the finalize step explicit, generate deterministic storage keys, and treat orphan cleanup as follow-up operational work if it proves common.
- [Signed preview URLs add server work for paginated lists] -> Mitigation: generate preview URLs only for the current page of visible assets and keep URL lifetimes short.
- [Client-derived metadata such as image dimensions or video duration can be incomplete] -> Mitigation: keep these fields nullable and avoid making media processing a prerequisite for upload completion.
- [Hard delete may become unsafe once content records reference media] -> Mitigation: scope v1 to standalone asset management and revisit delete behavior before integrating media into content models.
- [Global tags may become messy without taxonomy governance] -> Mitigation: keep the initial tagging UI lightweight and defer scoped taxonomies or admin tag governance until the CMS has stronger editorial structure.

## Migration Plan

1. Finalize the `media-library` change artifacts so the capability contract is clear before implementation.
2. Convert the prepared D1 schema into checked-in migrations and seed the supported MIME types needed by the library.
3. Add the dashboard media route, navigation entry, feature-owned page UI, and server actions using the existing dashboard shell plus `src/integrations/db` and `src/integrations/r2`.
4. Validate the end-to-end flow locally: upload, finalize metadata, preview signed media, paginate results, tag assets, and delete assets.

Rollback strategy:

- remove the dashboard media route and feature surface,
- remove the new schema migration if the change is backed out before production data depends on it,
- keep the existing dashboard shell and R2 integrations unchanged because this feature builds on them rather than replacing them.

## Open Questions

- Should alt text remain image-specific in the schema and UI, or should the field be renamed to a more general `altText` shape before implementation begins?
- Should the media library eventually expose a dedicated tag-management UI beyond the freeform inline tag creation supported in v1?
