import * as v from "valibot";

import { POST_LIST_FILTER_STATUS_VALUES, POST_LIST_PAGE_SIZE } from "./post-list";

export const postListSearchSchema = v.object({
    page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
    pageSize: v.optional(
        v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
        POST_LIST_PAGE_SIZE
    ),
    search: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(100)), ""),
    status: v.optional(v.picklist(POST_LIST_FILTER_STATUS_VALUES, "all")),
});

export const postListSearchFormSchema = v.object({
    page: v.pipe(v.number(), v.integer(), v.minValue(1)),
    pageSize: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
    search: v.pipe(v.string(), v.trim(), v.maxLength(100)),
    status: v.picklist(POST_LIST_FILTER_STATUS_VALUES),
});

export type PostListSearchValues = v.InferOutput<typeof postListSearchSchema>;
