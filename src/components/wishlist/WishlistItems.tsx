"use client"

import { useGetUserWishlistQuery, useRemoveItemFromUserWishlistMutation, UserWishlistResponse } from "@/redux/features/userWishlistApi"
import WishlistItemCard from "./WishlistItemCard"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { ApiErrorResponse, useAddItemToUserCartMutation } from "@/redux/features/userCartApi"
import { WishlistItem } from "@/types/wishlist"

interface Props {
    userId: string
}

const WishlistItems = ({ userId }: Props) => {

    const { data: wishlist, isLoading } = useGetUserWishlistQuery(userId)

    const [ removeItemFromUserWishlist, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserWishlistMutation()

    const [ addItemToUserCart, {
        isError: isAddingItemToCartFailed,
        error: addItemToCartError

    } ] = useAddItemToUserCartMutation()


    useEffect(() => {

        const typedRemoveItemError = removeItemError as UserWishlistResponse

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }

    }, [isRemovingItemFailed])

    useEffect(() => {

        const typedAddItemToCartError = addItemToCartError as ApiErrorResponse

        if (isAddingItemToCartFailed && typedAddItemToCartError.errorMessage) {

            toast.error(typedAddItemToCartError.errorMessage)
        }
    }, [isAddingItemToCartFailed])

    if (isLoading) return null

    if (!wishlist || wishlist.items.length === 0) return null

    const removeItem = (productId: string) => {
        removeItemFromUserWishlist({ userId, productId })
    }

    const addItemToCart = (product: WishlistItem["product"]) => {
        addItemToUserCart({
            product,
            quantity: 1,
            userId
        })
    }

    return (
        <>
        <p className="text-muted-foreground mb-3">{wishlist.items.length} items saved</p>
        <div className="flex flex-wrap justify-center gap-5">
            {wishlist.items.map(item => (
                <WishlistItemCard key={item.id} product={item.product} removeItem={removeItem} addItemToCart={addItemToCart} />
            ))}
        </div>
        </>
    )
}

export default WishlistItems