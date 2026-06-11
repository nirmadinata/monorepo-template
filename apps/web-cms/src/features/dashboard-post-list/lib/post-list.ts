export const POST_LIST_PAGE_SIZE = 12;

export const POST_STATUS_ENUM = {
    DRAFT: "draft",
    PUBLISHED: "published",
    UNPUBLISHED: "unpublished",
} as const;

export const POST_STATUS_VALUES = [
    POST_STATUS_ENUM.DRAFT,
    POST_STATUS_ENUM.PUBLISHED,
    POST_STATUS_ENUM.UNPUBLISHED,
] as const;

export type PostStatus = (typeof POST_STATUS_VALUES)[number];

export const POST_LIST_FILTER_STATUS_VALUES = ["all", ...POST_STATUS_VALUES] as const;

export type PostListFilterStatus = (typeof POST_LIST_FILTER_STATUS_VALUES)[number];

export function formatPostStatus(status: PostStatus) {
    switch (status) {
        case POST_STATUS_ENUM.PUBLISHED: {
            return "Published";
        }
        case POST_STATUS_ENUM.DRAFT: {
            return "Draft";
        }
        case POST_STATUS_ENUM.UNPUBLISHED: {
            return "Unpublished";
        }
        default: {
            return status;
        }
    }
}
