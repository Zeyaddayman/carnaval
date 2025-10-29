"use client"

import { useAddItemToUserWishlistMutation, useGetUserWishlistQuery, useRemoveItemFromUserWishlistMutation, WishlistErrorResponse } from "@/redux/features/userWishlistApi"
import { CardProduct } from "@/types/products"
import { UserSession } from "@/types/user"
import Link from "next/link"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { FaHeart } from "react-icons/fa"
import { buttonVariants } from "./Button"
import { usePathname } from "next/navigation"
import { WishlistItem } from "@/types/wishlist"

interface Props {
    session: UserSession | null,
    product: WishlistItem["product"]
}

const ToggleWishlistItem = ({ session, product }: Props) => {
    const pathname = usePathname()

    if (session) return <LoggedIn userId={session.userId} product={product} />

    const handleToggle = () => {
        toast(
            <div className="space-y-2">
                <p>You must be logged in</p>
                <Link
                    href={`/auth/login?redirect=${pathname}`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                    Login
                </Link>
            </div>
        )
    }

    return (
        <span onClick={handleToggle} className="group w-12 h-12 bg-white element-center rounded-full cursor-pointer">
            <FaHeart fill="transparent" strokeWidth={40} size={20} className="group-hover:fill-red-500 group-hover:stroke-red-500 transition-colors" />
        </span>
    )
}

const LoggedIn = ({ product, userId }: { userId: string, product: CardProduct }) => {

    const { data: wishlist } = useGetUserWishlistQuery(userId)

    const [ addItemToUserWishlist, { isError: isAddingItemFailed, error: addItemError } ] = useAddItemToUserWishlistMutation()

    const [ removeItemFromUserWishlist, { isError: isRemovingItemFailed, error: removeItemError } ] = useRemoveItemFromUserWishlistMutation()

    const productInWishlist = wishlist?.items.find(item => item.productId === product.id)

    useEffect(() => {

        const typedAddItemError = addItemError as WishlistErrorResponse

        if (isAddingItemFailed && typedAddItemError.message) {
            toast.error(typedAddItemError.message)
        }

    }, [isAddingItemFailed])


    useEffect(() => {

        const typedRemoveItemError = removeItemError as WishlistErrorResponse

        if (isRemovingItemFailed && typedRemoveItemError.message) {
            toast.error(typedRemoveItemError.message)
        }

    }, [isRemovingItemFailed])

    const handleToggle = () => {
        if (productInWishlist) {
            removeItemFromUserWishlist({
                productId: product.id,
                userId
            })
        } else {
            addItemToUserWishlist({
                product,
                userId
            })
        }
    }

    return (
        <span onClick={handleToggle} className="group w-12 h-12 bg-white element-center rounded-full cursor-pointer">
            <FaHeart fill="transparent" strokeWidth={40} size={20} className={`${productInWishlist ? "fill-red-500 stroke-red-500" : ""} group-hover:fill-red-500 group-hover:stroke-red-500 transition-colors`} />
        </span>
    )

}

export default ToggleWishlistItem