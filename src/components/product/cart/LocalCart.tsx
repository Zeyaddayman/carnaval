"use client"

import { removeItemFromLocalCart, selectLocalCart } from "@/redux/features/localCartSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ProductDetails } from "@/types/products"
import AddToCart from "./AddToCart"
import UpdateCartItem from "./UpdateCartItem"
import { InYourCart } from "./InYourCart"
import { useEffect, useState } from "react"
import useAddItemToLocalCart from "@/hooks/cart/local-cart/useAddItemToLocalCart"

interface Props {
    product: ProductDetails
    initialLimit: number
}

const ProductLocalCart = ({ product, initialLimit }: Props) => {

    const [isMounted, setIsMounted] = useState(false)

    const [limit, setLimit] = useState(initialLimit)

    const localCart = useAppSelector(selectLocalCart)
    const dispatch = useAppDispatch()

    const { addItemWithLimitCheck, freshLimit } = useAddItemToLocalCart()

    useEffect(() => {
        if (!isMounted) setIsMounted(true)
    }, [])

    // Sync limit with latest database value
    useEffect(() => {
        if (freshLimit) setLimit(freshLimit)
    }, [freshLimit])


    if (!isMounted) return null

    const existingProduct = localCart.items.find(item => item.product.id === product.id)

    const addItem = (quantity: number) => {
        addItemWithLimitCheck(product, quantity, limit)
    }

    const removeItem = () => {
        dispatch(removeItemFromLocalCart(product.id))
    }

    return (
        <>
        {existingProduct ? (
            <div className="space-y-6">
                <InYourCart
                    quantity={existingProduct.quantity}
                />
                <UpdateCartItem
                    limit={limit}
                    initialQuantity={existingProduct.quantity}
                    updateItem={addItem}
                    removeItem={removeItem}
                />
            </div>
        ): (
            <AddToCart
                limit={limit}
                addItem={addItem}
            />
        )}
        </>
    )
}

export default ProductLocalCart