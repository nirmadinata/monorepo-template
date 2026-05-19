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
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-2"
        >
            <input name="pathname" type="hidden" value={pathname}></input>
            <span className="px-2 text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
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
