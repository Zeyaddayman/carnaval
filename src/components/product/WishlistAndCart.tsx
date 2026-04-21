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
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    product: ProductDetails
    lang: Language
    translation: Translation
}

const WishlistAndCart = ({ product, lang, translation }: Props) => {

    const { data: session, isFetching } = useGetUserSessionQuery()

    const [limit, setLimit] = useState<number | null>(null)

    useEffect(() => {

        fetchProductLimit(product.id)
            .then(productLimit => {

                if (productLimit !== null) setLimit(productLimit)

                else setLimit(0)
            })
            .catch(() => setLimit(0))

    }, [])

    if (isFetching || limit === null) return (
        <>
        <ProductToggleWishlistItemSkeleton />
        <ProductCartSkeleton />
        </>
    )

    return (
        <>
        <div className="bg-muted p-2 w-fit h-fit rounded-full ms-auto">
            <ToggleWishlistItem session={session || null} product={product} lang={lang} />
        </div>
        {limit > 0 ?
            session ? (
                <ProductUserCart
                    userId={session.userId}
                    product={product}
                    initialLimit={limit}
                    lang={lang}
                    translation={translation.product}
                />
            ) : (
                <ProductLocalCart
                    product={product}
                    initialLimit={limit}
                    lang={lang}
                    translation={translation.product}
                />
            )
            : <OutOfStock text={translation.global.outOfStock} />
        }
        </>
    )
}

export default WishlistAndCart