"use client"

import { useGetUserWishlistQuery } from "@/redux/features/userWishlistApi"
import { CardProduct } from "@/types/products"
import { UserSession } from "@/types/user"
import Link from "next/link"
import toast from "react-hot-toast"
import { FaHeart } from "react-icons/fa"
import { buttonVariants } from "./Button"
import { usePathname } from "next/navigation"
import { wishlistItemWithProduct } from "@/types/wishlist"
import useAddItemToUserWishlist from "@/hooks/wishlist/useAddItemToUserWishlist"
import useRemoveItemFromUserWishlist from "@/hooks/wishlist/useRemoveItemFromUserWishlist"

interface Props {
    session: UserSession | null,
    product: wishlistItemWithProduct["product"]
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
                    onClick={() => toast.dismissAll()}
                >
                    Login
                </Link>
            </div>
        )
    }

    return (
        <button onClick={handleToggle} className="group w-12 h-12 bg-white element-center rounded-full cursor-pointer">
            <FaHeart fill="transparent" strokeWidth={40} size={20} className="group-hover:fill-red-500 group-hover:stroke-red-500 transition-colors" />
        </button>
    )
}

const LoggedIn = ({ product, userId }: { userId: string, product: CardProduct }) => {

    const { data: wishlist } = useGetUserWishlistQuery(userId)

    const { addItemToUserWishlist } = useAddItemToUserWishlist()

    const { removeItemFromUserWishlist } = useRemoveItemFromUserWishlist()


    const productInWishlist = wishlist?.items.find(item => item.product.id === product.id)

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
        <button onClick={handleToggle} className="group w-12 h-12 bg-white element-center rounded-full cursor-pointer">
            <FaHeart fill="transparent" strokeWidth={40} size={20} className={`${productInWishlist ? "fill-red-500 stroke-red-500" : ""} group-hover:fill-red-500 group-hover:stroke-red-500 transition-colors`} />
        </button>
    )

}

export default ToggleWishlistItem