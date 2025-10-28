"use client"

import { useGetUserWishlistQuery, useRemoveItemFromUserWishlistMutation, UserWishlistResponse } from "@/redux/features/userWishlistApi"
import WishlistItemCard from "./WishlistItemCard"
import { useEffect } from "react"
import toast from "react-hot-toast"

interface Props {
    userId: string
}

const WishlistItems = ({ userId }: Props) => {

    const { data: wishlist, isLoading } = useGetUserWishlistQuery(userId)

    const [ removeItemFromUserWishlist, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserWishlistMutation()

    useEffect(() => {

        const typedRemoveItemError = removeItemError as UserWishlistResponse

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }

    }, [isRemovingItemFailed])

    const removeItem = (productId: string) => {
        removeItemFromUserWishlist({ userId, productId })
    }

    if (isLoading) return null

    if (!wishlist || wishlist.items.length === 0) return null

    return (
        <>
        <p className="text-muted-foreground mb-3">{wishlist.items.length} items saved</p>
        <div className="flex flex-wrap justify-center gap-5">
            {wishlist.items.map(item => (
                <WishlistItemCard key={item.id} product={item.product} removeItem={removeItem} />
            ))}
        </div>
        </>
    )
}

export default WishlistItems