import { SHIPPING_COST, SHIPPING_THRESHOLD } from "@/constants/cart"
import { formatPrice } from "@/lib/formatters"
import { CheckoutItem } from "@/types/checkout"

interface Props {
    items: CheckoutItem[]
}

const CheckoutOrderSummary = ({ items }: Props) => {

    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0)

    const subtotal = formatPrice(items.reduce((acc, item) => {

        const hasDiscount = item.product.discountPercentage && item.product.discountPercentage > 0
    
        const finalPrice = hasDiscount
            ? (item.product.price - item.product.price * item.product.discountPercentage! / 100)
            : item.product.price

        return acc + item.quantity * finalPrice

    }, 0))

    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const total = formatPrice(subtotal + shipping)

    return (
        <div className="rounded-md border border-border bg-card p-3 shadow-sm">
            <h4 className="font-semibold text-xl py-3">Order Summary</h4>
            <div className="space-y-2 py-3 border-y border-border">
                <p className="flex justify-between items-center flex-wrap gap-2">items <span>{itemsCount}</span></p>
                <p className="flex justify-between items-center flex-wrap gap-2">Subtotal <span>${subtotal}</span></p>
                <p className="flex justify-between items-center flex-wrap gap-2">Shipping 
                    <span className={`${shipping <= 0 ? "text-success" : ""}`}>{shipping <= 0 ? "Free" : `$${shipping}`}</span>
                </p>
            </div>
            <p className="flex justify-between items-center text-2xl font-semibold flex-wrap py-3">Total <span>${total}</span></p>
        </div>
    )
}

export default CheckoutOrderSummary