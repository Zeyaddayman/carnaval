import { LANGUAGES } from "@/constants/i18n";
import { Language } from "@/generated/prisma"

export type LanguageKey = keyof typeof LANGUAGES

export type i18nType = {
    defaultLanguage: Language;
    languages: Language[]
}