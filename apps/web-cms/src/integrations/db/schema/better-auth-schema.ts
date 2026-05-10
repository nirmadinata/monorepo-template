import { relations, sql } from "drizzle-orm";
import { index, int, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { COLUMN_ALIASES, TABLE_ALIASES } from "#/integrations/db/constants";

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

/**
 * better auth tables
 */
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

/**
 * relations
 */
export const userRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
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
