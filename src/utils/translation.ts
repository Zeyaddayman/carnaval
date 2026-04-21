import { Language } from '@/types/i18n'
import { cache as reactCache } from 'react'

const dictionaries = {
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
    ar: () => import('@/dictionaries/ar.json').then((module) => module.default)
}

const getTranslation = reactCache(async (lang: Language) => {
    return dictionaries[lang]()
})

type TranslationValues = Record<string, string | number>

export const inject = (str: string, values: TranslationValues) => {
    return str.replace(/{{(\w+)}}/g, (_, key) => {
        return values[key]?.toString() ?? `{{${key}}}`
    })
}

export default getTranslation