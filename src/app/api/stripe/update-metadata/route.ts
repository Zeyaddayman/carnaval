import { stripe } from "@/lib/stripe";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {

    const { paymentIntentId, metadata } = await req.json();

    try {

        await stripe.paymentIntents.update(paymentIntentId, {
            metadata
        })

        return new Response('Metadata updated', { status: 200 })

    } catch (error) {
        return new Response('Failed to update metadata', { status: 500 })
    }

}