"use client";

import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Fragment } from "react";
import type { ReactNode } from "react";
import { match } from "ts-pattern";

import { Spinner } from "#/components/ui/spinner";
import type { UploadedFileEntry } from "#/integrations/uppy/util";
import { cn } from "#/lib/utils.ts";

import { usePhotoUpload } from "./use-photo-upload";

const variants = cva(
    cn(
        "group relative flex cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted"
    ),
    {
        variants: {
            shape: {
                circle: "aspect-square rounded-full",
                square: "aspect-square rounded-lg",
                rectangle: "aspect-video rounded-lg",
            },
        },
        defaultVariants: {
            shape: "circle",
        },
    }
);

export interface PhotoUploadProps extends VariantProps<typeof variants> {
    initialSrc?: string | null;
    defaultSrc?: string | null;
    onUpload?: (entry: UploadedFileEntry) => void;
    maxFileSize?: number;
    className?: string;
    placeholder?: ReactNode;
}

export function PhotoUpload({
    initialSrc,
    defaultSrc,
    onUpload,
    maxFileSize,
    className,
    shape,
    placeholder,
}: PhotoUploadProps) {
    const { uploaded, isUploading, containerRef } = usePhotoUpload({
        onUpload,
        maxFileSize,
    });

    const previewSrc = uploaded?.url ?? initialSrc ?? defaultSrc ?? undefined;
    const hasImage = Boolean(previewSrc);

    return (
        <div
            ref={containerRef}
            className={cn(
                variants({ shape }),
                hasImage && "border-solid border-border bg-transparent",
                className
            )}
        >
            {match({ isUploading, hasImage })
                .with({ isUploading: true }, () => <Spinner className="size-6" />)

                .with({ hasImage: true }, () => (
                    <Fragment>
                        <img
                            src={previewSrc}
                            alt="Preview"
                            className={cn(
                                "h-full w-full object-cover",
                                shape === "circle" && "rounded-full",
                                (shape === "square" || shape === "rectangle") && "rounded-lg"
                            )}
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-xs font-medium text-white">Change photo</span>
                        </div>
                    </Fragment>
                ))

                .otherwise(() => (
                    <div className="flex flex-col items-center gap-1 p-4 text-center">
                        {placeholder ?? (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-6 text-muted-foreground"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm1.5 5.25a8.25 8.25 0 01-12 0"
                                    />
                                </svg>
                                <span className="text-xs text-muted-foreground">Upload photo</span>
                            </>
                        )}
                    </div>
                ))}
        </div>
    );
}
