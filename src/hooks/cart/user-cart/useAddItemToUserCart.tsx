"use client"

import { useAddItemToUserCartMutation } from "@/redux/features/userCartApi"
import { CartError } from "@/redux/types/cart-response"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useAddItemToUserCart = () => {

    const [freshLimit, setFreshLimit] = useState<number | null>(null)

    const [ addItemToUserCart, {
        isSuccess: isItemAdded,
        data: addItemResponse,
        isError: isAddingItemFailed,
        error: addItemError

    } ] = useAddItemToUserCartMutation()

    useEffect(() => {

        if (isItemAdded) {

            setFreshLimit(addItemResponse.limit)

            if (addItemResponse.modifiedQuantity) {
                toast.success(`Only ${addItemResponse.modifiedQuantity} item(s) are available`)
            }
        }

    }, [isItemAdded])
    
    useEffect(() => {

        const typedAddItemError = addItemError as CartError

        if (isAddingItemFailed && typedAddItemError.message) {

            toast.error(typedAddItemError.message)
        }
    }, [isAddingItemFailed])

    return { addItemToUserCart, freshLimit }
}

export default useAddItemToUserCart