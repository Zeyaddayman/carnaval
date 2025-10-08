"use client"

import { useAddItemToUserCartMutation, useGetUserCartQuery, useRemoveItemFromUserCartMutation } from "@/redux/features/userCartApi"
import { ProductWithRelations } from "@/types/products"
import { InYourCart } from "./InYourCart"
import UpdateCartItem from "./UpdateCartItem"
import AddToCart from "./AddToCart"

interface Props {
    product: ProductWithRelations
}

const UserCart = ({ product }: Props) => {

    const { data: cart, isLoading } = useGetUserCartQuery()

    const [ addItemToUserCart ] = useAddItemToUserCartMutation()
    const [ removeItemFromUserCart ] = useRemoveItemFromUserCartMutation()

    if (isLoading) return null

    const existingProduct = cart?.items.find(item => item.productId === product.id)

    const limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    const addItemToCart = (quantity: number) => {
        addItemToUserCart({
            productId: product.id,
            quantity
        })
    }

    const removeItemFromCart = () => {
        removeItemFromUserCart(product.id)
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

export default UserCart