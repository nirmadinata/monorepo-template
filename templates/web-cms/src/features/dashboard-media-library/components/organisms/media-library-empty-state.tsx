import { ImageIcon } from "lucide-react";

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "#/components/ui/empty";

export function MediaLibraryEmptyState({ uploadAction }: { uploadAction: React.ReactNode }) {
    return (
        <Empty className="border border-dashed border-border/80 bg-card/40 px-8 py-14">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ImageIcon />
                </EmptyMedia>
                <EmptyTitle>No media uploaded yet</EmptyTitle>
                <EmptyDescription>
                    Upload your first image or video to start building the library.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>{uploadAction}</EmptyContent>
        </Empty>
    );
}
