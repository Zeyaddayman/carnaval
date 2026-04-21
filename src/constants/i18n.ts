import { i18nType, LanguageKey } from "@/types/i18n"

export const LANGUAGES = {
    arabic: "ar",
    english: "en"

} as const

export const i18n: i18nType = {
    defaultLanguage: LANGUAGES.arabic,
    languages: Object.keys(LANGUAGES).map(lang => LANGUAGES[lang as LanguageKey])
}