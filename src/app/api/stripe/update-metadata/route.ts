import { stripe } from "@/lib/stripe";
import { getLanguage } from "@/utils/language";
import getTranslation from "@/utils/translation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const [{ paymentIntentId, metadata }, lang] = await Promise.all([req.json(), getLanguage()])

    const translation = await getTranslation(lang)

    try {

        await stripe.paymentIntents.update(paymentIntentId, { metadata })

        return NextResponse.json(translation.messages.checkout.stripe.metadataUpdated, { status: 200 })

    } catch {
        return NextResponse.json(translation.messages.checkout.stripe.metadataUpdateFailed, { status: 500 })
    }
}