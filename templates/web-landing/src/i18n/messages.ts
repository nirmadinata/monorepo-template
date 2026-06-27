import type { Locale } from "@/i18n/config";
import en from "@/messages/en.json";
import id from "@/messages/id.json";

export const messagesByLocale = {
    en,
    id,
} satisfies Record<Locale, typeof en>;
