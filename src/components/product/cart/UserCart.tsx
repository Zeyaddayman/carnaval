"use client"

import { CartErrorResponse, useAddItemToUserCartMutation, useGetUserCartQuery, useRemoveItemFromUserCartMutation } from "@/redux/features/userCartApi"
import { ProductWithRelations } from "@/types/products"
import { InYourCart } from "./InYourCart"
import UpdateCartItem from "./UpdateCartItem"
import AddToCart from "./AddToCart"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ProductCartSkeleton from "@/components/skeletons/ProductCartSkeleton"

interface Props {
    userId: string
    product: ProductWithRelations
    initialLimit: number
}

const ProductUserCart = ({ userId, product, initialLimit }: Props) => {

    const { data, isLoading } = useGetUserCartQuery(userId)

    const [limit, setLimit] = useState<number>(initialLimit)

    const [ addItemToUserCart, {
        isSuccess: isItemAdded,
        data: addItemResponse,
        isError: isAddingItemFailed,
        error: addItemError

    } ] = useAddItemToUserCartMutation()

    const [ removeItemFromUserCart, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserCartMutation()

    useEffect(() => {

        // make sure to update the limit when the server responds with a new limit
        if (isItemAdded && addItemResponse.limit) {
            setLimit(Number(addItemResponse.limit))
        }

        if (isItemAdded && addItemResponse.modifiedQuantity) {
            toast.success(`Only ${addItemResponse.modifiedQuantity} items are available`)
        }

    }, [isItemAdded])
    
    useEffect(() => {

        const typedAddItemError = addItemError as CartErrorResponse

        if (isAddingItemFailed && typedAddItemError.message) {

            toast.error(typedAddItemError.message)
        }
    }, [isAddingItemFailed])

    useEffect(() => {

        const typedRemoveItemError = removeItemError as CartErrorResponse

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }
    }, [isRemovingItemFailed])


    if (isLoading) return <ProductCartSkeleton />

    const existingProduct = data?.cart.items.find(item => item.productId === product.id)

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