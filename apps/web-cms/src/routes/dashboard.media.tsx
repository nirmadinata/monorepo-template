import { createFileRoute } from "@tanstack/react-router";

import { MediaLibraryPage } from "#/features/dashboard-media-library/components/media-library-page";
import { mediaLibrarySearchSchema } from "#/features/dashboard-media-library/lib/form-schema";
import { getMediaLibraryPage } from "#/features/dashboard-media-library/server/media-library";

export const Route = createFileRoute("/dashboard/media")({
    validateSearch: mediaLibrarySearchSchema,
    loader: async ({ location }) =>
        getMediaLibraryPage({
            data: mediaLibrarySearchSchema.parse(location.search),
        }),
    component: DashboardMediaRoute,
});

function DashboardMediaRoute() {
    const data = Route.useLoaderData();

    return <MediaLibraryPage data={data} />;
}
