"use client"

import { addItemToLocalCart, removeItemFromLocalCart, selectLocalCart, updateItemQtyInLocalCart } from "@/redux/features/localCartSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ProductWithRelations } from "@/types/products"
import AddToCart from "./AddToCart"
import UpdateCartItem from "./UpdateCartItem"
import { InYourCart } from "./InYourCart"
import { useEffect, useState } from "react"

interface Props {
    product: ProductWithRelations
}

const LocalCart = ({ product }: Props) => {

    const localCart = useAppSelector(selectLocalCart)
    const dispatch = useAppDispatch()

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        if (!isMounted) setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const existingProduct = localCart.items.find(item => item.productId === product.id)

    const limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    const addItemToCart = (quantity: number) => {
        dispatch(addItemToLocalCart({
            id: crypto.randomUUID(),
            cartId: "local",
            product: product,
            productId: product.id,
            quantity
        }))
    }

    const updateItemQty = (quantity: number) => {
        dispatch(updateItemQtyInLocalCart({ id: product.id, quantity }))
    }

    const removeItemFromCart = () => {
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
                    updateItemQty={updateItemQty}
                    removeItemFromCart={removeItemFromCart}
                />
            </div>
        ): (
            <AddToCart
                limit={limit}
                addItemToCart={addItemToCart}
            />
        )}
        </>
    )
}

export default LocalCart