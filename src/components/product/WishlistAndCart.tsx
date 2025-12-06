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

interface Props {
    product: ProductDetails
    initialLimit: number
}

const WishlistAndCart = ({ product, initialLimit }: Props) => {

    const [limit, setLimit] = useState<number | null>(null)
    const { data: session, isFetching } = useGetUserSessionQuery({})

    useEffect(() => {

        const getProductLimit = async (): Promise<number> => {
            try {
                const res = await fetch(`/api/product/${product.id}/limit`)

                if (res.status === 200) {
                    const { productLimit } = await res.json()

                    return productLimit
                } else {
                    return initialLimit
                }
            }
            catch {
                return initialLimit
            }
        }

        getProductLimit().then(productLimit => setLimit(productLimit))

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
            <ToggleWishlistItem session={session} product={product} />
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