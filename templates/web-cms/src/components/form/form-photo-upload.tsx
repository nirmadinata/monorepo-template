"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Image } from "@unpic/react";
import { CameraIcon } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";
import { cn } from "#/lib/utils.ts";

function defaultPlaceholder(placeholder?: ReactNode) {
    if (placeholder) {
        return placeholder;
    }
    return (
        <div className="flex flex-col items-center gap-1 p-4 text-center">
            <CameraIcon className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload photo</span>
        </div>
    );
}

export interface FormPhotoUploadProps {
    field: AnyFieldApi;
    label: ReactNode;
    initialSrc?: string | null;
    shape?: "circle" | "square" | "rectangle";
    placeholder?: ReactNode;
    isNeedConfirmation?: boolean | "on-replace";
    className?: string;
}

export function FormPhotoUpload({
    field,
    label,
    initialSrc,
    shape,
    placeholder,
    isNeedConfirmation = false,
    className,
}: FormPhotoUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const objectUrlRef = useRef<string | null>(null);

    const fieldErrors = extractFormErrorItems(field.state.meta.errors);
    const displaySrc = previewSrc ?? initialSrc ?? undefined;
    const hasImage = Boolean(displaySrc);

    const revokeObjectUrl = useCallback(() => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
    }, []);

    useEffect(() => revokeObjectUrl, [revokeObjectUrl]);

    const commitFile = useCallback(
        (file: File) => {
            field.handleChange(file);
        },
        [field]
    );

    const openFileDialog = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0];
            if (!selectedFile) {
                return;
            }
            if (!selectedFile.type.startsWith("image/")) {
                return;
            }

            revokeObjectUrl();

            const url = URL.createObjectURL(selectedFile);
            objectUrlRef.current = url;

            const needsConfirm =
                isNeedConfirmation === true ||
                (isNeedConfirmation === "on-replace" && Boolean(initialSrc));

            if (needsConfirm) {
                setPendingFile(selectedFile);
                setPreviewSrc(url);
                setConfirmOpen(true);
            } else {
                setPreviewSrc(url);
                commitFile(selectedFile);
            }
        },
        [isNeedConfirmation, initialSrc, revokeObjectUrl, commitFile]
    );

    const handleConfirm = useCallback(() => {
        setConfirmOpen(false);
        if (pendingFile) {
            commitFile(pendingFile);
            setPendingFile(null);
        }
    }, [pendingFile, commitFile]);

    const handleCancel = useCallback(() => {
        setConfirmOpen(false);
        revokeObjectUrl();
        setPreviewSrc(null);
        setPendingFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }, [revokeObjectUrl]);

    const trigger = (
        <button
            type="button"
            className={cn(
                "group relative flex cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted",
                shape === "circle" && "aspect-square rounded-full",
                shape === "square" && "aspect-square rounded-lg",
                shape === "rectangle" && "aspect-video rounded-lg",
                !shape && "aspect-square rounded-full",
                hasImage && "border-solid border-border bg-transparent"
            )}
            onClick={openFileDialog}
        >
            {displaySrc ? (
                <Fragment>
                    <Image
                        src={displaySrc}
                        alt="Preview"
                        layout="fullWidth"
                        className={cn(
                            "h-full w-full object-cover",
                            (shape === "circle" || !shape) && "rounded-full",
                            (shape === "square" || shape === "rectangle") && "rounded-lg"
                        )}
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-xs font-medium text-white">Change photo</span>
                    </div>
                </Fragment>
            ) : (
                defaultPlaceholder(placeholder)
            )}
        </button>
    );

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    id={String(field.name)}
                    aria-describedby={
                        fieldErrors.length > 0 ? getFormFieldErrorId(String(field.name)) : undefined
                    }
                    aria-invalid={fieldErrors.length > 0 || undefined}
                />
                {trigger}
                <Dialog open={confirmOpen} onOpenChange={(open) => !open && handleCancel()}>
                    <DialogContent showCloseButton={false}>
                        <DialogHeader>
                            <DialogTitle>Replace photo?</DialogTitle>
                            <DialogDescription>
                                This will replace the current photo. Are you sure you want to
                                continue?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirm}>Continue</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
