import { createServerOnlyFn } from "@tanstack/react-start";
import { S3mini } from "s3mini";

import { appenv } from "#/integrations/lib/env";

export const getR2Client = createServerOnlyFn(
    () =>
        new S3mini({
            region: "auto",
            endpoint: `https://${appenv.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${appenv.BUCKET_NAME}`,
            accessKeyId: appenv.R2_ACCESS_KEY_ID,
            secretAccessKey: appenv.R2_SECRET_ACCESS_KEY,
        })
);

export type R2Client = S3mini;
