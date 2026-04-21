import { NextRequest, NextResponse } from "next/server"
import Negotiator from "negotiator"
import { match as matchLanguage } from "@formatjs/intl-localematcher"
import { i18n } from "./constants/i18n"
import { cookies } from "next/headers"
import { Language } from "./types/i18n"

async function getLanguage(req: NextRequest): Promise<Language> {

    const cookieStore = await cookies()

    const savedLanguage = cookieStore.get("savedLanguage")?.value

    if (i18n.languages.some(lang => lang === savedLanguage)) {
        return savedLanguage as Language
    }

    const negotiatorHeaders: Record<string, string> = {}

    req.headers.forEach((value, key) => negotiatorHeaders[key] = value)

    const languages = i18n.languages

    const userLanguages = new Negotiator({ headers: negotiatorHeaders }).languages()

    let language = matchLanguage(userLanguages, languages, i18n.defaultLanguage) as Language

    cookieStore.set("savedLanguage", language)

    return language
}

export async function middleware(req: NextRequest) {

    const pathname = req.nextUrl.pathname

    const pathnameLang = i18n.languages.find(lang => pathname.startsWith(`/${lang}`))

    if (!pathnameLang) {
        const language = await getLanguage(req)

        return NextResponse.redirect(new URL(`/${language}/${pathname}`, req.url))
    }
    else {

        const cookieStore = await cookies()

        cookieStore.set("savedLanguage", pathnameLang)
    }

    return NextResponse.next()
}

export const config = {
    // Matcher ignoring `/_next/`, `/api/`, ..etc
    matcher: [
        '/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml).*)'
    ]
}