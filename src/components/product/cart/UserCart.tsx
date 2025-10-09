"use client"

import { useAddItemToUserCartMutation, useGetUserCartQuery, useRemoveItemFromUserCartMutation, ApiErrorResponse } from "@/redux/features/userCartApi"
import { ProductWithRelations } from "@/types/products"
import { InYourCart } from "./InYourCart"
import UpdateCartItem from "./UpdateCartItem"
import AddToCart from "./AddToCart"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface Props {
    userId: string
    product: ProductWithRelations
    initialLimit: number
}

const UserCart = ({ userId, product, initialLimit }: Props) => {

    const { data: cart, isLoading } = useGetUserCartQuery(userId)

    const [limit, setLimit] = useState<number>(initialLimit)

    const [ addItemToUserCart, {
        isSuccess: isItemAdded,
        data: addItemResponse,
        isError: isAddingItemFailed,
        error: addItemError

    } ] = useAddItemToUserCartMutation()

    const [ removeItemFromUserCart, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserCartMutation()

    useEffect(() => {

        // check if the product stock or limit changed in the database so we make this page up to date
        if (isItemAdded && addItemResponse.modified) {
            toast.success(addItemResponse.modified)
            if (addItemResponse.limit) {
                setLimit(Number(addItemResponse.limit))
            }
        }

    }, [isItemAdded])
    
    useEffect(() => {

        const typedAddItemError = addItemError as ApiErrorResponse

        if (isAddingItemFailed && typedAddItemError.errorMessage) {

            toast.error(typedAddItemError.errorMessage)
        }
    }, [isAddingItemFailed])

    useEffect(() => {

        const typedRemoveItemError = removeItemError as ApiErrorResponse

        if (isRemovingItemFailed && typedRemoveItemError.errorMessage) {
            toast.error(typedRemoveItemError.errorMessage)
        }
    }, [isRemovingItemFailed])

    if (isLoading) return null

    const existingProduct = cart?.items.find(item => item.productId === product.id)

    const addItemToCart = (quantity: number) => {
        addItemToUserCart({
            product,
            quantity,
            userId
        })
    }

    const removeItemFromCart = () => {
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