import { Address } from "@/generated/prisma"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { FormEvent, useState, useTransition } from "react"
import toast from "react-hot-toast"
import { Button } from "../ui/Button"
import { FaCheck } from "react-icons/fa"
import { checkoutAction } from "@/server/actions/checkout"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/redux/hooks"
import { userCartApi } from "@/redux/features/userCartApi"
import { CheckoutItem, PaymentMethod } from "@/types/checkout"

interface Props {
    clientSecret: string
    paymentIntentId: string
    selectedAddress: Address
    formattedTotal: string
    paymentMethod: PaymentMethod
}

const PaymentForm = ({ clientSecret, paymentIntentId, selectedAddress, formattedTotal, paymentMethod }: Props) => {

    const stripe = useStripe()
    const elements = useElements()

    const [paymentElementMounted, setPaymentElementMounted] =  useState(false)

    const [isPlacingOrder, startPlacingOrder] = useTransition()

    const router = useRouter()
    const dispatch = useAppDispatch()

    const placeOrder = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        startPlacingOrder(async () => {

            if (paymentMethod === 'card') {

                // Validate cart items quantities before confirming payment
                const res = await fetch(`/api/user/cart/validate-items`)

                if (!res.ok) {
                    toast.error("Some items quantity is no longer available in the cart")
                    router.push("/cart")
                    return
                }

                if (stripe && elements) {

                    const { error: paymentValidationError } = await elements.submit()

                    if (paymentValidationError) return

                    // Update PaymentIntent metadata with selected address label
                    const res = await fetch('/api/stripe/update-metadata', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            paymentIntentId,
                            metadata: { addressLabel: selectedAddress.label }
                        })
                    })

                    if (!res.ok) {
                        toast.error("Payment failed")
                        return
                    }

                    const { error } = await stripe.confirmPayment({
                        clientSecret,
                        elements,
                        confirmParams: { return_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/checkout/success` }
                    })

                    if (error) {
                        toast.error(error.message || "Payment failed")
                        return
                    }
                }
            }
            else if (paymentMethod === 'cash') {
                try {
                    const { status, message } = await checkoutAction(selectedAddress.label)

                    if (message && status === 201) {
                        toast.success(message)
                        router.push("/profile/orders")
                    }
                    else {
                        toast.error(message)
                        router.push("/cart")
                    }
                }
                catch {
                    toast.error("Failed to place the order")
                    router.push("/cart")
                }
                finally {
                    dispatch(userCartApi.util.invalidateTags(['user-cart']))
                }
            }
        })
    }

    if (!stripe || !elements) return null

    return (
        <form onSubmit={placeOrder}>
            <PaymentElement
                className={`${paymentMethod === 'cash' ? "hidden": null}`}
                onReady={() => setPaymentElementMounted(true)}
            />
            <Button
                variant={"primary"}
                size={"lg"}
                disabled={!selectedAddress || isPlacingOrder || (paymentMethod === 'card' && !paymentElementMounted)}
                className="w-full! mt-4"
            >
                {isPlacingOrder ? (
                    <>PLACING ORDER...</>
                ): (
                    <><FaCheck /> PLACE ORDER ({formattedTotal})</>
                )}
            </Button>
        </form>
    )
}

export default PaymentForm