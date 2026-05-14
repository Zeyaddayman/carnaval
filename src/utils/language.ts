import { Language } from "@/generated/prisma";
import { headers } from 'next/headers'
import { cache as reactCache } from 'react'

export const getLanguage = reactCache(async () => {

    const language = (((await headers()).get("x-language")) || "en") as Language

    return language
})