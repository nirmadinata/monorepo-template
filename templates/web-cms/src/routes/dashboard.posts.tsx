import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import * as v from "valibot";

import { PostListPage } from "#/features/dashboard-post-list/components/post-list-page";
import { postListSearchSchema } from "#/features/dashboard-post-list/lib/form-schema";
import { getPostListPage } from "#/features/dashboard-post-list/server/post-list";

const api = getRouteApi("/dashboard/posts");

function DashboardPostsRoute() {
    const data = api.useLoaderData();

    return <PostListPage data={data} />;
}

export const Route = createFileRoute("/dashboard/posts")({
    validateSearch: postListSearchSchema,
    loader: async ({ location }) =>
        getPostListPage({
            data: v.parse(postListSearchSchema, location.search),
        }),
    component: DashboardPostsRoute,
});
