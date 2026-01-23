import { isAuthenticated } from "@/server/utils/auth";
import { createOrderItems } from "@/utils/checkout";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

    const session = await isAuthenticated()
    
    if (!session) {
        return new NextResponse('Unauthorized', { status: 401 })
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
            }
        }
    })

    if (!user) {
        return new NextResponse('User not found', { status: 404 })
    }

    if (!user.cart || user.cart.items.length === 0) {
        return new NextResponse('No items in cart', { status: 400 })
    }

    const { isValidQuantities } = createOrderItems(user.cart.items, userId)
    
    if (!isValidQuantities) {
        return new NextResponse('Invalid item quantities', { status: 400 })
    }

    return new NextResponse('All items are valid', { status: 200 })
}