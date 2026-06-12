import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { MediaLibraryPage } from "#/features/dashboard-media-library/components/media-library-page";
import { mediaLibrarySearchSchema } from "#/features/dashboard-media-library/lib/form-schema";
import { getMediaLibraryPage } from "#/features/dashboard-media-library/server/media-library";

const api = getRouteApi("/dashboard/media");

function DashboardMediaRoute() {
    const data = api.useLoaderData();

    return <MediaLibraryPage data={data} />;
}

export const Route = createFileRoute("/dashboard/media")({
    validateSearch: mediaLibrarySearchSchema,
    loader: async ({ location }) => getMediaLibraryPage({ data: location.search }),
    component: DashboardMediaRoute,
});
