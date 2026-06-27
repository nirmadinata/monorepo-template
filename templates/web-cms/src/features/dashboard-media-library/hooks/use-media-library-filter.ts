import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import * as v from "valibot";

import type { MediaLibraryPageData } from "#/features/dashboard-media-library/components/types";
import { MEDIA_LIBRARY_SEARCH_SCHEMA } from "#/features/dashboard-media-library/lib/form-schema";

import { useMediaTagOptions } from "./use-media-tag-options";

export function useMediaLibraryFilter(data: MediaLibraryPageData) {
    const navigate = useNavigate({ from: "/dashboard/media" });
    const tagOptions = useMediaTagOptions(data);

    const filterForm = useForm({
        defaultValues: data.filters as v.InferInput<typeof MEDIA_LIBRARY_SEARCH_SCHEMA>,
        async onSubmit({ value }) {
            await navigate({
                to: "/dashboard/media",
                search: (previous) => ({
                    ...previous,
                    ...value,
                    page: 1,
                }),
                reloadDocument: true,
            });
        },
        validators: {
            onSubmit: MEDIA_LIBRARY_SEARCH_SCHEMA,
        },
    });

    useEffect(() => {
        filterForm.reset(v.parse(MEDIA_LIBRARY_SEARCH_SCHEMA, data.filters));
    }, [data.filters, filterForm]);

    async function reloadPage() {
        await navigate({
            to: "/dashboard/media",
            search: (previous) => previous,
            replace: true,
        });
    }

    return {
        filterForm,
        reloadPage,
        tagOptions,
    };
}
