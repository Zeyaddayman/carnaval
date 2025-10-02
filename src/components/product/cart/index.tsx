"use client"

import { addItemToLocalCart, removeItemFromLocalCart, selectLocalCart, updateItemQtyInLocalCart } from "@/redux/features/localCartSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ProductWithRelations } from "@/types/products"
import AddToCart from "./AddToCart"
import { CartItem } from "@/types/cart"
import UpdateCartItem from "./UpdateCartItem"
import { InYourCart } from "./InYourCart"
import { useEffect, useState } from "react"

interface Props {
    product: ProductWithRelations
}

const Cart = ({ product }: Props) => {

    const localCart = useAppSelector(selectLocalCart)
    const dispatch = useAppDispatch()

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        if (!isMounted) setIsMounted(true)
    }, [])

    if (!isMounted) return null

    console.log(localCart.items)

    const existingProduct = localCart.items.find(item => item.id === product.id)

    const limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    const addItemToCart = (cartItem: CartItem) => {
        dispatch(addItemToLocalCart(cartItem))
    }

    const updateItemQty = (id: string, qty: number) => {
        dispatch(updateItemQtyInLocalCart({ id, qty }))
    }

    const removeItemFromCart = (id: string) => {
        dispatch(removeItemFromLocalCart(id))
    }

    return (
        <>
        {existingProduct ? (
            <div className="space-y-10">
                <InYourCart
                    quantity={existingProduct.qty}
                />
                <UpdateCartItem
                    productId={product.id}
                    limit={limit}
                    initialQuantity={existingProduct.qty}
                    updateItemQty={updateItemQty}
                    removeItemFromCart={removeItemFromCart}
                />
            </div>
        ): (
            <AddToCart
                product={product}
                limit={limit}
                addItemToCart={addItemToCart}
            />
        )}
        </>
    )
}

export default Cart