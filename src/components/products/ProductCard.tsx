import { CardProduct } from "@/types/products"
import Image from "next/image"
import Link from "next/link"
import RatingStars from "../ui/RatingStars"
import { formatPrice, formatRating } from "@/lib/formatters"
import { isAuthenticated } from "@/server/db/auth"
import ToggleWishlistItem from "../ui/ToggleWishlistItem"

const ProductCard = async ({ product }: { product: CardProduct }) => {

    const session = await isAuthenticated()

    const hasDiscount = product.discountPercentage && product.discountPercentage > 0

    const productPrice = formatPrice(product.price)

    const finalPrice = hasDiscount

        ? formatPrice(product.price - (product.price * product.discountPercentage! / 100))
        : productPrice

    const productRating = formatRating(product.rating)

    return (
        <div className="relative bg-card border border-border rounded-lg">
            <span className="absolute top-2 right-2 z-10">
                <ToggleWishlistItem session={session} product={product} />
            </span>
            <Link
                href={`/product/${product.id}`}
                className="p-3 h-full flex flex-col"
            >
                <div
                    className="relative w-full aspect-square"
                >
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 45vw, (max-width: 1536px) 22vw, 18vw"
                        className="rounded-md border border-border"
                    />
                </div>
                <h3 className="text-card-foreground lg:text-lg lg:font-semibold mt-2 mb-1">{product.title}</h3>
                {product.brand && <p className="text-muted-foreground text-sm">by <span>{product.brand.name}</span></p>}

                <div className="flex gap-2 items-center my-3">
                    <RatingStars rating={product.rating} />
                    <span className="text-muted-foreground">{productRating}</span>
                </div>

                <div className="flex-1 flex items-end flex-wrap gap-3">
                    <p className="text-lg font-semibold text-card-foreground">${finalPrice}</p>
                    {hasDiscount && (
                        <>
                        <p className="text-lg text-muted-foreground line-through">${productPrice}</p>
                        <p className="bg-success/10 text-success text-sm p-1 rounded-lg">-{product.discountPercentage}%</p>
                        </>
                    )}
                </div>
            </Link>
        </div>
    )
}

export default ProductCard