"use server"

import { db } from "@/lib/prisma"
import { isAuthenticated } from "../utils/auth"
import { revalidatePath } from "next/cache"
import { getCartItemsCount, getCartSubtotal } from "@/utils/cart"
import { getShipping, getTotal } from "@/utils"
import { createOrderItems } from "@/utils/checkout"
import { getLanguage } from "@/utils/language"
import getTranslation from "@/utils/translation"

export const checkoutAction = async (addressLabel: string) => {

    const lang = await getLanguage()

    const translation = await getTranslation(lang)

    try {
        const session = await isAuthenticated()

        if (!session) {
            return {
                message: translation.messages.auth.unauthorized,
                status: 401
            }
        }

        const { userId } = session

        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                cart: {
                    select: {
                        id: true,
                        items: {
                            select: {
                                quantity: true,
                                product: {
                                    select: {
                                        id: true,
                                        stock: true,
                                        limit: true,
                                        finalPrice: true
                                    }
                                }
                            }
                        }
                    }
                },
                addresses: {
                    where: { label: addressLabel },
                    take: 1
                }
            }
        })

        if (!user) {
            return {
                message: translation.messages.auth.userNotFound,
                status: 404
            }
        }

        if (!user.cart || user.cart.items.length === 0) {
            return {
                message: translation.messages.checkout.noItemsInCart,
                status: 400
            }
        }

        const orderAddress = user.addresses[0]

        if (!orderAddress) {
            return {
                message: translation.messages.checkout.orderAddressRequired,
                status: 400
            }
        }

        const { orderItems, isValidQuantities } = createOrderItems(user.cart.items, userId)

        if (!isValidQuantities) {
            return {
                message: translation.messages.checkout.unavailableItemsQty,
                status: 400
            }
        }

        const itemsCount = getCartItemsCount(user.cart.items)
        const subtotal = getCartSubtotal(user.cart.items)
        const shipping = getShipping(subtotal)
        const total = getTotal(subtotal, shipping)

        const order = await db.order.create({
            data: {
                userId,
                userName: orderAddress.name,
                userPhone: orderAddress.phone,
                country: orderAddress.country,
                governorate: orderAddress.governorate,
                city: orderAddress.city,
                streetAddress: orderAddress.streetAddress,
                products: {
                    createMany: { data: orderItems }
                },
                itemsCount,
                subtotal,
                shippingFee: shipping,
                totalPrice: total
            }
        })

        if (order) {
            await db.cartItem.deleteMany({
                where: { cartId: user.cart.id }
            })

            await Promise.all(orderItems.map(async (item) => {
                await db.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                })
            }))
        }

        return {
            message: translation.messages.checkout.orderPlaced,
            status: 201
        }
    }
    catch {
        return {
            message: translation.messages.checkout.orderPlaceFailed,
            status: 500
        }
    }
    finally {
        revalidatePath("/profile")
    }
}