import { Card, CardContent } from "#/components/ui/card";

interface PostListFiltersProps {
    actions: React.ReactNode;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    searchField: React.ReactNode;
    statusField: React.ReactNode;
}

export function PostListFilters({
    actions,
    onSubmit,
    searchField,
    statusField,
}: PostListFiltersProps) {
    return (
        <Card className="border-border/75 bg-card/80 shadow-none">
            <CardContent className="py-4">
                <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={onSubmit}>
                    {searchField}
                    {statusField}
                    {actions}
                </form>
            </CardContent>
        </Card>
    );
}
