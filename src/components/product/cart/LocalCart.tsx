"use client"

import { addItemToLocalCart, removeItemFromLocalCart, selectLocalCart } from "@/redux/features/localCartSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ProductDetails } from "@/types/products"
import AddToCart from "./AddToCart"
import UpdateCartItem from "./UpdateCartItem"
import { InYourCart } from "./InYourCart"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { CartItemWithProduct } from "@/types/cart"

interface Props {
    product: ProductDetails
    initialLimit: number
}

const ProductLocalCart = ({ product, initialLimit }: Props) => {

    const [isMounted, setIsMounted] = useState(false)

    const localCart = useAppSelector(selectLocalCart)
    const dispatch = useAppDispatch()

    const [limit, setLimit] = useState(initialLimit)

    useEffect(() => {
        if (!isMounted) setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const existingProduct = localCart.items.find(item => item.product.id === product.id)

    const addItem = (quantity: number) => {

        const newCartItem: CartItemWithProduct = {
            id: crypto.randomUUID(),
            cartId: "local",
            product: product,
            quantity,
            createdAt: JSON.parse(JSON.stringify(new Date()))
        }

        dispatch(addItemToLocalCart(newCartItem))

        fetch(`/api/product/${product.id}/limit`)
            .then(res => res.json())
            .then(({ productLimit }: { productLimit: number | undefined }) => {
                if (productLimit && productLimit !== limit) {

                    setLimit(productLimit)

                    if (quantity > productLimit) {

                        toast.error(`Only ${productLimit} items are available`)

                        newCartItem.quantity = quantity > productLimit ? productLimit : quantity
    
                        dispatch(addItemToLocalCart(newCartItem))
                    }

                }
            })
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