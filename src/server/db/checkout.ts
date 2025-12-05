import { db } from "@/lib/prisma"
import { isAuthenticated } from "../utils/auth"
import { redirect } from "next/navigation"
import { checkoutItemSelector } from "../query-selectors/checkout"

export const getCheckoutItems = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/checkout")
    }

    const { userId } = session

    const cart = await db.cart.findUnique({
        where: {
            userId
        },
        select: {
            items: { select: checkoutItemSelector }
        }
    })

    return cart?.items
}