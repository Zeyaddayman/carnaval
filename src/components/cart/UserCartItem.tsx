"use client"

import { ApiErrorResponse, useAddItemToUserCartMutation } from "@/redux/features/userCartApi"
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
}

const UserCartItem = ({ item, userId, removeItem }: Props) => {

    const [limit, setLimit] = useState((item.product.limit && item.product.limit <= item.product.stock) ? item.product.limit : item.product.stock)

    const [ updateItemQuantityInUserCart, {
        isSuccess: isItemQuantityUpdated,
        data: updateItemResponse,
        isError: isUpdatingItemFailed,
        error: updateItemError

    } ] = useAddItemToUserCartMutation()

    useEffect(() => {

        // check if the product stock or limit changed in the database so we make this page up to date
        if (isItemQuantityUpdated && updateItemResponse.modified) {
            toast.success(updateItemResponse.modified)
            if (updateItemResponse.limit) {
                setLimit(Number(updateItemResponse.limit))
            }
        }

    }, [isItemQuantityUpdated])
    
    useEffect(() => {

        const typedUpdateItemError = updateItemError as ApiErrorResponse

        if (isUpdatingItemFailed && typedUpdateItemError.errorMessage) {

            toast.error(typedUpdateItemError.errorMessage)
        }
    }, [isUpdatingItemFailed])

    const updateQuantity = (quantity: number) => {
        updateItemQuantityInUserCart({
            product: item.product,
            quantity,
            userId
        })
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
                <div className="flex gap-2 flex-wrap justify-between min-h-10 my-5">
                    <CartItemQuantityCounter
                        initialQuantity={item.quantity}
                        limit={limit}
                        updateQuantity={updateQuantity}
                    />
                    <Button
                        variant={"destructiveOutline"}
                        onClick={() => removeItem(item.productId)}
                    >
                        <FiTrash2 /> Remove
                    </Button>
                </div>
                <Button
                    variant={"outline"}
                >
                    Move to Wishlist <FiHeart />
                </Button>
            </div>
        </div>
    )
}

export default UserCartItem