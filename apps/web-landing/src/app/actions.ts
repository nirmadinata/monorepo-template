"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { defaultLocale, isLocale, localeCookieMaxAge, localeCookieName } from "@/i18n/config";

export async function setLocaleAction(formData: FormData) {
    const localeValue = formData.get("locale");
    const pathnameValue = formData.get("pathname");

    const locale =
        typeof localeValue === "string" && isLocale(localeValue) ? localeValue : defaultLocale;
    const pathname =
        typeof pathnameValue === "string" && pathnameValue.startsWith("/") ? pathnameValue : "/";

    const cookieStore = await cookies();

    cookieStore.set(localeCookieName, locale, {
        maxAge: localeCookieMaxAge,
        path: "/",
        sameSite: "lax",
    });

    redirect(pathname);
}
