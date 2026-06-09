import * as v from "valibot";

export const googleAuthSubmissionSchema = v.object({
    intent: v.picklist(["sign-in", "sign-up"]),
});

export type GoogleAuthSubmission = v.InferOutput<typeof googleAuthSubmissionSchema>;
