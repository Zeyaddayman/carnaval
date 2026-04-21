"use client"

import { useGetUserWishlistQuery } from "@/redux/features/userWishlistApi"
import WishlistItemCard from "./WishlistItemCard"
import { wishlistItemWithProduct } from "@/types/wishlist"
import WishlistItemsSkeleton from "../skeletons/WishlistItemsSkeleton"
import EmptyWishlist from "./EmptyWishlist"
import useAddItemToUserCart from "@/hooks/cart/user-cart/useAddItemToUserCart"
import useRemoveItemFromUserWishlist from "@/hooks/wishlist/useRemoveItemFromUserWishlist"
import { Translation } from "@/types/translation"
import { inject } from "@/utils/translation"
import { Language } from "@/types/i18n"

interface Props {
    userId: string
    lang: Language
    translation: Translation
}

const WishlistItems = ({ userId, lang, translation }: Props) => {

    const { data: wishlist, isLoading } = useGetUserWishlistQuery(userId)

    const { removeItemFromUserWishlist } = useRemoveItemFromUserWishlist()

    const { addItemToUserCart } = useAddItemToUserCart()


    if (isLoading) return <WishlistItemsSkeleton />

    if (!wishlist || wishlist.items.length === 0) return <EmptyWishlist lang={lang} translation={translation.wishlist.emptyWishlist} />

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
        <p className="text-muted-foreground mb-3">
            {inject(translation.wishlist.itemsSaved, { count: wishlist.items.length })}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {wishlist.items.map(item => (
                <WishlistItemCard
                    key={item.product.id}
                    product={item.product}
                    userId={userId}
                    removeItem={removeItem}
                    addItemToCart={addItemToCart}
                    lang={lang}
                    translation={translation.global}
                />
            ))}
        </div>
        </>
    )
}

export default WishlistItems