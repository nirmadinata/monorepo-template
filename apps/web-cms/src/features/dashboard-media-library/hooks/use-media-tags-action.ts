import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { mediaTagEditFormSchema, parseTagDraft } from "../lib/form-schema";
import { updateMediaTags } from "../server/media-library";

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
            onSubmit: mediaTagEditFormSchema,
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
