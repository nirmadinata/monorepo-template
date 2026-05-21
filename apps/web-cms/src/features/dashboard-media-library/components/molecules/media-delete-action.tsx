import { TriangleAlertIcon } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";

import { useMediaDeleteAction } from "../../hooks/use-media-delete-action";

interface MediaDeleteActionProps {
    mediaId: number;
    mediaName: string;
    onDeleted: () => Promise<void>;
}

export function MediaDeleteAction({ mediaId, mediaName, onDeleted }: MediaDeleteActionProps) {
    const { deleteMedia, isDeleting } = useMediaDeleteAction({ mediaId, onDeleted });

    return (
        <AlertDialog>
            <AlertDialogTrigger render={<Button size="sm" variant="outline" />}>
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <TriangleAlertIcon className="text-destructive" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete media?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently removes <strong>{mediaName}</strong> from R2 and deletes
                        its metadata and tag links.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={async () => {
                            await deleteMedia();
                        }}
                        variant="destructive"
                    >
                        {isDeleting ? "Deleting..." : "Delete media"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
