"use client"

import { CartItemWithProduct } from "@/types/cart"
import { Button } from "../ui/Button"
import { SHIPPING_THRESHOLD } from "@/constants/cart"
import { CiWarning } from "react-icons/ci"
import { useRouter } from "next/navigation"
import { getCartItemsCount, getCartSubtotal } from "@/utils/cart"
import { getShipping, getTotal } from "@/utils"
import { formatPrice } from "@/utils/formatters"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    cartItems: CartItemWithProduct[]
    hasUnavailableItems: boolean
    lang: Language
    translation: Translation["cart"]
}

const CartOrderSummary = ({ cartItems, hasUnavailableItems, lang, translation }: Props) => {

    const router = useRouter()

    const itemsCount = getCartItemsCount(cartItems)
    const subtotal = getCartSubtotal(cartItems)
    const shipping = getShipping(subtotal)
    const total = getTotal(subtotal, shipping)

    const formattedSubtotal = formatPrice(subtotal)
    const formattedShipping = formatPrice(shipping)
    const formattedTotal = formatPrice(total)

    const goToCheckout = () => {
        if (!hasUnavailableItems) {
            router.push(`/${lang}/checkout`)
        }
    }

    return (
        <div className="w-full lg:w-80 sticky top-5 h-fit rounded-md border border-border bg-card p-3 shadow-sm">
            <p className="text-muted-foreground text-sm">{translation.summary.freeShippingOver} {formatPrice(SHIPPING_THRESHOLD)}</p>
            <h4 className="font-semibold text-xl py-3 border-b border-border">{translation.summary.title}</h4>
            <div className="space-y-2 my-3">
                <p className="flex justify-between items-center flex-wrap gap-2">{translation.summary.items} <span>{itemsCount}</span></p>
                <p className="flex justify-between items-center flex-wrap gap-2">{translation.summary.subtotal} <span>{formattedSubtotal}</span></p>
                <p className="flex justify-between items-center flex-wrap gap-2">{translation.summary.shipping}
                    <span className={`${shipping <= 0 ? "text-success" : ""}`}>{shipping <= 0 ? translation.summary.freeText : `${formattedShipping}`}</span>
                </p>
            </div>
            <p className="flex justify-between items-center text-2xl font-semibold flex-wrap py-3 border-y border-border">{translation.summary.total} <span>{formattedTotal}</span></p>
            {hasUnavailableItems && (
                <div className="flex gap-2 items-center p-3 bg-warning/10 text-warning rounded-md mt-2">
                    <CiWarning className="shrink-0" size={20} />
                    <p>{translation.warnings.resloveBeforeCheckout}</p>
                </div>
            )}
            <Button
                variant={"primary"}
                size={"lg"}
                className="w-full mt-4"
                disabled={hasUnavailableItems}
                onClick={goToCheckout}
            >
                {translation.summary.checkout}
            </Button>
        </div>
    )
}

export default CartOrderSummary