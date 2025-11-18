import { db } from "@/lib/prisma"
import { isAuthenticated } from "./auth"
import { redirect } from "next/navigation"

export const getCheckoutItems = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/checkout")
    }

    const cart = await db.cart.findUnique({
        where: {
            userId: session.userId
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

    if (!cart) {
        throw new Error("Cart not found")
    }

    return cart.items
}