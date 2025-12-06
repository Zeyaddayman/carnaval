import { CartItemWithProduct } from "@/types/cart"
import RatingStars from "../ui/RatingStars"
import Link from "next/link"
import { formatPrice, formatRating } from "@/utils/formatters"
import { getProductFinalPrice, productHasDiscount } from "@/utils/product"

interface Props {
    product: CartItemWithProduct["product"]
    quantity: number
}

const CartItemInfo = ({ product, quantity }: Props) => {

    const hasDiscount = productHasDiscount(product.discountPercentage)

    const finalPrice = getProductFinalPrice(product.price, product.discountPercentage)

    const formattedProductPrice = formatPrice(product.price)
    const formattedFinalPrice = formatPrice(finalPrice)
    const formattedTotalPrice = formatPrice(finalPrice * quantity)

    const productRating = formatRating(product.rating)

    return (
        <div className="flex gap-2 justify-between">
            <div>
                <h5 className="font-semibold">{product.title}</h5>
                {product.brand && <p className="text-muted-foreground text-sm">by: {product.brand.name}</p>}
                <div className="flex gap-2 items-center my-2">
                    <RatingStars rating={product.rating} />
                    <span className="text-foreground text-sm">{productRating}</span>
                </div>
                <Link
                    className="underline text-sm"
                    href={`/product/${product.id}`}
                >
                    View product
                </Link>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-2xl font-semibold text-foreground mb-2">{formattedTotalPrice}</p>
                <p>{quantity} x {formattedFinalPrice}</p>
                {hasDiscount && (
                    <div className="flex gap-2 items-center">
                        <p className="text-muted-foreground line-through text-sm">{formattedProductPrice}</p>
                        <p className="bg-success/10 text-success text-sm p-1 rounded-full">-{product.discountPercentage}%</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartItemInfo