"use client"

import { addItemToLocalCart } from "@/redux/features/localCartSlice"
import { useAppDispatch } from "@/redux/hooks"
import { fetchProductLimit } from "@/server/utils/product"
import { CartItemWithProduct } from "@/types/cart"
import { useState } from "react"
import toast from "react-hot-toast"


const useAddItemToLocalCart = () => {

    const [freshLimit, setFreshLimit] = useState<number | null>(null)

    const dispatch = useAppDispatch()

    const addItemWithLimitCheck = (product: CartItemWithProduct["product"], quantity: number, limit: number) => {

        const newCartItem: CartItemWithProduct = {
            id: crypto.randomUUID(),
            cartId: "local",
            product: product,
            quantity,
            createdAt: JSON.parse(JSON.stringify(new Date()))
        }

        dispatch(addItemToLocalCart(newCartItem))

        fetchProductLimit(product.id)
            .then(productLimit => {
                if (productLimit && productLimit !== limit) {

                    setFreshLimit(productLimit)

                    if (quantity > productLimit) {

                        toast.error(`Only ${productLimit} items are available`)

                        newCartItem.quantity = quantity > productLimit ? productLimit : quantity
    
                        dispatch(addItemToLocalCart(newCartItem))
                    }
                }
            })
    }

    return { addItemWithLimitCheck, freshLimit }
}

export default useAddItemToLocalCart