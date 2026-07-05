export const MEDIA_TYPE = {
    PHOTO: "photo",
    VIDEO: "video",
    AUDIO: "audio",
    DOCUMENT: "document",
} as const;

export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];

export const LIST_MEDIA_TYPE = [
    MEDIA_TYPE.PHOTO,
    MEDIA_TYPE.VIDEO,
    MEDIA_TYPE.AUDIO,
    MEDIA_TYPE.DOCUMENT,
] as const;

export const FILE_FORMAT = {
    JPG: "jpg",
    JPEG: "jpeg",
    PNG: "png",
    GIF: "gif",
    WEBP: "webp",
    SVG: "svg",
    MP4: "mp4",
    WEBM: "webm",
    MP3: "mp3",
    WAV: "wav",
    PDF: "pdf",
} as const;

export type FileFormat = (typeof FILE_FORMAT)[keyof typeof FILE_FORMAT];

export const LIST_FILE_FORMAT = [
    FILE_FORMAT.JPG,
    FILE_FORMAT.JPEG,
    FILE_FORMAT.PNG,
    FILE_FORMAT.GIF,
    FILE_FORMAT.WEBP,
    FILE_FORMAT.SVG,
    FILE_FORMAT.MP4,
    FILE_FORMAT.WEBM,
    FILE_FORMAT.MP3,
    FILE_FORMAT.WAV,
    FILE_FORMAT.PDF,
] as const;

export const TABLE_ALIASES = {
    ACCOUNTS: "accounts",
    MEDIA: "media",
    MEDIA_TAGS: "media_tags",
    SESSIONS: "sessions",
    TAGS: "tags",
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
    MEDIA: {
        DELETED_AT: "deleted_at",
        DURATION: "duration",
        FILE_FORMAT: "file_format",
        FILE_SIZE: "file_size",
        HEIGHT: "height",
        KEY: "key",
        NAME: "name",
        OWNER_ID: "owner_id",
        THUMBNAIL_KEY: "thumbnail_key",
        TYPE: "type",
        WIDTH: "width",
    },
    TAGS: {
        NAME: "name",
        SLUG: "slug",
    },
    MEDIA_TAGS: {
        MEDIA_ID: "media_id",
        TAG_ID: "tag_id",
    },
    VERIFICATIONS: {
        EXPIRES_AT: "expires_at",
        IDENTIFIER: "identifier",
        VALUE: "value",
    },
} as const;
