"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { shellNavigation, shellResourceLinks } from "@/components/public-shell-navigation";

interface PublicShellProps {
    children: React.ReactNode;
}

interface NavigationListProps {
    onNavigate?: () => void;
}

export function PublicShell({ children }: PublicShellProps) {
    const t = useTranslations("Shell");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)] text-slate-950">
            <a
                className="sr-only fixed top-4 left-4 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white focus:not-sr-only"
                href="#main-content"
            >
                {t("skipToContent")}
            </a>

            <div className="relative isolate overflow-hidden">
                <div className="absolute inset-x-0 top-0 -z-10 h-128 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_58%)]"></div>

                <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                aria-controls="mobile-sidebar"
                                aria-expanded={isMobileSidebarOpen}
                                aria-label={t("menu")}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                                onClick={() => setIsMobileSidebarOpen(true)}
                                type="button"
                            >
                                <span className="flex flex-col gap-1.5">
                                    <span className="h-0.5 w-5 rounded-full bg-current"></span>
                                    <span className="h-0.5 w-5 rounded-full bg-current"></span>
                                    <span className="h-0.5 w-5 rounded-full bg-current"></span>
                                </span>
                            </button>

                            <Link className="flex min-w-0 items-center gap-3" href="/">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold tracking-[0.24em] text-white uppercase shadow-lg shadow-slate-300/40">
                                    OL
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-base font-semibold text-slate-950 sm:text-lg">
                                        {t("brand")}
                                    </span>
                                    <span className="block truncate text-sm text-slate-500">
                                        {t("tagline")}
                                    </span>
                                </span>
                            </Link>
                        </div>

                        <nav aria-label={t("primaryNavigation")} className="hidden lg:block">
                            <ul className="flex items-center gap-8">
                                {shellNavigation.map((item) => (
                                    <li key={item.href}>
                                        <a
                                            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                                            href={item.href}
                                        >
                                            {t(item.labelKey)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="flex items-center gap-3">
                            <LanguageSwitcher></LanguageSwitcher>
                            <a
                                className="hidden rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 sm:inline-flex"
                                href="#contact"
                            >
                                {t("headerCta")}
                            </a>
                        </div>
                    </div>
                </header>

                <main id="main-content">{children}</main>

                <footer
                    className="border-t border-slate-200/80 bg-slate-950 text-slate-200"
                    id="resources"
                >
                    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,0.7fr)] lg:px-8">
                        <div className="space-y-3">
                            <p className="text-xs font-semibold tracking-[0.3em] text-sky-200 uppercase">
                                {t("footerEyebrow")}
                            </p>
                            <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                {t("footerTitle")}
                            </h2>
                            <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                                {t("footerDescription")}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold tracking-[0.24em] text-slate-400 uppercase">
                                {t("quickLinks")}
                            </h3>
                            <ul className="space-y-2">
                                {shellNavigation.map((item) => (
                                    <li key={item.href}>
                                        <a
                                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition hover:text-white"
                                            href={item.href}
                                        >
                                            <span>{t(item.labelKey)}</span>
                                            <span aria-hidden="true">/</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold tracking-[0.24em] text-slate-400 uppercase">
                                {t("externalLinks")}
                            </h3>
                            <ul className="space-y-2">
                                {shellResourceLinks.map((item) => (
                                    <li key={item.href}>
                                        <a
                                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition hover:text-white"
                                            href={item.href}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <span>{t(item.labelKey)}</span>
                                            <span aria-hidden="true">↗</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4 text-sm text-slate-400">
                                <p>{t("footerCopyright")}</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <div
                className={`fixed inset-0 z-50 lg:hidden ${
                    isMobileSidebarOpen ? "" : "pointer-events-none"
                }`}
            >
                <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] transition ${
                        isMobileSidebarOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                ></div>
                <aside
                    className={`absolute inset-y-0 left-0 flex w-full max-w-sm transform flex-col border-r border-slate-200 bg-white text-slate-950 shadow-2xl transition duration-300 ${
                        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                    id="mobile-sidebar"
                >
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.28em] text-sky-700 uppercase">
                                {t("menu")}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">{t("tagline")}</p>
                        </div>
                        <button
                            aria-label={t("closeMenu")}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                            onClick={() => setIsMobileSidebarOpen(false)}
                            type="button"
                        >
                            <span className="text-lg leading-none">x</span>
                        </button>
                    </div>
                    <SidebarContent
                        onNavigate={() => setIsMobileSidebarOpen(false)}
                    ></SidebarContent>
                </aside>
            </div>
        </div>
    );
}

function SidebarContent({ onNavigate }: NavigationListProps) {
    const locale = useLocale();
    const t = useTranslations("Shell");

    return (
        <div className="flex h-full flex-col px-4 py-5 sm:px-5 sm:py-6">
            <div className="space-y-3 border-b border-slate-200 pb-5">
                <p className="text-xs font-semibold tracking-[0.3em] text-sky-700 uppercase">
                    {t("sidebarEyebrow")}
                </p>
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                        {t("sidebarTitle")}
                    </h2>
                    <p className="text-sm leading-6 text-slate-600">{t("sidebarDescription")}</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>{t("localeLabel")}</span>
                    <span className="font-semibold tracking-[0.24em] uppercase">{locale}</span>
                </div>
            </div>

            <nav className="mt-5 flex-1" aria-label={t("sidebarEyebrow")}>
                <ul className="space-y-3">
                    {shellNavigation.map((item, index) => (
                        <li key={item.href}>
                            <a
                                aria-label={`${t(item.labelKey)}: ${t(item.descriptionKey)}`}
                                className="group block rounded-3xl border border-slate-200 bg-white px-4 py-4 transition hover:border-sky-300 hover:bg-sky-50/40"
                                href={item.href}
                                onClick={onNavigate}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold tracking-[0.24em] text-white uppercase">
                                        {`0${index + 1}`}
                                    </span>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-slate-950">
                                            {t(item.labelKey)}
                                        </p>
                                        <p className="text-sm leading-6 text-slate-600 transition group-hover:text-slate-700">
                                            {t(item.descriptionKey)}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>

                <a
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                    href="#contact"
                    onClick={onNavigate}
                >
                    {t("headerCta")}
                </a>
            </nav>
        </div>
    );
}
