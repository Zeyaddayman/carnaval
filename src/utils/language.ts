import { Language } from '@/types/i18n'
import { headers } from 'next/headers'
import { cache as reactCache } from 'react'

export const getLanguage = reactCache(async () => {

    const pathname = ((await headers()).get("x-pathname"))

    return pathname!.split("/")[1] as Language
})