"use client"

import { useGetUserWishlistQuery } from "@/redux/features/userWishlistApi"
import WishlistItemCard from "./WishlistItemCard"

interface Props {
    userId: string
}

const WishlistItems = ({ userId }: Props) => {

    const { data: wishlist, isLoading } = useGetUserWishlistQuery(userId)

    if (isLoading) return null

    if (!wishlist || wishlist.items.length === 0) return null

    return (
        <>
        <p className="text-muted-foreground mb-3">{wishlist.items.length} items saved</p>
        <div className="flex flex-wrap justify-center gap-5">
            {wishlist.items.map(item => (
                <WishlistItemCard key={item.id} product={item.product} />
            ))}
        </div>
        </>
    )
}

export default WishlistItems