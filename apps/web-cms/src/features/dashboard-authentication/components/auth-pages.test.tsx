// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoginPage } from "./login-page";
import { PublicAuthLayout } from "./public-auth-layout";
import { WelcomePage } from "./welcome-page";

vi.mock(import("@tanstack/react-router"), () => ({
    Link: ({
        children,
        to,
        ...props
    }: React.ComponentProps<"a"> & { to: string }) => (
        <a href={to} {...props}>
            {children}
        </a>
    ),
    Outlet: () => <div>Outlet</div>,
}));

vi.mock(import("#/components/theme-toggle"), () => ({
    ThemeToggle: () => (
        <button aria-label="Switch to dark theme" type="button" />
    ),
}));

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
        expect(
            screen.getAllByText(/becomes the workspace superadmin/i).length
        ).toBeGreaterThan(0);
    });

    it("renders the registered-user login page copy and sign-in action", () => {
        render(<LoginPage />);

        expect(
            screen.getByRole("heading", {
                name: "Welcome back",
            })
        ).toBeTruthy();
        expect(
            screen.getByRole("button", { name: "Sign in with Google" })
        ).toBeTruthy();
        expect(screen.getByText(/new identities stay blocked/i)).toBeTruthy();
    });

    it("renders the shared public auth shell", () => {
        render(<PublicAuthLayout />);

        expect(
            screen.getByRole("link", { name: /mock cms.*admin workspace/i })
        ).toBeTruthy();
        expect(screen.getByLabelText(/switch to .* theme/i)).toBeTruthy();
    });
});
