import { isAuthenticated } from "@/server/utils/auth";
import { createOrderItems } from "@/utils/checkout";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

    const session = await isAuthenticated()
    
    if (!session) {
        return NextResponse.json('Unauthorized', { status: 401 })
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
        return NextResponse.json('User not found', { status: 404 })
    }

    if (!user.cart || user.cart.items.length === 0) {
        return NextResponse.json('No items in cart', { status: 400 })
    }

    const { isValidQuantities } = createOrderItems(user.cart.items, userId)
    
    if (!isValidQuantities) {
        return NextResponse.json('Invalid item quantities', { status: 400 })
    }

    return NextResponse.json('All items are valid', { status: 200 })
}