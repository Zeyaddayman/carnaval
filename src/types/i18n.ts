import { LANGUAGES } from "@/constants/i18n";

export type LanguageKey = keyof typeof LANGUAGES
export type Language = typeof LANGUAGES[LanguageKey]

export type i18nType = {
    defaultLanguage: Language;
    languages: Language[]
}