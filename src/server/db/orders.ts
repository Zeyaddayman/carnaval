import { redirect } from "next/navigation"
import { isAuthenticated } from "../utils/auth"
import { db } from "@/utils/prisma"
import { Prisma } from "@/generated/prisma"
import { orderDetailsSelector, tableOrderSelector } from "../query-selectors/order"

export const getUserOrders = async (filter: string ) => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/checkout")
    }

    const { userId } = session

    let whereOptions: Prisma.OrderWhereInput = { userId }

    switch (filter) {
        case "pending":
            whereOptions.status = "PENDING"
            break
        case "completed":
            whereOptions.status = "COMPLETED"
            break
        case "cancelled":
            whereOptions.status = "CANCELLED"
            break
    }

    const orders = await db.order.findMany({
        where: whereOptions,
        select: tableOrderSelector,
        orderBy: { createdAt: "desc" },
    })

    return orders
}

export const getOrderDetails = async (id: string) => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/checkout")
    }

    const { userId } = session

    const order = await db.order.findUnique({
        where: { id, userId },
        select: orderDetailsSelector
    })

    if (!order) return null

    return order
}

export const getUserOrdersSummary = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/checkout")
    }

    const { userId } = session

    const orders = await db.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true, status: true }
    })

    const pendingOrders = orders.filter(order => order.status === "PENDING")

    return {
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        lastOrderDate: orders[0]?.createdAt
    }
}