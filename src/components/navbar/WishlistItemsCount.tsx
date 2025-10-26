"use client"

import { useGetUserSessionQuery } from "@/redux/features/userSessionApi"
import { useGetUserWishlistQuery } from "@/redux/features/userWishlistApi"

const WishlistItemsCount = () => {

    const { data: session, isLoading } = useGetUserSessionQuery({})

    if (isLoading) return null

    return session ? <UserWishlistItemsCount userId={session.userId} /> : null
}

const UserWishlistItemsCount = ({ userId }: { userId: string }) => {

    const { data: wishlist, isLoading } = useGetUserWishlistQuery(userId)
    
    if (isLoading || wishlist?.items.length === 0) return null

    return (
        <span className="absolute w-6 h-6 element-center -top-2 -left-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {wishlist?.items.length}
        </span>
    )
}

export default WishlistItemsCount