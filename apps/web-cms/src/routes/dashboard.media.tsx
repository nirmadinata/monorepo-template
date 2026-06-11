import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import * as v from "valibot";

import { MediaLibraryPage } from "#/features/dashboard-media-library/components/media-library-page";
import { mediaLibrarySearchSchema } from "#/features/dashboard-media-library/lib/form-schema";
import { getMediaLibraryPage } from "#/features/dashboard-media-library/server/media-library";

export const Route = createFileRoute("/dashboard/media")({
    validateSearch: mediaLibrarySearchSchema,
    loader: async ({ location }) =>
        getMediaLibraryPage({
            data: v.parse(mediaLibrarySearchSchema, location.search),
        }),
    component: DashboardMediaRoute,
});

const routeApi = getRouteApi("/dashboard/media");

function DashboardMediaRoute() {
    const data = routeApi.useLoaderData();

    return <MediaLibraryPage data={data} />;
}
