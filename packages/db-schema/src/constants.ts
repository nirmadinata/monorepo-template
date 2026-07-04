export const TABLE_ALIASES = {
    ACCOUNTS: "accounts",
    SESSIONS: "sessions",
    USERS: "users",
    VERIFICATIONS: "verifications",
} as const;

export const COLUMN_ALIASES = {
    ACCOUNTS: {
        ACCESS_TOKEN: "access_token",
        ACCESS_TOKEN_EXPIRES_AT: "access_token_expires_at",
        ACCOUNT_ID: "account_id",
        ID_TOKEN: "id_token",
        PASSWORD: "password",
        PROVIDER_ID: "provider_id",
        REFRESH_TOKEN: "refresh_token",
        REFRESH_TOKEN_EXPIRES_AT: "refresh_token_expires_at",
        SCOPE: "scope",
        USER_ID: "user_id",
    },
    COMMON_COLUMNS: {
        CREATED_AT: "created_at",
        ID: "id",
        UPDATED_AT: "updated_at",
    },
    SESSIONS: {
        EXPIRES_AT: "expires_at",
        IMPERSONATED_BY: "impersonated_by",
        IP_ADDRESS: "ip_address",
        TOKEN: "token",
        USER_AGENT: "user_agent",
        USER_ID: "user_id",
    },
    USERS: {
        BANNED: "banned",
        BAN_EXPIRES: "ban_expires",
        BAN_REASON: "ban_reason",
        EMAIL: "email",
        EMAIL_VERIFIED: "email_verified",
        IMAGE: "image",
        NAME: "name",
        ROLE: "role",
    },
    VERIFICATIONS: {
        EXPIRES_AT: "expires_at",
        IDENTIFIER: "identifier",
        VALUE: "value",
    },
} as const;
