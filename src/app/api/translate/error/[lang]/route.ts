import { i18n } from "@/constants/i18n";
import { Language } from "@/generated/prisma";
import getTranslation from "@/utils/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ lang: string }> }) {

    const { lang } = await params

    const translation = await getTranslation(lang as Language)


    return NextResponse.json(translation.error, { status: 200 })
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}