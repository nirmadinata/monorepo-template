import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import * as v from "valibot";

import type { MediaLibraryPageData } from "#/features/dashboard-media-library/components/types";
import { MEDIA_LIBRARY_SEARCH_SCHEMA } from "#/features/dashboard-media-library/lib/form-schema";

export function useMediaLibraryFilter(data: MediaLibraryPageData) {
    const navigate = useNavigate({ from: "/dashboard/media" });

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

    const tagOptions = useMemo(
        () => [
            { label: "All tags", value: "" },
            ...data.availableTags.map((tag) => ({
                label: tag.name,
                value: tag.slug,
            })),
        ],
        [data.availableTags]
    );

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
