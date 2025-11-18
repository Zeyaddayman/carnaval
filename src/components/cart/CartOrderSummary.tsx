"use client"

import { CartItemWithProduct } from "@/types/cart"
import { Button } from "../ui/Button"
import { formatPrice } from "@/lib/formatters"
import { SHIPPING_COST, SHIPPING_THRESHOLD } from "@/constants/cart"
import { CiWarning } from "react-icons/ci"
import { useRouter } from "next/navigation"

interface Props {
    cartItems: CartItemWithProduct[]
    hasUnavailableItems: boolean
}

const CartOrderSummary = ({ cartItems, hasUnavailableItems }: Props) => {

    const router = useRouter()

    const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    const subtotal = formatPrice(cartItems.reduce((acc, item) => {

        const hasDiscount = item.product.discountPercentage && item.product.discountPercentage > 0
    
        const finalPrice = hasDiscount
            ? (item.product.price - item.product.price * item.product.discountPercentage! / 100)
            : item.product.price

        return acc + item.quantity * finalPrice

    }, 0))

    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const total = formatPrice(subtotal + shipping)

    const goToCheckout = () => {
        if (!hasUnavailableItems) {
            router.push("/checkout")
        }
    }

    return (
        <div className="w-full lg:w-80 sticky top-5 h-fit rounded-md border border-border bg-card p-3 shadow-sm">
            <p className="text-muted-foreground text-sm">Free shipping over ${SHIPPING_THRESHOLD}</p>
            <h4 className="font-semibold text-xl py-3 border-b border-border">Order Summary</h4>
            <div className="space-y-2 my-3">
                <p className="flex justify-between items-center flex-wrap gap-2">items <span>{itemsCount}</span></p>
                <p className="flex justify-between items-center flex-wrap gap-2">Subtotal <span>${subtotal}</span></p>
                <p className="flex justify-between items-center flex-wrap gap-2">Shipping 
                    <span className={`${shipping <= 0 ? "text-success" : ""}`}>{shipping <= 0 ? "Free" : `$${shipping}`}</span>
                </p>
            </div>
            <p className="flex justify-between items-center text-2xl font-semibold flex-wrap py-3 border-y border-border">Total <span>${total}</span></p>
            {hasUnavailableItems && (
                <div className="flex gap-2 items-center p-3 bg-warning/10 text-warning rounded-md mt-2">
                    <CiWarning className="shrink-0" size={20} />
                    <p>Please resolve unavailable items before checkout.</p>
                </div>
            )}
            <Button
                variant={"primary"}
                size={"lg"}
                className="w-full mt-4"
                disabled={hasUnavailableItems}
                onClick={goToCheckout}
            >
                Checkout
            </Button>
        </div>
    )
}

export default CartOrderSummary