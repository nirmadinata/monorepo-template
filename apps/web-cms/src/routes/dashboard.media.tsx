import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { MediaLibraryPage } from "#/features/dashboard-media-library/components/media-library-page";
import { MEDIA_LIBRARY_PAGE_SIZE } from "#/features/dashboard-media-library/lib/media-library";
import { getMediaLibraryPage } from "#/features/dashboard-media-library/server/media-library";

const mediaLibrarySearchSchema = z.object({
    kind: z.enum(["all", "image", "video"]).optional().default("all"),
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).optional().default(MEDIA_LIBRARY_PAGE_SIZE),
    search: z.string().optional().default(""),
    tag: z.string().optional().default(""),
});

export const Route = createFileRoute("/dashboard/media")({
    loader: async ({ location }) => getMediaLibraryPage({ data: location.search }),
    component: DashboardMediaRoute,
    validateSearch: mediaLibrarySearchSchema,
});

function DashboardMediaRoute() {
    const data = Route.useLoaderData();

    return <MediaLibraryPage data={data} />;
}
