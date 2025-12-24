"use client"

import { useAddItemToUserWishlistMutation } from "@/redux/features/userWishlistApi"
import { WishlistError } from "@/redux/types/wishlist-response"
import { useEffect } from "react"
import toast from "react-hot-toast"

const useAddItemToUserWishlist = () => {

    const [
        addItemToUserWishlist,
        { isError: isAddingItemToWishlistFailed, error: addItemToWishlistError }

    ] = useAddItemToUserWishlistMutation()
    
    useEffect(() => {

        const typedAddItemToWishlistError = addItemToWishlistError as WishlistError

        if (isAddingItemToWishlistFailed && typedAddItemToWishlistError.message) {
            toast.error(typedAddItemToWishlistError.message)
        }

    }, [isAddingItemToWishlistFailed])

    return { addItemToUserWishlist }
}

export default useAddItemToUserWishlist