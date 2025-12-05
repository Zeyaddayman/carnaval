"use client"

import { useGetUserWishlistQuery, useRemoveItemFromUserWishlistMutation, WishlistErrorResponse } from "@/redux/features/userWishlistApi"
import WishlistItemCard from "./WishlistItemCard"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { CartErrorResponse, useAddItemToUserCartMutation } from "@/redux/features/userCartApi"
import { wishlistItemWithProduct } from "@/types/wishlist"
import WishlistItemsSkeleton from "../skeletons/WishlistItemsSkeleton"
import EmptyWishlist from "./EmptyWishlist"

interface Props {
    userId: string
}

const WishlistItems = ({ userId }: Props) => {

    const { data: wishlist, isLoading } = useGetUserWishlistQuery(userId)

    const [ removeItemFromUserWishlist, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserWishlistMutation()

    const [ addItemToUserCart, {
        isError: isAddingItemToCartFailed,
        error: addItemToCartError

    } ] = useAddItemToUserCartMutation()


    useEffect(() => {

        const typedRemoveItemError = removeItemError as WishlistErrorResponse

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }

    }, [isRemovingItemFailed])

    useEffect(() => {

        const typedAddItemToCartError = addItemToCartError as CartErrorResponse

        if (isAddingItemToCartFailed && typedAddItemToCartError.message) {

            toast.error(typedAddItemToCartError.message)
        }
    }, [isAddingItemToCartFailed])


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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {wishlist.items.map(item => (
                <WishlistItemCard
                    key={item.product.id}
                    product={item.product}
                    removeItem={removeItem}
                    addItemToCart={addItemToCart}
                />
            ))}
        </div>
        </>
    )
}

export default WishlistItems