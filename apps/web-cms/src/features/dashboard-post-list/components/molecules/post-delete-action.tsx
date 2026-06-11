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

import { usePostDeleteAction } from "../../hooks/use-post-delete-action";

interface PostDeleteActionProps {
    postId: number;
    postTitle: string;
    onDeleted: () => Promise<void>;
}

export function PostDeleteAction({ postId, postTitle, onDeleted }: PostDeleteActionProps) {
    const { deletePost, isDeleting } = usePostDeleteAction({ postId, onDeleted });

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
                    <AlertDialogTitle>Delete post?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently removes <strong>{postTitle}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={async () => {
                            await deletePost();
                        }}
                        variant="destructive"
                    >
                        {isDeleting ? "Deleting..." : "Delete post"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
