import { redirect } from "next/navigation"
import { isAuthenticated } from "../utils/auth"
import { db } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"
import { orderDetailsSelector, tableOrderSelector } from "../query-selectors/order"
import { getLanguage } from "@/utils/language"

export const getUserOrders = async (filter: string ) => {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/checkout`)
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

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/checkout`)
    }

    const { userId } = session

    const order = await db.order.findUnique({
        where: { id, userId },
        select: orderDetailsSelector(lang)
    })

    if (!order) return null

    const orderItems = order.items.map(item => {

        const productTranslation = item.product.translation.find(trans => trans.lang === lang) || item.product.translation.find(trans => trans.lang === "en")!

        return {
            ...item,
            product: {
                id: item.product.id,
                thumbnail: item.product.thumbnail,
                title: productTranslation.title
            }
        }
    })

    return { ...order, items: orderItems }
}

export const getUserOrdersSummary = async () => {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/checkout`)
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