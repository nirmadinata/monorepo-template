import * as v from "valibot";

const emailField = v.pipe(v.string(), v.trim(), v.email("Please enter a valid email address."));

const passwordField = v.pipe(
    v.string(),
    v.minLength(8, "Password must be at least 8 characters."),
    v.regex(/[A-Z]/u, "Password must include at least one uppercase letter."),
    v.regex(/[a-z]/u, "Password must include at least one lowercase letter."),
    v.regex(/[^A-Za-z0-9]/u, "Password must include at least one symbol.")
);

export const emailSignInSchema = v.object({
    email: emailField,
    password: passwordField,
});

export const emailSignUpSchema = v.pipe(
    v.object({
        email: emailField,
        password: passwordField,
        confirmPassword: v.string(),
    }),
    v.forward(
        v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input) => input.password === input.confirmPassword,
            "Passwords do not match."
        ),
        ["confirmPassword"]
    )
);
