// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppThemeProvider } from "#/components/theme-provider";

import type { DashboardSession } from "../server/get-dashboard-session";
import { DashboardShell } from "./dashboard-shell";

const { assignSpy, signOutSpy, toastErrorSpy } = vi.hoisted(() => ({
    assignSpy: vi.fn<(url: string | URL) => void>(),
    signOutSpy: vi.fn<() => Promise<{ error?: { message?: string } }>>(),
    toastErrorSpy: vi.fn<(message: string) => void>(),
}));

const dashboardUser: DashboardSession["user"] = {
    email: "alex.editor@example.com",
    emailVerified: true,
    id: "user-1",
    image: null,
    name: "Alex Editor",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

interface MockMediaQueryList {
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject | null) => void;
    addListener: (listener: ((event: MediaQueryListEvent) => void) | null) => void;
    dispatchEvent: (event: Event) => boolean;
    matches: boolean;
    media: string;
    onchange: ((event: MediaQueryListEvent) => void) | null;
    removeEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject | null
    ) => void;
    removeListener: (listener: ((event: MediaQueryListEvent) => void) | null) => void;
}

const linkSpy = vi.fn<(to: unknown) => void>();

function createMockMediaQueryList(query: string): MockMediaQueryList {
    return {
        addEventListener:
            vi.fn<(type: string, listener: EventListenerOrEventListenerObject | null) => void>(),
        addListener: vi.fn<(listener: ((event: MediaQueryListEvent) => void) | null) => void>(),
        dispatchEvent: vi.fn<(event: Event) => boolean>().mockReturnValue(true),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener:
            vi.fn<(type: string, listener: EventListenerOrEventListenerObject | null) => void>(),
        removeListener: vi.fn<(listener: ((event: MediaQueryListEvent) => void) | null) => void>(),
    };
}

function setupDesktopViewport() {
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: vi
            .fn<(query: string) => MockMediaQueryList>()
            .mockImplementation((query: string) => createMockMediaQueryList(query)),
    });
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));
}

vi.mock(import("@tanstack/react-router"), () => ({
    Link: ({ children, to, ...props }: Record<string, unknown>) => {
        linkSpy(to);

        return (
            <a href={String(to)} {...props}>
                {children}
            </a>
        );
    },
}));

vi.mock(import("#/integrations/auth/client"), () => ({
    authClient: {
        signOut: signOutSpy,
    },
}));

vi.mock(import("sonner"), () => ({
    toast: {
        error: toastErrorSpy,
    },
}));

function renderDashboardShell() {
    return render(
        <AppThemeProvider>
            <DashboardShell user={dashboardUser}>
                <div>Dashboard content</div>
            </DashboardShell>
        </AppThemeProvider>
    );
}

describe(DashboardShell, () => {
    beforeEach(() => {
        assignSpy.mockReset();
        linkSpy.mockReset();
        signOutSpy.mockReset();
        toastErrorSpy.mockReset();
        setupDesktopViewport();
        Object.defineProperty(window, "location", {
            configurable: true,
            value: {
                assign: assignSpy,
            },
        });
    });

    afterEach(() => {
        cleanup();
    });

    it("renders navbar branding, theme controls, and grouped navigation", async () => {
        renderDashboardShell();

        const brandMatches = await screen.findAllByText("Mock CMS");
        const navigationLabels = [
            "Workspace",
            "Operations",
            "Overview",
            "Content",
            "All posts",
            "Guidelines",
        ];

        expect(brandMatches.length).toBeGreaterThan(0);
        expect(screen.getAllByText("Admin workspace").length).toBeGreaterThan(0);
        expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeTruthy();
        expect(navigationLabels.every((label) => screen.getByText(label))).toBeTruthy();
    });

    it("renders the account trigger in the sidebar footer", async () => {
        renderDashboardShell();

        const accountTrigger = screen.getByRole("button", {
            name: /alex editor account menu/i,
        });
        const sidebarFooter = accountTrigger.closest('[data-slot="sidebar-footer"]');

        expect(sidebarFooter).toBeTruthy();
        expect(accountTrigger.textContent).toMatch(/Alex Editor.*alex\.editor@example\.com/u);
    });

    it("collapses the desktop sidebar and keeps the shell usable", async () => {
        const { container } = renderDashboardShell();

        const sidebar = await screen.findByText("Workspace");
        const sidebarRoot = sidebar.closest('[data-slot="sidebar"]');

        const sidebarTrigger = container.querySelector('[data-slot="sidebar-trigger"]');

        expect(sidebarTrigger).toBeTruthy();

        fireEvent.click(sidebarTrigger as Element);

        const accountTrigger = screen.getByRole("button", {
            name: /alex editor account menu/i,
        });

        expect(sidebarRoot.dataset.state).toBe("collapsed");
        expect(accountTrigger.textContent).toBe("AE");
        expect(screen.queryByText("alex.editor@example.com")).toBeNull();
        expect(container).toHaveTextContent("Dashboard content");
    });

    it("supports nested menu sections opening and closing", async () => {
        renderDashboardShell();

        const projectsTrigger = await screen.findByRole("button", {
            name: /projects/i,
        });

        expect(screen.queryByText("Editorial playbooks")).toBeNull();

        fireEvent.click(projectsTrigger);

        expect(screen.getByText("Editorial playbooks")).toBeTruthy();

        fireEvent.click(projectsTrigger);

        expect(screen.queryByText("Editorial playbooks")).toBeNull();
    });

    it("opens the footer account menu above the trigger with profile and sign out actions", async () => {
        renderDashboardShell();

        fireEvent.click(screen.getByRole("button", { name: /alex editor account menu/i }));

        const menu = await screen.findByRole("menu");
        const profileItem = screen.getByText("Profile").closest('[role="menuitem"]');
        const signOutItem = screen.getByText("Sign out").closest('[role="menuitem"]');
        const menuContent = menu.closest('[data-slot="dropdown-menu-content"]');

        expect(profileItem instanceof HTMLElement).toBeTruthy();
        expect(profileItem?.dataset.disabled).toBe("");
        expect(signOutItem).toBeTruthy();
        expect(menuContent instanceof HTMLElement).toBeTruthy();
        expect(menuContent?.dataset.side).toBe("top");
    });

    it("falls back to a display name derived from email when name is unavailable", () => {
        render(
            <AppThemeProvider>
                <DashboardShell
                    user={{
                        ...dashboardUser,
                        name: null,
                    }}
                >
                    <div>Dashboard content</div>
                </DashboardShell>
            </AppThemeProvider>
        );

        expect(
            screen.getByRole("button", { name: /alex editor account menu/i }).textContent
        ).toMatch(/Alex Editor.*alex\.editor@example\.com/u);
    });

    it("starts sign out from the account menu", async () => {
        signOutSpy.mockResolvedValue({});

        renderDashboardShell();

        fireEvent.click(screen.getByRole("button", { name: /alex editor account menu/i }));
        fireEvent.click(await screen.findByText("Sign out"));

        expect(signOutSpy).toHaveBeenCalledOnce();
        await waitFor(() => {
            expect(assignSpy).toHaveBeenCalledWith("/login");
        });
        expect(toastErrorSpy).not.toHaveBeenCalled();
    });
});
