"use client"

import { useAddItemToUserWishlistMutation, WishlistErrorResponse } from "@/redux/features/userWishlistApi"
import { useEffect } from "react"
import toast from "react-hot-toast"

const useAddItemToUserWishlist = () => {

    const [
        addItemToUserWishlist,
        { isError: isAddingItemToWishlistFailed, error: addItemToWishlistError }

    ] = useAddItemToUserWishlistMutation()
    
    useEffect(() => {

        const typedAddItemToWishlistError = addItemToWishlistError as WishlistErrorResponse

        if (isAddingItemToWishlistFailed && typedAddItemToWishlistError.message) {
            toast.error(typedAddItemToWishlistError.message)
        }

    }, [isAddingItemToWishlistFailed])

    return { addItemToUserWishlist }
}

export default useAddItemToUserWishlist