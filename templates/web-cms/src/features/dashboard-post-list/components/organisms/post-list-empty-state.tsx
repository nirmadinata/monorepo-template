import { PenSquareIcon } from "lucide-react";

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "#/components/ui/empty";

export function PostListEmptyState() {
    return (
        <Empty className="border border-dashed border-border/80 bg-card/40 px-8 py-14">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PenSquareIcon />
                </EmptyMedia>
                <EmptyTitle>No posts yet</EmptyTitle>
                <EmptyDescription>
                    Create your first post to start building content.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
