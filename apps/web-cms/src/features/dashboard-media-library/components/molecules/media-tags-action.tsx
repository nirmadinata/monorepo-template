import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "#/components/ui/dialog";
import { FieldError } from "#/components/ui/field";
import { Textarea } from "#/components/ui/textarea";
import { extractFormErrorItems, getManagedFieldProps, submitForm } from "#/lib/forms";

import { mediaTagEditFormSchema, parseTagDraft } from "../../lib/form-schema";
import { updateMediaTags } from "../../server/media-library";

interface MediaTagsActionProps {
    mediaId: number;
    mediaName: string;
    onUpdated: () => Promise<void>;
    tagNames: string[];
}

export function MediaTagsAction({ mediaId, mediaName, onUpdated, tagNames }: MediaTagsActionProps) {
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

    return (
        <Dialog
            onOpenChange={(open) => {
                setIsOpen(open);
            }}
            open={isOpen}
        >
            <DialogTrigger render={<Button size="sm" variant="ghost" />}>Tags</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit tags</DialogTitle>
                    <DialogDescription>
                        Update the reusable tags for <strong>{mediaName}</strong>. Separate tags
                        with commas or new lines.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="space-y-6"
                    onSubmit={(event) => {
                        void submitForm(event, form, "Unable to update tags right now.");
                    }}
                >
                    <form.Field name="tagDraft">
                        {(field) => {
                            const fieldProps = getManagedFieldProps(field);

                            return (
                                <div className="flex flex-col gap-3">
                                    <label
                                        className="text-sm font-medium text-foreground"
                                        htmlFor={`media-tags-${mediaId}`}
                                    >
                                        Tags
                                    </label>
                                    <Textarea
                                        {...fieldProps}
                                        id={`media-tags-${mediaId}`}
                                        onChange={(event) => {
                                            field.handleChange(event.currentTarget.value);
                                        }}
                                        placeholder="homepage, marketing, hero"
                                        rows={4}
                                    />
                                    <FieldError
                                        errors={extractFormErrorItems(field.state.meta.errors)}
                                        id={fieldProps["aria-describedby"]}
                                    />

                                    <div className="flex flex-wrap gap-1.5">
                                        {normalizedTagNames.length > 0 ? (
                                            normalizedTagNames.map((tagName) => (
                                                <Badge key={tagName} variant="secondary">
                                                    {tagName}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                No tags will be saved.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        }}
                    </form.Field>

                    <form.Subscribe
                        selector={(state) => ({
                            errors: state.errors,
                            isSubmitting: state.isSubmitting,
                        })}
                    >
                        {({ errors, isSubmitting }) => (
                            <>
                                <FieldError errors={errors} />
                                <DialogFooter>
                                    <DialogClose
                                        render={
                                            <Button
                                                disabled={isSubmitting}
                                                type="button"
                                                variant="outline"
                                            />
                                        }
                                    >
                                        Cancel
                                    </DialogClose>
                                    <Button disabled={isSubmitting} type="submit">
                                        {isSubmitting ? "Saving..." : "Save tags"}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </form.Subscribe>
                </form>
            </DialogContent>
        </Dialog>
    );
}
