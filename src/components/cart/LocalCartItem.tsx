"use client"

import { CartItemWithProduct } from "@/types/cart"
import Image from "next/image"
import { useEffect, useState } from "react"
import CartItemInfo from "./CartItemInfo"
import CartItemQuantityCounter from "./CartItemQuantityCounter"
import { Button } from "../ui/Button"
import { FiHeart, FiTrash2 } from "react-icons/fi"
import { QuantityModifiedItem } from "@/redux/features/userCartApi"
import useAddItemToLocalCart from "@/hooks/cart/local-cart/useAddItemToLocalCart"


interface Props {
    item: CartItemWithProduct
    initialLimit: number
    removeItem: (productId: string) => void
    moveItemToWishlist: () => void
    quantityModified: QuantityModifiedItem | undefined
}

const LocalCartItem = ({ item, initialLimit, removeItem, moveItemToWishlist, quantityModified }: Props) => {

    const [limit, setLimit] = useState(initialLimit)

    const { addItemWithLimitCheck: updateItemQtyWithLimitCheck, freshLimit } = useAddItemToLocalCart()

    useEffect(() => {
        setLimit(initialLimit)
    }, [initialLimit])

    // Sync limit with latest database value
    useEffect(() => {
        if (freshLimit) setLimit(freshLimit)
    }, [freshLimit])

    const updateQuantity = (quantity: number) => {
        updateItemQtyWithLimitCheck(item.product, quantity, limit)
    }

    const handleRemoveItem = () => {
        removeItem(item.product.id)
    }

    const handleMoveToWishlist = () => {
        moveItemToWishlist()
    }

    return (
        <div className="bg-card p-2 flex flex-col md:flex-row gap-3 border border-border rounded-md">
            <Image
                src={item.product.thumbnail}
                alt={item.product.title}
                className="self-center"
                width={150}
                height={150}
            />
            <div className="flex-1">
                <CartItemInfo product={item.product} quantity={item.quantity} />
                <div className="flex gap-2 flex-wrap justify-between mt-5">
                    <CartItemQuantityCounter
                        initialQuantity={item.quantity}
                        limit={limit}
                        updateQuantity={updateQuantity}
                    />
                    <Button
                        variant={"destructiveOutline"}
                        onClick={handleRemoveItem}
                    >
                        <FiTrash2 /> Remove
                    </Button>
                    {quantityModified && (
                        <p className="mt-2 text-sm p-1 bg-warning/10 text-warning w-fit rounded-md">
                            Quantity adjusted from {quantityModified.oldQuantity} → {quantityModified.newQuantity} due to stock limits
                        </p>
                    )}
                </div>
                <Button
                    variant={"outline"}
                    onClick={handleMoveToWishlist}
                    className="mt-5"
                >
                    Move to Wishlist <FiHeart />
                </Button>
            </div>
        </div>
    )
}

export default LocalCartItem