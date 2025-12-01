"use server"

import { db } from "@/lib/prisma"
import { isAuthenticated } from "../db/auth"
import { formatPrice } from "@/lib/formatters"
import { SHIPPING_COST, SHIPPING_THRESHOLD } from "@/constants/cart"
import { revalidatePath } from "next/cache"

export const checkoutAction = async (addressLabel: string) => {
    try {
        const session = await isAuthenticated()

        if (!session) {
            return {
                message: "Unauthorized",
                status: 401
            }
        }

        const userId = session.userId

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
                                        price: true,
                                        discountPercentage: true
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

        let validItemsQuantities = true

        const orderItems = user.cart.items.map(item => {

            const productLimit = (item.product.limit && item.product.limit <= item.product.stock) ? item.product.limit : item.product.stock

            if (productLimit < item.quantity || item.product.stock <= 0) {
                validItemsQuantities = false
            }

            const hasDiscount = item.product.discountPercentage && item.product.discountPercentage > 0
        
            const finalPrice = hasDiscount
                ? (item.product.price - item.product.price * item.product.discountPercentage! / 100)
                : item.product.price

            return {
                productId: item.product.id,
                quantity: item.quantity,
                price: finalPrice,
                userId
            }

        })

        if (!validItemsQuantities) {
            return {
                message: "Unavailable items quantity",
                status: 400
            }
        }

        const itemsCount = user.cart.items.reduce((acc, item) => acc + item.quantity, 0)
    
        const subtotal = formatPrice(user.cart.items.reduce((acc, item) => {
    
            const hasDiscount = item.product.discountPercentage && item.product.discountPercentage > 0
        
            const finalPrice = hasDiscount
                ? (item.product.price - item.product.price * item.product.discountPercentage! / 100)
                : item.product.price
    
            return acc + item.quantity * finalPrice
    
        }, 0))
    
        const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
        const total = formatPrice(subtotal + shipping)

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

            for (const item of orderItems) {
                await db.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                })
            }
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