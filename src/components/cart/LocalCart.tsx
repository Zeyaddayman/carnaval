"use client"

import CartOrderSummary from "./CartOrderSummary"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { removeItemFromLocalCart, selectLocalCart, setLocalCartItems } from "@/redux/features/localCartSlice"
import LocalCartItem from "./LocalCartItem"
import { CartItemWithProduct } from "@/types/cart"
import { QuantityModifiedItem } from "@/redux/features/userCartApi"
import { CiWarning } from "react-icons/ci"
import UnavailableCartItem from "./UnavailableCartItem"
import toast from "react-hot-toast"
import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import CartSkeleton from "../skeletons/CartSkeleton"
import EmptyCart from "./EmptyCart"
import { getProductLimit } from "@/utils/product"

const LocalCart = () => {

    const [isMounted, setIsMounted] = useState(false)

    const [quantityModifiedItems, setQuantityModifiedItems] = useState<{ [id: string]: QuantityModifiedItem }>({})

    const [refreshKey, setRefreshKey] = useState(0)

    const localCart = useAppSelector(selectLocalCart)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isMounted) setIsMounted(true)
    }, [])

    useEffect(() => {

        const abortController = new AbortController()
        const signal = abortController.signal

        const updateProductsData = async () => {
            try {
                const freshCartProducts = await Promise.all(localCart.items.map(async item => {
    
                    const res = await fetch(`/api/product/${item.product.id}`, { signal })
    
                    if (res.ok) return (await res.json()) as CartItemWithProduct["product"]
                }))
    
                const newQuantityModifiedItems: { [id: string]: QuantityModifiedItem } = {}
    
                const updatedLocalCartItems = localCart.items.map<CartItemWithProduct>(item => {
    
                    const freshProduct = freshCartProducts.find(product => product?.id === item.product.id)
    
                    if (!freshProduct) return item
    
                    const limit = getProductLimit(freshProduct.stock, freshProduct.limit)
    
                    let newQuantity = item.quantity
    
                    if (item.quantity > limit && limit !== 0) {
    
                        newQuantity = limit
    
                        newQuantityModifiedItems[item.id] = {
                            oldQuantity: item.quantity,
                            newQuantity
                        }
                    }
    
                    return {
                        ...item,
                        product: freshProduct ? freshProduct : item.product,
                        quantity: newQuantity
                    }
                })
    
                if (signal.aborted) return
    
                dispatch(setLocalCartItems(updatedLocalCartItems))
                setQuantityModifiedItems(newQuantityModifiedItems)
            }
            catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log("Fetch aborted intentionally")
                }
            }
        }

        updateProductsData()

        return () => {
            abortController.abort()
        }

    }, [refreshKey])

    if (!isMounted) return <CartSkeleton />

    if (localCart.items.length === 0) return <EmptyCart />

    const removeItem = (productId: string) => {
        dispatch(removeItemFromLocalCart(productId))
        triggerRefresh()
    }

    const moveItemToWishlist = () => {
        toast(
            <div className="space-y-2">
                <p>You must be logged in</p>
                <Link
                    href={`/auth/login?redirect=/cart`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                    Login
                </Link>
            </div>
        )
    }

    const triggerRefresh = () => {
        setRefreshKey(Math.random())
    }

    const availableItems = localCart.items.filter(item => item.product.stock > 0)
    const unAvailableItems = localCart.items.filter(item => item.product.stock < 1)

    const hasUnavailableItems = unAvailableItems.length > 0
    const hasModifiedQuantityItems = Object.keys(quantityModifiedItems).length > 0

    return (
        <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1">
                {hasUnavailableItems && (
                    <div className="flex items-center gap-2 flex-wrap p-3 bg-warning/10 text-warning rounded-md mb-2">
                        <CiWarning size={20} />
                        <strong>Unavailable items</strong>
                        <p>Some items are out of stock and must be resolved before checkout.</p>
                    </div>
                )}
                {hasModifiedQuantityItems && (
                    <div className="flex items-center gap-2 flex-wrap p-3 bg-warning/10 text-warning rounded-md mb-2">
                        <CiWarning size={20} />
                        <strong>We've updated your cart</strong>
                        <p>Some item quantities were adjusted due to low stock levels.</p>
                    </div>
                )}
                <div className="space-y-3">
                    {availableItems.toReversed().map(item => (
                        <LocalCartItem
                            key={item.id}
                            item={item}
                            removeItem={removeItem}
                            moveItemToWishlist={moveItemToWishlist}
                            quantityModified={quantityModifiedItems[item.id]}
                            triggerRefresh={triggerRefresh}
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