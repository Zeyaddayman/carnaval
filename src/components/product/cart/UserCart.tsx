"use client"

import { useGetUserCartQuery } from "@/redux/features/userCartApi"
import { ProductDetails } from "@/types/products"
import { InYourCart } from "./InYourCart"
import UpdateCartItem from "./UpdateCartItem"
import AddToCart from "./AddToCart"
import { useEffect, useState } from "react"
import ProductCartSkeleton from "@/components/skeletons/ProductCartSkeleton"
import useAddItemToUserCart from "@/hooks/cart/user-cart/useAddItemToUserCart"
import useRemoveItemFromUserCart from "@/hooks/cart/user-cart/useRemoveItemFromUserCart"

interface Props {
    userId: string
    product: ProductDetails
    initialLimit: number
}

const ProductUserCart = ({ userId, product, initialLimit }: Props) => {

    const { data, isLoading } = useGetUserCartQuery(userId)

    const [limit, setLimit] = useState<number>(initialLimit)

    const { addItemToUserCart, freshLimit } = useAddItemToUserCart()

    // Sync limit with latest database value
    useEffect(() => {
        if (freshLimit) setLimit(freshLimit)
    }, [freshLimit])

    const { removeItemFromUserCart } = useRemoveItemFromUserCart()


    if (isLoading) return <ProductCartSkeleton />

    const existingProduct = data?.cart.items.find(item => item.product.id === product.id)

    const addItem = (quantity: number) => {
        addItemToUserCart({
            product,
            quantity,
            userId
        })
    }

    const removeItem = () => {
        removeItemFromUserCart({
            productId: product.id,
            userId
        })
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

export default ProductUserCart