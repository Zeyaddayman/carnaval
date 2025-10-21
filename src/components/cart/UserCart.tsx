"use client"

import { useGetUserCartQuery } from "@/redux/features/userCartApi"
import CartItem from "./CartItem"
import CartOrderSummary from "./CartOrderSummary"

interface Props {
    userId: string
}

const UserCart = ({ userId }: Props) => {

    const { data: cart, isLoading } = useGetUserCartQuery(userId)

    if (isLoading) return null

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 space-y-3">
                {cart?.items.map(item => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>
            <CartOrderSummary />
        </div>
    )
}

export default UserCart