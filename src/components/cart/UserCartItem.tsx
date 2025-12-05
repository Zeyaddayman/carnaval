"use client"

import { CartErrorResponse, QuantityModifiedItem, useAddItemToUserCartMutation } from "@/redux/features/userCartApi"
import { CartItemWithProduct } from "@/types/cart"
import Image from "next/image"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CartItemInfo from "./CartItemInfo"
import CartItemQuantityCounter from "./CartItemQuantityCounter"
import { Button } from "../ui/Button"
import { FiHeart, FiTrash2 } from "react-icons/fi"


interface Props {
    item: CartItemWithProduct
    userId: string
    removeItem: (productId: string) => void
    moveItemToWishlist: (product: CartItemWithProduct["product"]) => void
    quantityModified: QuantityModifiedItem | undefined
}

const UserCartItem = ({ item, userId, removeItem, moveItemToWishlist, quantityModified }: Props) => {

    const [limit, setLimit] = useState((item.product.limit && item.product.limit <= item.product.stock) ? item.product.limit : item.product.stock)

    const [ updateItemQuantityInUserCart, {
        isSuccess: isItemQuantityUpdated,
        data: updateItemResponse,
        isError: isUpdatingItemFailed,
        error: updateItemError

    } ] = useAddItemToUserCartMutation()

    useEffect(() => {

        // make sure to update the limit when the server responds with a new limit
        if (isItemQuantityUpdated && updateItemResponse.limit) {
            setLimit(Number(updateItemResponse.limit))
        }

        if (isItemQuantityUpdated && updateItemResponse.modifiedQuantity) {
            toast.success(`Only ${updateItemResponse.modifiedQuantity} items are available`)
        }

    }, [isItemQuantityUpdated])

    useEffect(() => {

        const typedUpdateItemError = updateItemError as CartErrorResponse

        if (isUpdatingItemFailed && typedUpdateItemError.message) {

            toast.error(typedUpdateItemError.message)
        }
    }, [isUpdatingItemFailed])

    const updateQuantity = (quantity: number) => {
        updateItemQuantityInUserCart({
            product: item.product,
            quantity,
            userId
        })
    }

    const handleRemoveItem = () => {
        removeItem(item.product.id)
    }

    const handleMoveToWishlist = () => {
        moveItemToWishlist(item.product)
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
                </div>
                {quantityModified && (
                    <p className="mt-2 text-sm p-1 bg-warning/10 text-warning w-fit rounded-md">
                        Quantity adjusted from {quantityModified.oldQuantity} → {quantityModified.newQuantity} due to stock limits
                    </p>
                )}
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

export default UserCartItem