import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import * as v from "valibot";

import type { PostListPageData } from "../components/types";
import { postListSearchFormSchema, postListSearchSchema } from "../lib/form-schema";

export function usePostListPage(data: PostListPageData) {
    const navigate = useNavigate({ from: "/dashboard/posts" });

    const filterForm = useForm({
        defaultValues: v.parse(postListSearchSchema, data.filters),
        async onSubmit({ value }) {
            await navigate({
                to: "/dashboard/posts",
                search: (previous) => ({
                    ...previous,
                    page: 1,
                    pageSize: value.pageSize,
                    search: value.search,
                    status: value.status,
                }),
                reloadDocument: true,
            });
        },
        validators: {
            onSubmit: postListSearchFormSchema,
        },
    });

    useEffect(() => {
        filterForm.reset(v.parse(postListSearchSchema, data.filters));
    }, [data.filters, filterForm]);

    async function reloadPage() {
        await navigate({
            to: "/dashboard/posts",
            search: (previous) => previous,
            replace: true,
        });
    }

    return {
        filterForm,
        reloadPage,
    };
}
