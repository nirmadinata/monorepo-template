import { S3Client } from "@aws-sdk/client-s3";
import { createServerOnlyFn } from "@tanstack/react-start";

import { appenv } from "#/integrations/appenv";

/**
 * Create and return an S3 client configured for Cloudflare R2
 */

export const getR2Client = createServerOnlyFn(
    () =>
        new S3Client({
            region: "auto",
            endpoint: `https://${appenv.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${appenv.BUCKET_NAME}`,
            credentials: {
                accessKeyId: appenv.R2_ACCESS_KEY_ID,
                secretAccessKey: appenv.R2_SECRET_ACCESS_KEY,
            },
        })
);
