"use client"

import { useRemoveItemFromUserWishlistMutation, WishlistErrorResponse } from "@/redux/features/userWishlistApi"
import { useEffect } from "react"
import toast from "react-hot-toast"

const useRemoveItemFromUserWishlist = () => {
    const [
        removeItemFromUserWishlist,
        { isError: isRemovingItemFailed, error: removeItemError }

    ] = useRemoveItemFromUserWishlistMutation()

    useEffect(() => {
    
        const typedRemoveItemError = removeItemError as WishlistErrorResponse

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }

    }, [isRemovingItemFailed])

    return { removeItemFromUserWishlist }
}

export default useRemoveItemFromUserWishlist