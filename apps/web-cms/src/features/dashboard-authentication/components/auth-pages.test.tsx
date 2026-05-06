// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoginPage } from "./login-page";
import { WelcomePage } from "./welcome-page";

describe("dashboard authentication pages", () => {
    it("renders the first-user welcome page copy and sign-up action", () => {
        render(<WelcomePage />);

        expect(
            screen.getByRole("heading", {
                name: "Create the first workspace administrator",
            })
        ).toBeTruthy();
        expect(
            screen.getByRole("button", { name: "Sign up with Google" })
        ).toBeTruthy();
        expect(screen.getAllByText(/superadmin/i).length).toBeGreaterThan(0);
    });

    it("renders the registered-user login page copy and sign-in action", () => {
        render(<LoginPage />);

        expect(
            screen.getByRole("heading", {
                name: "Welcome back to the editorial workspace",
            })
        ).toBeTruthy();
        expect(
            screen.getByRole("button", { name: "Sign in with Google" })
        ).toBeTruthy();
        expect(screen.getByText(/known account required/i)).toBeTruthy();
    });
});
