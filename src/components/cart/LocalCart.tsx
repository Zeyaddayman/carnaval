"use client"

import CartOrderSummary from "./CartOrderSummary"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { removeItemFromLocalCart, selectLocalCart, setLocalCartItems } from "@/redux/features/localCartSlice"
import LocalCartItem from "./LocalCartItem"
import UnavailableCartItem from "./UnavailableCartItem"
import toast from "react-hot-toast"
import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import CartSkeleton from "../skeletons/CartSkeleton"
import EmptyCart from "./EmptyCart"
import useGetFreshLocalCartItems from "@/hooks/cart/local-cart/useGetFreshLocalCartItems"
import { getProductLimit } from "@/utils/product"
import CartHasUnavailableItemsMsg from "./CartHasUnavailableItemsMsg"
import CartHasModifiedQuantityItemsMsg from "./CartHasModifiedQuantityItemsMsg"

const LocalCart = () => {

    const [isMounted, setIsMounted] = useState(false)

    const localCart = useAppSelector(selectLocalCart)

    const { freshLocalCartItems, quantityModifiedItems } = useGetFreshLocalCartItems(localCart.items)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isMounted) setIsMounted(true)
    }, [])

    // Update local cart items with fresh data from server
    useEffect(() => {
        if (freshLocalCartItems) {
            dispatch(setLocalCartItems(freshLocalCartItems))
        }
    }, [freshLocalCartItems])

    if (!isMounted) return <CartSkeleton />

    if (localCart.items.length === 0) return <EmptyCart />

    const removeItem = (productId: string) => {
        dispatch(removeItemFromLocalCart(productId))
    }

    const moveItemToWishlist = () => {
        toast(
            <div className="space-y-2">
                <p>You must be logged in</p>
                <Link
                    href={`/auth/login?redirect=/cart`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                    onClick={() => toast.dismissAll()}
                >
                    Login
                </Link>
            </div>
        )
    }

    const availableItems = localCart.items.filter(item => item.product.stock > 0)
    const unAvailableItems = localCart.items.filter(item => item.product.stock < 1)

    const hasUnavailableItems = unAvailableItems.length > 0
    const hasModifiedQuantityItems = Object.keys(quantityModifiedItems).length > 0

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1">
                {hasUnavailableItems && <CartHasUnavailableItemsMsg />}

                {hasModifiedQuantityItems && <CartHasModifiedQuantityItemsMsg />}

                <div className="space-y-3">
                    {availableItems.toReversed().map(item => (
                        <LocalCartItem
                            key={item.id}
                            item={item}
                            initialLimit={getProductLimit(item.product.stock, item.product.limit)}
                            removeItem={removeItem}
                            moveItemToWishlist={moveItemToWishlist}
                            quantityModified={quantityModifiedItems[item.id]}
                        />
                    ))}
                </div>
                {hasUnavailableItems && (
                    <div className="mt-10">
                        <h5 className="flex items-center gap-2 text-destructive font-semibold text-xl mb-4">
                            Unavailable Items <div className="flex-1 h-[2px] bg-destructive"></div>
                        </h5>
                        <div className="space-y-3">
                            {unAvailableItems.map(item => (
                                <UnavailableCartItem
                                    key={item.id}
                                    item={item}
                                    removeItem={removeItem}
                                    moveItemToWishlist={moveItemToWishlist}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <CartOrderSummary
                cartItems={availableItems}
                hasUnavailableItems={hasUnavailableItems}
            />
        </div>
    )
}

export default LocalCart