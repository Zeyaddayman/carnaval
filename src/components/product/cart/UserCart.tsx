"use client"

import { useAddItemToUserCartMutation, useGetUserCartQuery, useRemoveItemFromUserCartMutation, useUpdateItemQtyInUserCartMutation } from "@/redux/features/userCartApi"
import { ProductWithRelations } from "@/types/products"
import { InYourCart } from "./InYourCart"
import UpdateCartItem from "./UpdateCartItem"
import AddToCart from "./AddToCart"

interface Props {
    userId: string
    product: ProductWithRelations
}

const UserCart = ({ userId, product }: Props) => {

    const { data: cart, isLoading } = useGetUserCartQuery(userId)

    const [ addItemToUserCart ] = useAddItemToUserCartMutation()
    const [ updateItemQtyInUserCart ] = useUpdateItemQtyInUserCartMutation()
    const [ removeItemFromUserCart ] = useRemoveItemFromUserCartMutation()

    if (isLoading || !cart) return null

    const existingProduct = cart?.items.find(item => item.productId === product.id)

    const limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    const addItemToCart = (quantity: number) => {
        addItemToUserCart({
            userId,
            cartItem: {
                cartId: cart.id,
                productId: product.id,
                quantity
            }
        })
    }

    const updateItemQty = (quantity: number) => {
        updateItemQtyInUserCart({
            userId,
            cartItem: {
                id: existingProduct?.id!,
                quantity
            }
        })
    }

    const removeItemFromCart = () => {
        removeItemFromUserCart({
            userId,
            cartItem: {
                id: existingProduct?.id!
            }
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

export default UserCart