import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { users } from "./better-auth-schema";
import { COLUMN_ALIASES } from "./constants";

const DEFAULT_CURRENT_SECONDS = sql`(cast(unixepoch('subsecond') as integer))`;

const COMMON_COLUMNS = {
    createdAt: int("created_at", { mode: "timestamp" }).notNull().default(DEFAULT_CURRENT_SECONDS),
    updatedAt: int("updated_at", { mode: "timestamp" })
        .default(DEFAULT_CURRENT_SECONDS)
        .$onUpdate(() => DEFAULT_CURRENT_SECONDS),
} as const;

const COMMON_AUTHORED_COLUMNS = {
    createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
} as const;

export const tags = sqliteTable(
    "tags",
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID).primaryKey({ autoIncrement: true }),
        name: text("name", { length: 100 }).notNull().unique(),
        slug: text("slug").notNull().unique(),
    },
    (table) => [index("idx_tags_name").on(table.name), index("idx_tags_slug").on(table.slug)]
);

export const mimeTypes = sqliteTable(
    "mime_types",
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID).primaryKey({ autoIncrement: true }),
        kind: text("kind").notNull(),
        mimeType: text("mime_type").notNull().unique(),
        title: text("title"),
        description: text("description"),
    },

    (table) => [index("idx_mime_types_mime_type").on(table.mimeType)]
);

export const medias = sqliteTable(
    "medias",
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID).primaryKey({ autoIncrement: true }),
        mimeTypeId: int("mime_type_id")
            .notNull()
            .references(() => mimeTypes.id),
        name: text("name"),
        description: text("description"),
        originalFilename: text("original_filename"),
        storageKey: text("storage_key").notNull().unique(),
        sizeInBytes: int("size_in_bytes").notNull(),
        width: int("width"),
        height: int("height"),
        imageAltText: text("image_alt_text"),
        durationSeconds: int("duration_seconds"),
    } as const,
    (table) => [
        index("idx_medias_created_at").on(table.createdAt),
        index("idx_medias_mime_type_id").on(table.mimeTypeId),
        index("idx_medias_name").on(table.name),
    ]
);

export const mediaTags = sqliteTable(
    "media_tags",
    {
        ...COMMON_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID).primaryKey({ autoIncrement: true }),
        mediaId: int("media_id")
            .notNull()
            .references(() => medias.id, { onDelete: "cascade" }),
        tagId: int("tag_id")
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("idx_media_tags_media_id").on(table.mediaId),
        index("idx_media_tags_tag_id").on(table.tagId),
        uniqueIndex("media_tags_media_id_tag_id_unique").on(table.mediaId, table.tagId),
    ]
);

export const posts = sqliteTable(
    "posts",
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID).primaryKey({ autoIncrement: true }),
        slug: text("slug").notNull().unique(),
        cover_image_id: int("cover_image_id").references(() => medias.id),

        title: text("title").notNull(),
        excerpt: text("excerpt", { length: 160 }).notNull(),
        content_key: text("content_key").notNull().unique(),

        status: text("status", { enum: ["draft", "published", "unpublished"] })
            .notNull()
            .default("draft"),
        publishedAt: int("first_published_at", { mode: "timestamp" }),
    },
    (table) => [index("idx_posts_slug").on(table.slug), index("idx_posts_status").on(table.status)]
);

export const postEditors = sqliteTable(
    "post_editors",
    {
        ...COMMON_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID).primaryKey({ autoIncrement: true }),
        postId: int("post_id")
            .notNull()
            .references(() => posts.id, { onDelete: "cascade" }),
        editorId: text("editor_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("idx_post_editors_post_id").on(table.postId),
        index("idx_post_editors_editor_id").on(table.editorId),
        uniqueIndex("post_editors_post_id_editor_id_unique").on(table.postId, table.editorId),
    ]
);

export const postTags = sqliteTable(
    "post_tags",
    {
        ...COMMON_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID).primaryKey({ autoIncrement: true }),
        postId: int("post_id")
            .notNull()
            .references(() => posts.id, { onDelete: "cascade" }),
        tagId: int("tag_id")
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("idx_post_tags_post_id").on(table.postId),
        index("idx_post_tags_tag_id").on(table.tagId),
        uniqueIndex("post_tags_post_id_tag_id_unique").on(table.postId, table.tagId),
    ]
);

export const tagRelations = relations(tags, ({ many }) => ({
    mediaTags: many(mediaTags),
}));

export const mimeTypeRelations = relations(mimeTypes, ({ many }) => ({
    medias: many(medias),
}));

export const mediaRelations = relations(medias, ({ one, many }) => ({
    mimeType: one(mimeTypes, { fields: [medias.mimeTypeId], references: [mimeTypes.id] }),
    tags: many(mediaTags),
}));

export const mediaTagRelations = relations(mediaTags, ({ one }) => ({
    media: one(medias, { fields: [mediaTags.mediaId], references: [medias.id] }),
    tag: one(tags, { fields: [mediaTags.tagId], references: [tags.id] }),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
    coverImage: one(medias, { fields: [posts.cover_image_id], references: [medias.id] }),
    tags: many(postTags),
}));

export const postTagRelations = relations(postTags, ({ one }) => ({
    post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
    tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}));

export const postEditorRelations = relations(postEditors, ({ one }) => ({
    post: one(posts, { fields: [postEditors.postId], references: [posts.id] }),
    editor: one(users, { fields: [postEditors.editorId], references: [users.id] }),
}));
