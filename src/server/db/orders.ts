import { redirect } from "next/navigation"
import { isAuthenticated } from "./auth"
import { db } from "@/lib/prisma"

export const getUserOrders = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/checkout")
    }

    const userId = session.userId

    const orders = await db.order.findMany({
        where: { userId },
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