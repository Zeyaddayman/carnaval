"use client"

import Image from "next/image"
import Link from "next/link"
import RatingStars from "../ui/RatingStars"
import { Button } from "../ui/Button"
import { BsCartPlusFill } from "react-icons/bs"
import { FiTrash2 } from "react-icons/fi"
import { formatPrice, formatRating } from "@/utils/formatters"
import { wishlistItemWithProduct } from "@/types/wishlist"
import { productHasDiscount } from "@/utils/product"
import { selectCartItem } from "@/redux/features/userCartApi"
import { FaCheck } from "react-icons/fa"
import { useAppSelector } from "@/redux/hooks"

interface Props {
    product: wishlistItemWithProduct["product"]
    userId: string
    removeItem: (productId: string) => void
    addItemToCart: (product: wishlistItemWithProduct["product"]) => void
}

const WishlistItemCard = ({ product, userId, removeItem, addItemToCart }: Props) => {

    const cartItem = useAppSelector(selectCartItem(userId, product.id))

    const hasDiscount = productHasDiscount(product.discountPercentage)

    const formattedProductPrice = formatPrice(product.price)
    const formattedFinalPrice = formatPrice(product.finalPrice)

    const productRating = formatRating(product.rating)

    const inStock = product.stock > 0

    const handleAddItemToCart = () => {
        addItemToCart(product)
    }

    const handleRemoveItem = () => {
        removeItem(product.id)
    }

    return (
        <div className="relative flex flex-col gap-3 p-3 bg-card border border-border rounded-lg">
            <Link
                href={`/product/${product.id}`}
                className="w-full flex flex-col flex-1"
            >
                {inStock ? (
                    <span className="absolute top-2 right-2 z-10 bg-success text-success-foreground text-sm p-2 rounded-full">In stock</span>
                ) : (
                    <span className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground text-sm p-2 rounded-full">Out of stock</span>
                )}
                <div
                    className="relative w-full aspect-square"
                >
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="rounded-md border border-border"
                    />
                </div>
                <h3 className="text-card-foreground sm:text-lg sm:font-semibold mt-2 mb-1">{product.title}</h3>
                {product.brand && <p className="text-muted-foreground text-sm">by <span>{product.brand.name}</span></p>}
                <div className="flex gap-2 items-center my-3">
                    <RatingStars rating={product.rating} />
                    <span className="text-muted-foreground text-sm">{productRating}</span>
                </div>
                <div className="flex items-center flex-wrap gap-3 mt-auto">
                    <p className="text-lg font-semibold text-card-foreground">{formattedFinalPrice}</p>
                    {hasDiscount && (
                        <>
                        <p className="text-lg text-muted-foreground line-through">{formattedProductPrice}</p>
                        <p className="bg-success/10 text-success text-sm p-1 rounded-lg">-{product.discountPercentage}%</p>
                        </>
                    )}
                </div>
            </Link>
            <div className="flex flex-col gap-2">
                {inStock ? (
                    cartItem ? (
                        <div className="bg-success text-success-foreground h-9 px-4 py-2 text-sm flex gap-2 justify-center items-center rounded-md">
                            <FaCheck /> In your cart
                        </div>
                    ) : (
                        <Button
                            variant={"primary"}
                            onClick={handleAddItemToCart}
                        >
                            <BsCartPlusFill /> Add to cart
                        </Button>
                    )
                ) : (
                    // placeholder to maintain button height alignment
                    <div className="h-9"></div>
                )}
                <Button
                    variant={"destructiveOutline"}
                    onClick={handleRemoveItem}
                >
                    <FiTrash2 /> Remove
                </Button>
            </div>
        </div>
    )
}

export default WishlistItemCard