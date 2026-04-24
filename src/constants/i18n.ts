import { i18nType, Language, LanguageKey } from "@/types/i18n"

export const LANGUAGES = {
    arabic: "ar",
    english: "en"

} as const

export const LanguagesMenu: {
    label: string,
    value: Language
}[] = [
    {
        label: "عربى",
        value: "ar"
    },
    {
        label: "English",
        value: "en"
    }
]

export const i18n: i18nType = {
    defaultLanguage: LANGUAGES.arabic,
    languages: Object.keys(LANGUAGES).map(lang => LANGUAGES[lang as LanguageKey])
}