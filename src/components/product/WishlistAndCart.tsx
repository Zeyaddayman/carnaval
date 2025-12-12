"use client"

import { useEffect, useState } from "react"
import ToggleWishlistItem from "../ui/ToggleWishlistItem"
import ProductLocalCart from "./cart/LocalCart"
import ProductUserCart from "./cart/UserCart"
import OutOfStock from "./OutOfStock"
import { ProductDetails } from "@/types/products"
import { useGetUserSessionQuery } from "@/redux/features/userSessionApi"
import ProductCartSkeleton from "../skeletons/ProductCartSkeleton"
import ProductToggleWishlistItemSkeleton from "../skeletons/ProductToggleWishlistItemSkeleton"
import { fetchProductLimit } from "@/server/utils/product"

interface Props {
    product: ProductDetails
    initialLimit: number
}

const WishlistAndCart = ({ product, initialLimit }: Props) => {

    const { data: session, isFetching } = useGetUserSessionQuery()

    const [limit, setLimit] = useState<number | null>(null)

    useEffect(() => {

        fetchProductLimit(product.id)
            .then(productLimit => {
                if (productLimit) setLimit(productLimit)

                else setLimit(initialLimit)
            })
            .catch(() => setLimit(initialLimit))

    }, [])

    if (isFetching || !limit) return (
        <>
        <ProductToggleWishlistItemSkeleton />
        <ProductCartSkeleton />
        </>
    )

    return (
        <>
        <div className="bg-muted p-2 w-fit h-fit rounded-full ml-auto">
            <ToggleWishlistItem session={session || null} product={product} />
        </div>
        {limit > 0 ?
            session ? (
                <ProductUserCart
                    userId={session.userId}
                    product={product}
                    initialLimit={limit}
                />
            ) : (
                <ProductLocalCart product={product} initialLimit={limit} />
            )
            : <OutOfStock />
        }
        </>
    )
}

export default WishlistAndCart