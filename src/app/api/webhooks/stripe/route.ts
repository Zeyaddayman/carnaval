import Stripe from "stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import { createOrderItems } from "@/utils/checkout";
import { getCartItemsCount, getCartSubtotal } from "@/utils/cart";
import { getShipping, getTotal } from "@/utils";

export async function POST(req: NextRequest) {

    const body = await req.text()

    const sig = (await headers()).get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_SECRET_WEBHOOK_KEY as string
        )
    } catch (error) {
        return NextResponse.json('Invalid signature', { status: 400 })
    }

    if (event.type === "payment_intent.succeeded") {

        const { userId, addressLabel } = (event.data.object as Stripe.PaymentIntent).metadata

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
            return NextResponse.json('User not found', { status: 404 })
        }

        if (!user.cart || user.cart.items.length === 0) {
            return NextResponse.json('No items in cart', { status: 400 })
        }

        const orderAddress = user.addresses[0]

        if (!orderAddress) {
            return NextResponse.json('Address not found', { status: 404 })
        }

        const { orderItems } = createOrderItems(user.cart.items, userId)

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
                totalPrice: total,
                paid: true
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
    }

    return NextResponse.json(null, { status: 200 })
}