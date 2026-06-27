import { Card, CardContent } from "#/components/ui/card";

interface MediaLibraryFiltersProps {
    actions: React.ReactNode;
    kindField: React.ReactNode;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    searchField: React.ReactNode;
    tagField: React.ReactNode;
}

export function MediaLibraryFilters({
    actions,
    kindField,
    onSubmit,
    searchField,
    tagField,
}: MediaLibraryFiltersProps) {
    return (
        <Card className="border-border/75 bg-card/80 shadow-none">
            <CardContent className="py-4">
                <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={onSubmit}>
                    {searchField}
                    {kindField}
                    {tagField}
                    {actions}
                </form>
            </CardContent>
        </Card>
    );
}
