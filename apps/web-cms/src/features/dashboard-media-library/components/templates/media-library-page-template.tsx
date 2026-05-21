import { Badge } from "#/components/ui/badge";

interface MediaLibraryPageTemplateProps {
    content: React.ReactNode;
    fileInput: React.ReactNode;
    filters: React.ReactNode;
    headerUploadAction: React.ReactNode;
    previewFailureAlert: React.ReactNode;
    totalItems: number;
    uploadErrors: React.ReactNode;
    uploadProgress: React.ReactNode;
}

export function MediaLibraryPageTemplate({
    content,
    fileInput,
    filters,
    headerUploadAction,
    previewFailureAlert,
    totalItems,
    uploadErrors,
    uploadProgress,
}: MediaLibraryPageTemplateProps) {
    return (
        <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {fileInput}

            <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Manage Media.
                    </h1>
                    <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
                        Browse uploaded media, preview visible assets with signed URLs, and
                        permanently remove files that are no longer needed.
                    </p>
                </div>

                <div className="flex items-center justify-start gap-3 lg:justify-end">
                    <Badge variant="outline">{totalItems} assets</Badge>
                    {headerUploadAction}
                </div>
            </section>

            {uploadProgress}
            {uploadErrors}
            {previewFailureAlert}
            {filters}
            {content}
        </div>
    );
}
