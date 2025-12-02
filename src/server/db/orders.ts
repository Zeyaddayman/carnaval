import { redirect } from "next/navigation"
import { isAuthenticated } from "./auth"
import { db } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"

export const getUserOrders = async (filter: string ) => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/checkout")
    }

    const userId = session.userId

    let whereOptions: Prisma.OrderWhereInput = { userId }

    switch (filter) {
        case "pending":
            whereOptions = { ...whereOptions, status: "PENDING" }
            break
        case "completed":
            whereOptions = { ...whereOptions, status: "COMPLETED" }
            break
        case "cancelled":
            whereOptions = { ...whereOptions, status: "CANCELLED" }
            break
        default:
            whereOptions = whereOptions
    }

    const orders = await db.order.findMany({
        where: whereOptions,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            count: true,
            createdAt: true,
            itemsCount: true,
            status: true
        }
    })

    return orders
}

export const getOrderDetails = async (id: string) => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/checkout")
    }

    const userId = session.userId

    const order = await db.order.findUnique({
        where: { id, userId },
        select: {
            count: true,
            status: true,
            createdAt: true,
            itemsCount: true,
            subtotal: true,
            shippingFee: true,
            totalPrice: true,
            userName: true,
            userPhone: true,
            country: true,
            governorate: true,
            city: true,
            streetAddress: true,
            products: {
                select: {
                    price: true,
                    quantity: true,
                    product: {
                        select: {
                            id: true,
                            title: true,
                            thumbnail: true
                        }
                    }
                }
            }
        }
    })

    if (!order) {
        throw new Error("Order not found")
    }

    return order
}