import { CardProduct } from "@/types/products"
import Image from "next/image"
import Link from "next/link"
import RatingStars from "../ui/RatingStars"
import AddToWishlist from "../ui/ToggleWishlistItem"
import { formatPrice, formatRating } from "@/lib/formatters"
import { isAuthenticated } from "@/server/db/auth"

const ProductCard = async ({ product }: { product: CardProduct }) => {

    const session = await isAuthenticated()

    const hasDiscount = product.discountPercentage && product.discountPercentage > 0

    const productPrice = formatPrice(product.price)

    const finalPrice = hasDiscount

        ? formatPrice(product.price - (product.price * product.discountPercentage! / 100))
        : productPrice

    const productRating = formatRating(product.rating)

    return (
        <div key={product.id} className="relative bg-card border border-border rounded-lg">
            <span className="absolute top-3 right-3 z-10">
                <AddToWishlist session={session} product={product} />
            </span>
            <Link
                href={`/product/${product.id}`}
                className="p-3 w-77 h-full flex flex-col"
            >
                <div
                    className="relative w-full h-78 aspect-square"
                >
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="308px"
                        className="rounded-md border border-border"
                    />
                </div>
                <h3 className="text-lg text-card-foreground font-semibold mt-2 mb-1">{product.title}</h3>
                {product.brand && <p className="text-muted-foreground">by <span>{product.brand.name}</span></p>}

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