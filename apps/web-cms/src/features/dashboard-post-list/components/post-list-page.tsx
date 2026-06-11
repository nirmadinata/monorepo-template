import { Button } from "#/components/ui/button";
import { FieldError } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { NativeSelect, NativeSelectOption } from "#/components/ui/native-select";
import { getManagedFieldProps, submitForm } from "#/lib/forms";

import { usePostListPage } from "../hooks/use-post-list-page";
import { POST_LIST_FILTER_STATUS_VALUES, formatPostStatus } from "../lib/post-list";
import type { getPostListPage } from "../server/post-list";
import { PostListEmptyState } from "./organisms/post-list-empty-state";
import { PostListFilters } from "./organisms/post-list-filters";
import { PostPagination } from "./organisms/post-pagination";
import { PostTable } from "./organisms/post-table";
import { PostListPageTemplate } from "./templates/post-list-page-template";

interface PostListPageProps {
    data: Awaited<ReturnType<typeof getPostListPage>>;
}

export function PostListPage({ data }: PostListPageProps) {
    const { filterForm, reloadPage } = usePostListPage(data);

    return (
        <PostListPageTemplate
            content={
                data.items.length === 0 ? (
                    <PostListEmptyState />
                ) : (
                    <>
                        <PostTable items={data.items} onDeleted={reloadPage} />
                        <PostPagination
                            currentPage={data.pagination.page}
                            filters={data.filters}
                            totalPages={data.pagination.totalPages}
                        />
                    </>
                )
            }
            filters={
                <PostListFilters
                    actions={
                        <filterForm.Subscribe
                            selector={(state) => ({
                                errors: state.errors,
                                isSubmitting: state.isSubmitting,
                            })}
                        >
                            {({ errors, isSubmitting }) => (
                                <div className="flex flex-col gap-2 sm:items-end">
                                    <Button disabled={isSubmitting} type="submit" variant="outline">
                                        Apply filters
                                    </Button>
                                    <FieldError errors={errors} />
                                </div>
                            )}
                        </filterForm.Subscribe>
                    }
                    onSubmit={(event) => {
                        void submitForm(event, filterForm, "Unable to apply post filters.");
                    }}
                    searchField={
                        <filterForm.Field name="search">
                            {(field) => {
                                const fieldProps = getManagedFieldProps(field);

                                return (
                                    <div className="flex flex-1 flex-col gap-2">
                                        <label
                                            className="text-sm font-medium text-foreground"
                                            htmlFor="post-search"
                                        >
                                            Search by name
                                        </label>
                                        <Input
                                            {...fieldProps}
                                            id="post-search"
                                            onChange={(event) => {
                                                field.handleChange(event.currentTarget.value);
                                            }}
                                            placeholder="Search by post title"
                                        />
                                    </div>
                                );
                            }}
                        </filterForm.Field>
                    }
                    statusField={
                        <filterForm.Field name="status">
                            {(field) => (
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-foreground">
                                        Status
                                    </span>
                                    <NativeSelect
                                        {...getManagedFieldProps(field)}
                                        onChange={(event) => {
                                            field.handleChange(
                                                event.currentTarget
                                                    .value as typeof data.filters.status
                                            );
                                        }}
                                    >
                                        <NativeSelectOption value="all">
                                            All statuses
                                        </NativeSelectOption>
                                        {POST_LIST_FILTER_STATUS_VALUES.filter(
                                            (status) => status !== "all"
                                        ).map((status) => (
                                            <NativeSelectOption key={status} value={status}>
                                                {formatPostStatus(status)}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>
                                </div>
                            )}
                        </filterForm.Field>
                    }
                />
            }
            totalItems={data.pagination.totalItems}
        />
    );
}
