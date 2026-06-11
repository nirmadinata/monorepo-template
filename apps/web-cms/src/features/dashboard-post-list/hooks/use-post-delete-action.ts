import { useState } from "react";
import { toast } from "sonner";

import { deletePost } from "../server/post-list";

interface UsePostDeleteActionOptions {
    postId: number;
    onDeleted: () => Promise<void>;
}

export function usePostDeleteAction({ postId, onDeleted }: UsePostDeleteActionOptions) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function deletePostAction() {
        setIsDeleting(true);

        try {
            const result = await deletePost({ data: { postId } });

            if (result.notFound) {
                toast.error("This post no longer exists.");
                await onDeleted();
                return;
            }

            toast.success("Post deleted.");
            await onDeleted();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Unable to delete this post right now."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return {
        deletePost: deletePostAction,
        isDeleting,
    };
}
