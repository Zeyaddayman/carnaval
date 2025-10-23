"use client"

import { ApiErrorResponse, useGetUserCartQuery, useRemoveItemFromUserCartMutation } from "@/redux/features/userCartApi"
import UserCartItem from "./UserCartItem"
import CartOrderSummary from "./CartOrderSummary"
import toast from "react-hot-toast"
import { useEffect } from "react"

interface Props {
    userId: string
}

const UserCart = ({ userId }: Props) => {

    const { data: cart, isLoading } = useGetUserCartQuery(userId)

    const [ removeItemFromUserCart, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserCartMutation()

    useEffect(() => {

        const typedRemoveItemError = removeItemError as ApiErrorResponse

        if (isRemovingItemFailed && typedRemoveItemError.errorMessage) {
            toast.error(typedRemoveItemError.errorMessage)
        }

    }, [isRemovingItemFailed])

    const removeItem = (productId: string) => {
        removeItemFromUserCart({
            productId,
            userId
        })
    }

    if (isLoading) return null

    if (!cart || cart.items.length === 0) return null

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 space-y-3">
                {cart?.items.map(item => (
                    <UserCartItem
                        key={item.id}
                        item={item}
                        userId={userId}
                        removeItem={removeItem}
                    />
                ))}
            </div>
            <CartOrderSummary cartItems={cart.items} />
        </div>
    )
}

export default UserCart