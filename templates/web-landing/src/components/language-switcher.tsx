"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";

import { setLocaleAction } from "@/app/actions";
import { locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

function LocaleButton({ activeLocale, locale }: { activeLocale: Locale; locale: Locale }) {
    const { pending } = useFormStatus();
    const t = useTranslations("LanguageSwitcher");

    return (
        <button
            aria-pressed={activeLocale === locale}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                activeLocale === locale
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100"
            } disabled:cursor-not-allowed disabled:opacity-70`}
            disabled={pending}
            name="locale"
            type="submit"
            value={locale}
        >
            {t(locale)}
        </button>
    );
}

export function LanguageSwitcher() {
    const locale = useLocale() as Locale;
    const pathname = usePathname() || "/";
    const t = useTranslations("LanguageSwitcher");

    return (
        <form
            action={setLocaleAction}
            className="flex max-w-full flex-wrap items-center justify-end gap-2 rounded-[1.25rem] border border-slate-200/80 bg-white/80 p-2 shadow-sm shadow-slate-200/40 backdrop-blur"
        >
            <input name="pathname" type="hidden" value={pathname}></input>
            <span className="sr-only px-2 text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase sm:not-sr-only">
                {t("label")}
            </span>
            <div className="flex items-center gap-2">
                {locales.map((item) => (
                    <LocaleButton activeLocale={locale} key={item} locale={item}></LocaleButton>
                ))}
            </div>
        </form>
    );
}
