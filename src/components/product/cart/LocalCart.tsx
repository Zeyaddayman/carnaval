"use client"

import { addItemToLocalCart, removeItemFromLocalCart, selectLocalCart } from "@/redux/features/localCartSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ProductWithRelations } from "@/types/products"
import AddToCart from "./AddToCart"
import UpdateCartItem from "./UpdateCartItem"
import { InYourCart } from "./InYourCart"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface Props {
    product: ProductWithRelations
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

    const existingProduct = localCart.items.find(item => item.productId === product.id)

    const addItem = (quantity: number) => {

        const newCartItem = {
            id: crypto.randomUUID(),
            cartId: "local",
            product: product,
            productId: product.id,
            quantity,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        // to stringify non-serializable data types like Date
        const serializableCartItem = JSON.parse(JSON.stringify(newCartItem))

        dispatch(addItemToLocalCart(serializableCartItem))

        fetch(`/api/product/${product.id}/limit`)
            .then(res => res.json())
            .then((productLimit: number | undefined) => {
                if (productLimit && productLimit !== limit) {

                    setLimit(productLimit)

                    if (quantity > productLimit) {

                        toast.error(`Only ${productLimit} items are available`)

                        // to stringify non-serializable data types like Date
                        const serializableCartItem = JSON.parse(JSON.stringify({
                            ...newCartItem,
                            quantity: quantity > productLimit ? productLimit : quantity
                        }))
    
                        dispatch(addItemToLocalCart(serializableCartItem))
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