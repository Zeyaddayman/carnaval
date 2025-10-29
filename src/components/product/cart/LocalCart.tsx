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

    const addItemToCart = (quantity: number) => {

        // to stringify non-serializable data types like Date
        const serializableProduct = JSON.parse(JSON.stringify(product))

        dispatch(addItemToLocalCart({
            id: crypto.randomUUID(),
            cartId: "local",
            product: serializableProduct,
            productId: product.id,
            quantity,
            createdAt: JSON.parse(JSON.stringify(new Date())),
            updatedAt: JSON.parse(JSON.stringify(new Date()))
        }))

        fetch(`/api/product/${product.id}/limit`)
            .then(res => res.json())
            .then((productLimit: number | undefined) => {
                if (productLimit && productLimit !== limit) {

                    setLimit(productLimit)

                    if (quantity > productLimit) {

                        toast.error(`Only ${productLimit} items are available`)
    
                        dispatch(addItemToLocalCart({
                            id: crypto.randomUUID(),
                            cartId: "local",
                            product: serializableProduct,
                            productId: product.id,
                            quantity: quantity > productLimit ? productLimit : quantity,
                            createdAt: JSON.parse(JSON.stringify(new Date())),
                            updatedAt: JSON.parse(JSON.stringify(new Date()))
                        }))
                    }

                }
            })
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
                    addItemToCart={addItemToCart}
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

export default ProductLocalCart