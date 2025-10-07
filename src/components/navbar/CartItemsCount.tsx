"use client"

import { selectLocalCart } from "@/redux/features/localCartSlice"
import { useGetUserCartQuery } from "@/redux/features/userCartApi"
import { useGetUserSessionQuery } from "@/redux/features/userSessionApi"
import { useAppSelector } from "@/redux/hooks"
import { UserSession } from "@/types/user"
import { useEffect, useState } from "react"

const CartItemsCount = () => {

    const { data: session, isLoading } = useGetUserSessionQuery({})

    if (isLoading) return null

    return session ? <UserCartItemsCount session={session} /> : <LocalCartItemsCount />
}

const UserCartItemsCount = ({ session }: { session: UserSession }) => {
    const { data: cart, isLoading } = useGetUserCartQuery(session.userId)

    if (isLoading) return null

    return (
        <span className="absolute w-6 h-6 element-center -top-2 -left-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {cart?.items.length}
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