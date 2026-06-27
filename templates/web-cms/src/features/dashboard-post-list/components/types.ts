import type { getPostListPage } from "../server/post-list";

export type PostListPageData = Awaited<ReturnType<typeof getPostListPage>>;

export type PostListItem = PostListPageData["items"][number];
