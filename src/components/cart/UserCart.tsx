"use client"

import { useGetUserCartQuery } from "@/redux/features/userCartApi"
import UserCartItem from "./UserCartItem"
import CartOrderSummary from "./CartOrderSummary"
import { CartItemWithProduct } from "@/types/cart"
import { CiWarning } from "react-icons/ci"
import UnavailableCartItem from "./UnavailableCartItem"
import CartSkeleton from "../skeletons/CartSkeleton"
import EmptyCart from "./EmptyCart"
import useRemoveItemFromUserCart from "@/hooks/cart/user-cart/useRemoveItemFromUserCart"
import useAddItemToUserWishlist from "@/hooks/wishlist/useAddItemToUserWishlist"
import { getProductLimit } from "@/utils/product"

interface Props {
    userId: string
}

const UserCart = ({ userId }: Props) => {

    const { data, isLoading } = useGetUserCartQuery(userId)

    const { removeItemFromUserCart } = useRemoveItemFromUserCart()

    const { addItemToUserWishlist } = useAddItemToUserWishlist()


    if (isLoading) return <CartSkeleton />

    if (!data || data.cart.items.length === 0) return <EmptyCart />


    const removeItem = (productId: string) => {
        removeItemFromUserCart({
            productId,
            userId
        })
    }

    const moveItemToWishlist = (product: CartItemWithProduct["product"]) => {
        removeItemFromUserCart({
            productId: product.id,
            userId
        })

        addItemToUserWishlist({
            product,
            userId
        })
    }

    const availableItems = data.cart.items.filter(item => item.product.stock > 0)
    const unAvailableItems = data.cart.items.filter(item => item.product.stock < 1)

    const hasUnavailableItems = unAvailableItems.length > 0
    const hasModifiedQuantityItems = Object.keys(data.quantityModifiedItems).length > 0

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
                    {availableItems.map(item => (
                        <UserCartItem
                            key={item.id}
                            item={item}
                            initialLimit={getProductLimit(item.product.stock, item.product.limit)}
                            userId={userId}
                            removeItem={removeItem}
                            moveItemToWishlist={moveItemToWishlist}
                            quantityModified={data.quantityModifiedItems[item.id]}
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

export default UserCart