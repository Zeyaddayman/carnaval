"use client"

import { CartErrorResponse, useGetUserCartQuery, useRemoveItemFromUserCartMutation } from "@/redux/features/userCartApi"
import UserCartItem from "./UserCartItem"
import CartOrderSummary from "./CartOrderSummary"
import toast from "react-hot-toast"
import { useEffect } from "react"
import { useAddItemToUserWishlistMutation, WishlistErrorResponse } from "@/redux/features/userWishlistApi"
import { CartItemWithProduct } from "@/types/cart"

interface Props {
    userId: string
}

const UserCart = ({ userId }: Props) => {

    const { data: cart, isLoading } = useGetUserCartQuery(userId)

    const [ removeItemFromUserCart, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserCartMutation()

    const [ addItemToUserWishlist, { isError: isAddingItemToWishlistFailed, error: addItemToWishlistError } ] = useAddItemToUserWishlistMutation()

    useEffect(() => {

        const typedRemoveItemError = removeItemError as CartErrorResponse

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }

    }, [isRemovingItemFailed])

    useEffect(() => {

        const typedAddItemToWishlistError = addItemToWishlistError as WishlistErrorResponse

        if (isAddingItemToWishlistFailed && typedAddItemToWishlistError.message) {
            toast.error(typedAddItemToWishlistError.message)
        }

    }, [isAddingItemToWishlistFailed])


    if (isLoading) return null

    if (!cart || cart.items.length === 0) return null

    const removeItem = (productId: string) => {
        removeItemFromUserCart({
            productId,
            userId
        })
    }

    const moveItemToWishlist = (product: CartItemWithProduct["product"]) => {
        removeItemFromUserCart({
            productId: product.id,
            userId
        })

        addItemToUserWishlist({
            product,
            userId
        })
    }

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 space-y-3">
                {cart?.items.map(item => (
                    <UserCartItem
                        key={item.id}
                        item={item}
                        userId={userId}
                        removeItem={removeItem}
                        moveItemToWishlist={moveItemToWishlist}
                    />
                ))}
            </div>
            <CartOrderSummary cartItems={cart.items} />
        </div>
    )
}

export default UserCart