/**
 * application-specific tables
 */

import { relations, sql } from "drizzle-orm";
import { index, int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { COLUMN_ALIASES } from "#/integrations/db/constants";
import { users } from "#/integrations/db/schema/better-auth-schema";

/**
 * common constants
 */

const DEFAULT_CURRENT_SECONDS = sql`(cast(unixepoch('subsecond') as integer))`;

/**
 * common columns
 */
const COMMON_COLUMNS = {
    createdAt: int("created_at", { mode: "timestamp" }).notNull().default(DEFAULT_CURRENT_SECONDS),
    updatedAt: int("updated_at", { mode: "timestamp" })
        .default(DEFAULT_CURRENT_SECONDS)
        .$onUpdate(() => DEFAULT_CURRENT_SECONDS),
} as const;

const COMMON_AUTHORED_COLUMNS = {
    createdBy: int("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: int("updated_by").references(() => users.id, { onDelete: "set null" }),
} as const;

/**
 * application-specific tables
 */

export const tags = sqliteTable(
    "tags",
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),
        name: text("name", { length: 100 }).notNull().unique(),
        slug: text("slug").notNull().unique(),
    },
    (table) => [
        /**
         * primary key
         */
        primaryKey({ columns: [table.id] }),

        /**
         * indexes
         */
        index("idx_tags_name").on(table.name),
        index("idx_tags_slug").on(table.slug),
    ]
);

export const mimeTypes = sqliteTable(
    "mime_types",
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),
        mimeType: text("mime_type").notNull().unique(),
        title: text("title"),
        description: text("description"),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({ columns: [table.id] }),

        /**
         * indexes
         */
        index("idx_mime_types_mime_type").on(table.mimeType),
    ]
);

export const medias = sqliteTable(
    "medias",
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),

        /**
         * foreign keys
         */
        mediaMimeTypeId: int()
            .notNull()
            .references(() => mimeTypes.id, { onDelete: "cascade" }),

        /**
         * general fields
         */
        name: text("name"),
        description: text("description"),
        storageKey: text("storage_key").notNull().unique(),
        sizeInBytes: int("size_in_bytes").notNull(),

        /**
         * image-kind specific fields
         */
        imageWidth: int("image_width"),
        imageHeight: int("image_height"),
        imageAltText: text("image_alt_text"),

        /**
         * playable-kind specific fields
         */
        duration: int("duration"),
    } as const,
    (table) => [
        /**
         * primary key
         */
        primaryKey({ columns: [table.id] }),

        /**
         * indexes
         */
        index("idx_medias_name").on(table.name),
    ]
);

export const mediaTags = sqliteTable(
    "media_tags",
    {
        ...COMMON_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),
        mediaId: int("media_id")
            .notNull()
            .references(() => medias.id, { onDelete: "cascade" }),
        tagId: int("tag_id")
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
    ]
);

export const tagRelations = relations(tags, ({ many }) => ({
    mediaTags: many(mediaTags),
}));

export const mimeTypeRelations = relations(mimeTypes, ({ many }) => ({
    medias: many(medias),
}));

export const mediaRelations = relations(medias, ({ one, many }) => ({
    mimeType: one(mimeTypes, {
        fields: [medias.mediaMimeTypeId],
        references: [mimeTypes.id],
    }),
    tags: many(mediaTags),
}));

export const mediaTagRelations = relations(mediaTags, ({ one }) => ({
    media: one(medias, {
        fields: [mediaTags.mediaId],
        references: [medias.id],
    }),
    tag: one(tags, {
        fields: [mediaTags.tagId],
        references: [tags.id],
    }),
}));
