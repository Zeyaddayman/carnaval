"use client"

import { useRemoveItemFromUserCartMutation } from "@/redux/features/userCartApi"
import { CartError } from "@/redux/types/cart-response"
import { useEffect } from "react"
import toast from "react-hot-toast"

const useRemoveItemFromUserCart = () => {

    const [
        removeItemFromUserCart,
        { isError: isRemovingItemFailed, error: removeItemError }

    ] = useRemoveItemFromUserCartMutation()

    useEffect(() => {

        const typedRemoveItemError = removeItemError as CartError

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }
    }, [isRemovingItemFailed])

    return { removeItemFromUserCart }
}

export default useRemoveItemFromUserCart