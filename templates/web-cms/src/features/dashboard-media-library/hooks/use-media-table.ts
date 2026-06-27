import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

import type { MediaLibraryPageData } from "#/features/dashboard-media-library/components/types";
import { createMediaTableColumns } from "#/features/dashboard-media-library/lib/media-table-columns";

interface UseMediaTableParams {
    items: MediaLibraryPageData["items"];
    onDeleted: () => Promise<void>;
}

// oxlint-disable-next-line react/react-compiler
export function useMediaTable({ items, onDeleted }: UseMediaTableParams) {
    const columns = useMemo(() => createMediaTableColumns({ onDeleted }), [onDeleted]);

    return useReactTable({
        columns,
        data: items,
        getCoreRowModel: getCoreRowModel(),
    });
}
