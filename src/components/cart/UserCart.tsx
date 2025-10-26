"use client"

import { ApiErrorResponse, useGetUserCartQuery, useRemoveItemFromUserCartMutation } from "@/redux/features/userCartApi"
import UserCartItem from "./UserCartItem"
import CartOrderSummary from "./CartOrderSummary"
import toast from "react-hot-toast"
import { useEffect } from "react"
import { useAddItemToUserWishlistMutation, UserWishlistResponse } from "@/redux/features/userWishlistApi"
import { ProductWithRelations } from "@/types/products"

interface Props {
    userId: string
}

const UserCart = ({ userId }: Props) => {

    const { data: cart, isLoading } = useGetUserCartQuery(userId)

    const [ removeItemFromUserCart, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserCartMutation()

    const [ addItemToUserWishlist, { isError: isAddingItemToWishlistFailed, error: addItemToWishlistError } ] = useAddItemToUserWishlistMutation()

    useEffect(() => {

        const typedRemoveItemError = removeItemError as ApiErrorResponse

        if (isRemovingItemFailed && typedRemoveItemError.errorMessage) {
            toast.error(typedRemoveItemError.errorMessage)
        }

    }, [isRemovingItemFailed])

    useEffect(() => {

        const typedAddItemToWishlistError = addItemToWishlistError as UserWishlistResponse

        if (isAddingItemToWishlistFailed && typedAddItemToWishlistError.message) {
            toast.error(typedAddItemToWishlistError.message)
        }

    }, [isAddingItemToWishlistFailed])


    const removeItem = (productId: string) => {
        removeItemFromUserCart({
            productId,
            userId
        })
    }

    const moveItemToWishlist = (product: ProductWithRelations) => {
        removeItemFromUserCart({
            productId: product.id,
            userId
        })

        addItemToUserWishlist({
            product,
            userId
        })
    }


    if (isLoading) return null

    if (!cart || cart.items.length === 0) return null

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