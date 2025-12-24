"use client"

import { useRemoveItemFromUserWishlistMutation } from "@/redux/features/userWishlistApi"
import { WishlistError } from "@/redux/types/wishlist-response"
import { useEffect } from "react"
import toast from "react-hot-toast"

const useRemoveItemFromUserWishlist = () => {
    const [
        removeItemFromUserWishlist,
        { isError: isRemovingItemFailed, error: removeItemError }

    ] = useRemoveItemFromUserWishlistMutation()

    useEffect(() => {
    
        const typedRemoveItemError = removeItemError as WishlistError

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }

    }, [isRemovingItemFailed])

    return { removeItemFromUserWishlist }
}

export default useRemoveItemFromUserWishlist