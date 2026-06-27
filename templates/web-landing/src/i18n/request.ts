import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import { defaultLocale, isLocale, localeCookieName } from "@/i18n/config";
import { messagesByLocale } from "@/i18n/messages";

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get(localeCookieName)?.value;
    const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;

    return {
        locale,
        messages: messagesByLocale[locale],
    };
});
