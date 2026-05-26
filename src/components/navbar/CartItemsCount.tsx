"use client"

import { Language } from "@/generated/prisma"
import { hydrateCartItems, selectLocalCart } from "@/redux/features/localCartSlice"
import { useGetUserCartQuery } from "@/redux/features/userCartApi"
import { useGetUserSessionQuery } from "@/redux/features/userSessionApi"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useEffect, useState } from "react"

interface Props {
    lang: Language
}

const CartItemsCount = ({ lang }: Props) => {

    const { data: session, isLoading } = useGetUserSessionQuery()

    if (isLoading) return null

    return session ? <UserCartItemsCount userId={session.userId} /> : <LocalCartItemsCount lang={lang} />
}

const UserCartItemsCount = ({ userId }: { userId: string }) => {
    const { data, isLoading } = useGetUserCartQuery(userId)

    if (isLoading) return null

    if (!data || data.cart.items.length === 0) return null

    return (
        <span className="absolute w-6 h-6 element-center -top-2 -start-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {data.cart.items.length}
        </span>
    )
}

const LocalCartItemsCount = ({ lang }: { lang: Language }) => {
    const { items } = useAppSelector(selectLocalCart)

    const [isMounted, setIsMounted] = useState(false)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isMounted) setIsMounted(true)
        dispatch(hydrateCartItems())
    }, [lang])

    if (!isMounted || items.length === 0) return null

    return (
        <span className="absolute w-6 h-6 element-center -top-2 -start-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {items.length}
        </span>
    )
}

export default CartItemsCount