"use client"

import { selectLocalCart } from "@/redux/features/localCartSlice"
import { useGetUserCartQuery } from "@/redux/features/userCartApi"
import { useGetUserSessionQuery } from "@/redux/features/userSessionApi"
import { useAppSelector } from "@/redux/hooks"
import { useEffect, useState } from "react"

const CartItemsCount = () => {

    const { data: session, isLoading } = useGetUserSessionQuery({})

    if (isLoading) return null

    return session ? <UserCartItemsCount userId={session.userId} /> : <LocalCartItemsCount />
}

const UserCartItemsCount = ({ userId }: { userId: string }) => {
    const { data, isLoading } = useGetUserCartQuery(userId)

    if (isLoading) return null

    if (!data || data.cart.items.length === 0) return null

    return (
        <span className="absolute w-6 h-6 element-center -top-2 -left-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {data.cart.items.length}
        </span>
    )
}

const LocalCartItemsCount = () => {
    const { items } = useAppSelector(selectLocalCart)

    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        if (!isMounted) setIsMounted(true)
    }, [])

    if (!isMounted || items.length === 0) return null

    return (
        <span className="absolute w-6 h-6 element-center -top-2 -left-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {items.length}
        </span>
    )
}

export default CartItemsCount