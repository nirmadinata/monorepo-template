import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { MEDIA_TAG_EDIT_FORM_SCHEMA } from "#/features/dashboard-media-library/lib/form-schema";
import { parseTagDraft } from "#/features/dashboard-media-library/lib/utils";
import { updateMediaTags } from "#/features/dashboard-media-library/server/functions";

interface UseMediaTagsActionOptions {
    mediaId: number;
    onUpdated: () => Promise<void>;
    tagNames: string[];
}

export function useMediaTagsAction({ mediaId, onUpdated, tagNames }: UseMediaTagsActionOptions) {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm({
        defaultValues: {
            mediaId,
            tagDraft: tagNames.join(", "),
        },
        onSubmit: async ({ value }) => {
            await updateMediaTags({
                data: {
                    mediaId: value.mediaId,
                    tagNames: parseTagDraft(value.tagDraft),
                },
            });

            toast.success("Tags updated.");
            setIsOpen(false);
            await onUpdated();
        },
        validators: {
            onSubmit: MEDIA_TAG_EDIT_FORM_SCHEMA,
        },
    });

    const normalizedTagNames = parseTagDraft(form.state.values.tagDraft);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        form.reset({
            mediaId,
            tagDraft: tagNames.join(", "),
        });
    }, [form, isOpen, mediaId, tagNames]);

    return {
        form,
        isOpen,
        normalizedTagNames,
        setIsOpen,
    };
}
