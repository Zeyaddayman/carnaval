"use client"

import CartOrderSummary from "./CartOrderSummary"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { removeItemFromLocalCart, selectLocalCart } from "@/redux/features/localCartSlice"
import LocalCartItem from "./LocalCartItem"


const LocalCart = () => {

    const [isMounted, setIsMounted] = useState(false)

    const localCart = useAppSelector(selectLocalCart)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isMounted) setIsMounted(true)
    }, [])

    if (!isMounted) return null

    if (localCart.items.length === 0) return null

    const removeItem = (productId: string) => {
        dispatch(removeItemFromLocalCart(productId))
    }

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 space-y-3">
                {localCart.items.toReversed().map(item => (
                    <LocalCartItem
                        key={item.id}
                        item={item}
                        removeItem={removeItem}
                    />
                ))}
            </div>
            <CartOrderSummary cartItems={localCart.items} />
        </div>
    )
}

export default LocalCart