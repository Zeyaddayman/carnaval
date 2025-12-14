"use server"

import { db } from "@/utils/prisma"
import { isAuthenticated } from "../utils/auth"
import { revalidatePath } from "next/cache"
import { getCartItemsCount, getCartSubtotal } from "@/utils/cart"
import { getShipping, getTotal } from "@/utils"
import { createOrderItems } from "@/utils/checkout"

export const checkoutAction = async (addressLabel: string) => {
    try {
        const session = await isAuthenticated()

        if (!session) {
            return {
                message: "Unauthorized",
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
                message: "User not found",
                status: 404
            }
        }

        if (!user.cart || user.cart.items.length === 0) {
            return {
                message: "No items in cart",
                status: 400
            }
        }

        const orderAddress = user.addresses[0]

        if (!orderAddress) {
            return {
                message: "Order address is required",
                status: 400
            }
        }

        const { orderItems, isValidQuantities } = createOrderItems(user.cart.items, userId)

        if (!isValidQuantities) {
            return {
                message: "Unavailable items quantity",
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
            message: "Order placed successfully",
            status: 201
        }
    }
    catch {
        return {
            message: "An unexpected error occurred",
            status: 500
        }
    }
    finally {
        revalidatePath("/profile")
    }
}