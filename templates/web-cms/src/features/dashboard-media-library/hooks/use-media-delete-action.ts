import { useState } from "react";
import { toast } from "sonner";

import { toToastErrorMessage } from "#/features/dashboard-media-library/lib/toast-error";
import { deleteMediaAsset } from "#/features/dashboard-media-library/server/functions";

interface UseMediaDeleteActionOptions {
    mediaId: number;
    onDeleted: () => Promise<void>;
}

export function useMediaDeleteAction({ mediaId, onDeleted }: UseMediaDeleteActionOptions) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function deleteMedia() {
        setIsDeleting(true);

        try {
            await deleteMediaAsset({ data: { mediaId } });
            toast.success("Media deleted.");
            await onDeleted();
        } catch (error) {
            toast.error(toToastErrorMessage(error, "Unable to delete this media asset right now."));
        } finally {
            setIsDeleting(false);
        }
    }

    return {
        deleteMedia,
        isDeleting,
    };
}
