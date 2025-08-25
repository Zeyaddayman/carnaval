import { CardProduct } from "@/types/products"
import Image from "next/image"
import Link from "next/link"
import RatingStars from "../ui/RatingStars"

const ProductCard = ({ product }: { product: CardProduct }) => {

    const hasDiscount = product.discountPercentage && product.discountPercentage > 0

    const finalPrice = hasDiscount
        ? Number(product.price) - Number(product.price) * product.discountPercentage! / 100
        : Number(product.price)

    return (
        <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="p-3 w-78 flex flex-col border border-border rounded-lg"
        >
            <div
                className="relative w-full h-78 aspect-square"
            >
                <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="312px"
                    className="rounded-md border border-border"
                />
            </div>
            <h3 className="text-lg text-foreground font-semibold mt-2 mb-1">{product.title}</h3>
            {product.brand && <p className="text-muted-foreground">by <span>{product.brand.name}</span></p>}
            <div className="flex-1 flex items-end flex-wrap gap-3 mt-2 mb-4">
                <p className="text-lg font-semibold text-foreground">${finalPrice.toFixed(2)}</p>
                {hasDiscount && (
                    <>
                    <p className="text-lg text-muted-foreground line-through">${Number(product.price).toFixed(2)}</p>
                    <p className="bg-success/10 text-success text-sm p-1 rounded-lg">-{product.discountPercentage}%</p>
                    </>
                )}
            </div>
            <div className="flex gap-2 items-center">
                <RatingStars rating={product.rating} />
                <span className="text-muted-foreground">{product.rating}</span>
            </div>
        </Link>
    )
}

export default ProductCard