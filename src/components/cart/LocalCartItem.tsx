"use client"

import { CartItemWithProduct } from "@/types/cart"
import Image from "next/image"
import { useState } from "react"
import toast from "react-hot-toast"
import CartItemInfo from "./CartItemInfo"
import CartItemQuantityCounter from "./CartItemQuantityCounter"
import { Button } from "../ui/Button"
import { FiHeart, FiTrash2 } from "react-icons/fi"
import { useAppDispatch } from "@/redux/hooks"
import { addItemToLocalCart } from "@/redux/features/localCartSlice"
import { QuantityModifiedItem } from "@/redux/features/userCartApi"


interface Props {
    item: CartItemWithProduct
    removeItem: (productId: string) => void
    moveItemToWishlist: () => void
    quantityModified: QuantityModifiedItem | undefined
    triggerRefresh: () => void
}

const LocalCartItem = ({ item, removeItem, moveItemToWishlist, quantityModified, triggerRefresh }: Props) => {

    const [limit, setLimit] = useState((item.product.limit && item.product.limit <= item.product.stock) ? item.product.limit : item.product.stock)
    const dispatch = useAppDispatch()

    const updateQuantity = (quantity: number) => {

        // to stringify non-serializable data types like Date
        const serializableProduct = JSON.parse(JSON.stringify(item.product))

        dispatch(addItemToLocalCart({
            id: crypto.randomUUID(),
            cartId: "local",
            product: serializableProduct,
            productId: item.product.id,
            quantity,
            createdAt: JSON.parse(JSON.stringify(new Date())),
            updatedAt: JSON.parse(JSON.stringify(new Date()))
        }))

        fetch(`/api/product/${item.productId}/limit`)
            .then(res => res.json())
            .then((productLimit: number | undefined) => {
                if (productLimit && productLimit !== limit) {

                    setLimit(productLimit)

                    if (quantity > productLimit) {

                        toast.error(`Only ${productLimit} items are available`)

                        dispatch(addItemToLocalCart({
                            id: crypto.randomUUID(),
                            cartId: "local",
                            product: serializableProduct,
                            productId: item.product.id,
                            quantity: quantity > productLimit ? productLimit : quantity,
                            createdAt: JSON.parse(JSON.stringify(new Date())),
                            updatedAt: JSON.parse(JSON.stringify(new Date()))
                        }))
                    }
                }
            })
            .finally(() => triggerRefresh())
    }

    const handleRemoveItem = () => {
        removeItem(item.productId)
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
                <div className="flex gap-2 flex-wrap justify-between min-h-10 mt-5">
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