"use client"

import { useGetUserWishlistQuery } from "@/redux/features/userWishlistApi"
import WishlistItemCard from "./WishlistItemCard"
import { wishlistItemWithProduct } from "@/types/wishlist"
import WishlistItemsSkeleton from "../skeletons/WishlistItemsSkeleton"
import EmptyWishlist from "./EmptyWishlist"
import useAddItemToUserCart from "@/hooks/cart/user-cart/useAddItemToUserCart"
import useRemoveItemFromUserWishlist from "@/hooks/wishlist/useRemoveItemFromUserWishlist"

interface Props {
    userId: string
}

const WishlistItems = ({ userId }: Props) => {

    const { data: wishlist, isLoading } = useGetUserWishlistQuery(userId)

    const { removeItemFromUserWishlist } = useRemoveItemFromUserWishlist()

    const { addItemToUserCart } = useAddItemToUserCart()


    if (isLoading) return <WishlistItemsSkeleton />

    if (!wishlist || wishlist.items.length === 0) return <EmptyWishlist />

    const removeItem = (productId: string) => {
        removeItemFromUserWishlist({ userId, productId })
    }

    const addItemToCart = (product: wishlistItemWithProduct["product"]) => {
        addItemToUserCart({
            product,
            quantity: 1,
            userId
        })
    }

    return (
        <>
        <p className="text-muted-foreground mb-3">{wishlist.items.length} items saved</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {wishlist.items.map(item => (
                <WishlistItemCard
                    key={item.product.id}
                    product={item.product}
                    userId={userId}
                    removeItem={removeItem}
                    addItemToCart={addItemToCart}
                />
            ))}
        </div>
        </>
    )
}

export default WishlistItems