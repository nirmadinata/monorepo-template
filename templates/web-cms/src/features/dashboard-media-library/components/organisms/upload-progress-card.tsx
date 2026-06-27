import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "#/components/ui/progress";

import type { UploadProgressItem } from "../types";

export function UploadProgressCard({ uploads }: { uploads: readonly UploadProgressItem[] }) {
    if (uploads.length === 0) {
        return null;
    }

    return (
        <Card className="border-border/75 bg-card/80 shadow-none">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Uploading files</CardTitle>
                <CardDescription>
                    Direct uploads go to R2 first, then finalize metadata in D1.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {uploads.map((upload) => (
                    <Progress key={upload.id} value={upload.progress}>
                        <ProgressLabel>{upload.fileName}</ProgressLabel>
                        <ProgressValue />
                    </Progress>
                ))}
            </CardContent>
        </Card>
    );
}
