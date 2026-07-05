import { relations, sql } from "drizzle-orm";
import {
    index,
    int,
    integer,
    primaryKey,
    real,
    sqliteTable,
    text,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { COLUMN_ALIASES, LIST_FILE_FORMAT, LIST_MEDIA_TYPE, TABLE_ALIASES } from "./constants";

const DEFAULT_CURRENT_MILLISECONDS = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;

const BETTER_AUTH_COMMON_FIELDS = {
    id: text(COLUMN_ALIASES.COMMON_COLUMNS.ID).primaryKey(),

    createdAt: int(COLUMN_ALIASES.COMMON_COLUMNS.CREATED_AT, {
        mode: "timestamp_ms",
    })
        .notNull()
        .default(DEFAULT_CURRENT_MILLISECONDS),

    updatedAt: int(COLUMN_ALIASES.COMMON_COLUMNS.UPDATED_AT, {
        mode: "timestamp_ms",
    })
        .default(DEFAULT_CURRENT_MILLISECONDS)
        .$onUpdate(() => DEFAULT_CURRENT_MILLISECONDS),
} as const;

export const users = sqliteTable(
    TABLE_ALIASES.USERS,
    {
        ...BETTER_AUTH_COMMON_FIELDS,

        name: text(COLUMN_ALIASES.USERS.NAME).notNull(),
        email: text(COLUMN_ALIASES.USERS.EMAIL).notNull(),
        emailVerified: integer(COLUMN_ALIASES.USERS.EMAIL_VERIFIED, {
            mode: "boolean",
        })
            .default(false)
            .notNull(),
        image: text(COLUMN_ALIASES.USERS.IMAGE),
        role: text(COLUMN_ALIASES.USERS.ROLE),
        banned: integer(COLUMN_ALIASES.USERS.BANNED, {
            mode: "boolean",
        }),
        banReason: text(COLUMN_ALIASES.USERS.BAN_REASON),
        banExpires: integer(COLUMN_ALIASES.USERS.BAN_EXPIRES, {
            mode: "timestamp_ms",
        }),
    },
    (table) => [uniqueIndex("user_email_unique").on(table.email)]
);

export const sessions = sqliteTable(
    TABLE_ALIASES.SESSIONS,
    {
        ...BETTER_AUTH_COMMON_FIELDS,
        userId: text(COLUMN_ALIASES.SESSIONS.USER_ID)
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),
        token: text(COLUMN_ALIASES.SESSIONS.TOKEN).notNull(),
        expiresAt: integer(COLUMN_ALIASES.SESSIONS.EXPIRES_AT, {
            mode: "timestamp_ms",
        }).notNull(),
        ipAddress: text(COLUMN_ALIASES.SESSIONS.IP_ADDRESS),
        userAgent: text(COLUMN_ALIASES.SESSIONS.USER_AGENT),
        impersonatedBy: text(COLUMN_ALIASES.SESSIONS.IMPERSONATED_BY),
    },
    (table) => [
        uniqueIndex("session_token_unique").on(table.token),
        index("session_user_id_idx").on(table.userId),
    ]
);

export const accounts = sqliteTable(
    TABLE_ALIASES.ACCOUNTS,
    {
        ...BETTER_AUTH_COMMON_FIELDS,
        accessToken: text(COLUMN_ALIASES.ACCOUNTS.ACCESS_TOKEN),
        accessTokenExpiresAt: integer(COLUMN_ALIASES.ACCOUNTS.ACCESS_TOKEN_EXPIRES_AT, {
            mode: "timestamp_ms",
        }),
        accountId: text(COLUMN_ALIASES.ACCOUNTS.ACCOUNT_ID).notNull(),
        idToken: text(COLUMN_ALIASES.ACCOUNTS.ID_TOKEN),
        password: text(COLUMN_ALIASES.ACCOUNTS.PASSWORD),
        providerId: text(COLUMN_ALIASES.ACCOUNTS.PROVIDER_ID).notNull(),
        refreshToken: text(COLUMN_ALIASES.ACCOUNTS.REFRESH_TOKEN),
        refreshTokenExpiresAt: int(COLUMN_ALIASES.ACCOUNTS.REFRESH_TOKEN_EXPIRES_AT, {
            mode: "timestamp_ms",
        }),
        scope: text(COLUMN_ALIASES.ACCOUNTS.SCOPE),
        userId: text(COLUMN_ALIASES.ACCOUNTS.USER_ID)
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),
    },
    (table) => [
        uniqueIndex("account_provider_account_unique").on(table.providerId, table.accountId),
        index("account_user_id_idx").on(table.userId),
    ]
);

export const verification = sqliteTable(
    TABLE_ALIASES.VERIFICATIONS,
    {
        ...BETTER_AUTH_COMMON_FIELDS,
        expiresAt: int(COLUMN_ALIASES.VERIFICATIONS.EXPIRES_AT, {
            mode: "timestamp_ms",
        }).notNull(),
        identifier: text(COLUMN_ALIASES.VERIFICATIONS.IDENTIFIER).notNull(),
        value: text(COLUMN_ALIASES.VERIFICATIONS.VALUE).notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const media = sqliteTable(
    TABLE_ALIASES.MEDIA,
    {
        ...BETTER_AUTH_COMMON_FIELDS,

        name: text(COLUMN_ALIASES.MEDIA.NAME).notNull(),
        key: text(COLUMN_ALIASES.MEDIA.KEY).notNull(),
        type: text(COLUMN_ALIASES.MEDIA.TYPE, { enum: LIST_MEDIA_TYPE }).notNull(),
        fileFormat: text(COLUMN_ALIASES.MEDIA.FILE_FORMAT, { enum: LIST_FILE_FORMAT }).notNull(),
        fileSize: integer(COLUMN_ALIASES.MEDIA.FILE_SIZE).notNull(),
        width: integer(COLUMN_ALIASES.MEDIA.WIDTH),
        height: integer(COLUMN_ALIASES.MEDIA.HEIGHT),
        duration: real(COLUMN_ALIASES.MEDIA.DURATION),
        thumbnailKey: text(COLUMN_ALIASES.MEDIA.THUMBNAIL_KEY),
        ownerId: text(COLUMN_ALIASES.MEDIA.OWNER_ID)
            .notNull()
            .references(() => users.id),
        deletedAt: integer(COLUMN_ALIASES.MEDIA.DELETED_AT, {
            mode: "timestamp_ms",
        }),
    },
    (table) => [
        index("media_owner_id_idx").on(table.ownerId),
        index("media_type_idx").on(table.type),
        uniqueIndex("media_key_unique").on(table.key),
    ]
);

export const tags = sqliteTable(
    TABLE_ALIASES.TAGS,
    {
        ...BETTER_AUTH_COMMON_FIELDS,

        name: text(COLUMN_ALIASES.TAGS.NAME).notNull(),
        slug: text(COLUMN_ALIASES.TAGS.SLUG).notNull(),
    },
    (table) => [uniqueIndex("tag_slug_unique").on(table.slug)]
);

export const mediaTags = sqliteTable(
    TABLE_ALIASES.MEDIA_TAGS,
    {
        mediaId: text(COLUMN_ALIASES.MEDIA_TAGS.MEDIA_ID)
            .notNull()
            .references(() => media.id, { onDelete: "cascade" }),
        tagId: text(COLUMN_ALIASES.MEDIA_TAGS.TAG_ID)
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (table) => [primaryKey({ columns: [table.mediaId, table.tagId] })]
);

export const userRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    media: many(media),
    sessions: many(sessions),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const verificationRelations = relations(verification, ({ one }) => ({
    user: one(users, {
        fields: [verification.identifier],
        references: [users.email],
    }),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
    owner: one(users, {
        fields: [media.ownerId],
        references: [users.id],
    }),
    mediaTags: many(mediaTags),
}));

export const tagRelations = relations(tags, ({ many }) => ({
    mediaTags: many(mediaTags),
}));

export const mediaTagRelations = relations(mediaTags, ({ one }) => ({
    media: one(media, {
        fields: [mediaTags.mediaId],
        references: [media.id],
    }),
    tag: one(tags, {
        fields: [mediaTags.tagId],
        references: [tags.id],
    }),
}));
