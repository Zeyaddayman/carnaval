import { db } from "@/lib/prisma"
import { isAuthenticated } from "../utils/auth"
import { redirect } from "next/navigation"

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
            items: {
                select: {
                    id: true,
                    quantity: true,
                    product: {
                        select: {
                            title: true,
                            thumbnail: true,
                            price: true,
                            discountPercentage: true
                        }
                    }
                }
            }
        }
    })

    return cart?.items
}