import { ProductDetails } from "@/types/products"
import RatingStars from "../ui/RatingStars"
import { formatPrice, formatRating } from "@/lib/formatters"

interface Props {
    product: ProductDetails
}

const ProductInfo = ({ product }: Props) => {

    const hasDiscount = product.discountPercentage && product.discountPercentage > 0

    const productPrice = formatPrice(Number(product.price))

    const finalPrice = hasDiscount
        ? formatPrice(Number(product.price) - (Number(product.price) * product.discountPercentage! / 100))
        : productPrice

    const productRating = formatRating(product.rating)

    return (
        <div>
            <div>
                <h2 className="text-foreground text-3xl lg:text-4xl font-bold">
                    {product.title}
                </h2>
                {product.brand && <p className="text-muted-foreground">by {product.brand.name}</p>}
            </div>
            <p className="my-4 text-foreground">
                {product.description}
            </p>
            <div className="flex gap-2 items-center mb-4">
                <RatingStars size="lg" rating={product.rating} />
                <span className="text-foreground">{productRating}</span>
            </div>
            <div className="flex gap-3 items-center">
                <p className="text-2xl lg:text-3xl font-bold text-foreground">${finalPrice}</p>
                {hasDiscount && (
                    <>
                    <p className="text-lg text-muted-foreground line-through">${productPrice}</p>
                    <p className="bg-success/10 text-success text-sm p-2 rounded-full">-{product.discountPercentage}%</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProductInfo