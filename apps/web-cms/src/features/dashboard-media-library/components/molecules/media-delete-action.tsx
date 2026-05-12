import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

import { deleteMediaAsset } from "../../server/media-library";

interface MediaDeleteActionProps {
    mediaId: number;
    mediaName: string;
    onDeleted: () => Promise<void>;
}

export function MediaDeleteAction({ mediaId, mediaName, onDeleted }: MediaDeleteActionProps) {
    const [isDeleting, setIsDeleting] = useState(false);

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
                            setIsDeleting(true);

                            try {
                                await deleteMediaAsset({ data: { mediaId } });
                                toast.success("Media deleted.");
                                await onDeleted();
                            } catch (error) {
                                toast.error(
                                    error instanceof Error
                                        ? error.message
                                        : "Unable to delete this media asset right now."
                                );
                            } finally {
                                setIsDeleting(false);
                            }
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
