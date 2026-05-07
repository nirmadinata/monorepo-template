// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppThemeProvider } from "#/components/theme-provider";

import { DashboardShell } from "./dashboard-shell";

interface MockMediaQueryList {
    addEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject | null
    ) => void;
    addListener: (
        listener: ((event: MediaQueryListEvent) => void) | null
    ) => void;
    dispatchEvent: (event: Event) => boolean;
    matches: boolean;
    media: string;
    onchange: ((event: MediaQueryListEvent) => void) | null;
    removeEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject | null
    ) => void;
    removeListener: (
        listener: ((event: MediaQueryListEvent) => void) | null
    ) => void;
}

const linkSpy = vi.fn<(to: unknown) => void>();

function createMockMediaQueryList(query: string): MockMediaQueryList {
    return {
        addEventListener:
            vi.fn<
                (
                    type: string,
                    listener: EventListenerOrEventListenerObject | null
                ) => void
            >(),
        addListener:
            vi.fn<
                (
                    listener: ((event: MediaQueryListEvent) => void) | null
                ) => void
            >(),
        dispatchEvent: vi.fn<(event: Event) => boolean>().mockReturnValue(true),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener:
            vi.fn<
                (
                    type: string,
                    listener: EventListenerOrEventListenerObject | null
                ) => void
            >(),
        removeListener:
            vi.fn<
                (
                    listener: ((event: MediaQueryListEvent) => void) | null
                ) => void
            >(),
    };
}

function setupDesktopViewport() {
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: vi
            .fn<(query: string) => MockMediaQueryList>()
            .mockImplementation((query: string) =>
                createMockMediaQueryList(query)
            ),
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

function renderDashboardShell() {
    return render(
        <AppThemeProvider>
            <DashboardShell>
                <div>Dashboard content</div>
            </DashboardShell>
        </AppThemeProvider>
    );
}

describe(DashboardShell, () => {
    beforeEach(() => {
        linkSpy.mockReset();
        setupDesktopViewport();
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
        expect(screen.getAllByText("Admin workspace").length).toBeGreaterThan(
            0
        );
        expect(
            screen.getByRole("button", { name: "Switch to dark theme" })
        ).toBeTruthy();
        expect(
            navigationLabels.every((label) => screen.getByText(label))
        ).toBeTruthy();
    });

    it("collapses the desktop sidebar and keeps the shell usable", async () => {
        const { container } = renderDashboardShell();

        const sidebar = await screen.findByText("Workspace");
        const sidebarRoot = sidebar.closest('[data-slot="sidebar"]');

        expect(sidebarRoot.dataset.state).toBe("expanded");

        const sidebarTrigger = container.querySelector(
            '[data-slot="sidebar-trigger"]'
        );

        expect(sidebarTrigger).toBeTruthy();

        fireEvent.click(sidebarTrigger as Element);

        expect(sidebarRoot.dataset.state).toBe("collapsed");
        expect(container.textContent).toContain("Dashboard content");
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
});
