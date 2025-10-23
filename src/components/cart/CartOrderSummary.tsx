import { CartItemWithProduct } from "@/types/cart"
import { Button } from "../ui/Button"
import { formatPrice } from "@/lib/formatters"
import { SHIPPING_COST, SHIPPING_THRESHOLD } from "@/constants/cart"

interface Props {
    cartItems: CartItemWithProduct[]
}

const CartOrderSummary = ({ cartItems }: Props) => {

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

    return (
        <div className="min-w-80 sticky top-5 h-fit rounded-md border border-border bg-card p-4 shadow-sm">
            <p className="text-muted-foreground text-sm">Free shipping over ${SHIPPING_THRESHOLD}</p>
            <h4 className="font-semibold text-xl py-3 border-b border-border">Order Summary</h4>
            <div className="space-y-2 my-3">
                <p className="flex justify-between items-center flex-wrap">items <span>{itemsCount}</span></p>
                <p className="flex justify-between items-center flex-wrap">Subtotal <span>${subtotal}</span></p>
                <p className="flex justify-between items-center flex-wrap">Shipping 
                    <span className={`${shipping <= 0 ? "text-success" : ""}`}>{shipping <= 0 ? "Free" : `$${shipping}`}</span>
                </p>
            </div>
            <p className="flex justify-between items-center text-2xl font-semibold flex-wrap py-3 border-y border-border">Total <span>${total}</span></p>
            <Button
                variant={"primary"}
                size={"lg"}
                className="w-full mt-4"
            >
                Checkout
            </Button>
        </div>
    )
}

export default CartOrderSummary