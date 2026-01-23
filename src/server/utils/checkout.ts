import { stripe } from "@/lib/stripe"

export const createPaymentIntent = async (amount: number, userId: string) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: { userId }
    })

    return { client_secret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id }
}