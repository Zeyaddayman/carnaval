import { isAuthenticated } from "@/server/utils/auth";
import { createOrderItems } from "@/utils/checkout";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getLanguage } from "@/utils/language";
import getTranslation from "@/utils/translation";

export async function GET() {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    const translation = await getTranslation(lang)

    if (!session) {
        return NextResponse.json(translation.messages.auth.unauthorized, { status: 401 })
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
        return NextResponse.json(translation.messages.auth.userNotFound, { status: 404 })
    }

    if (!user.cart || user.cart.items.length === 0) {
        return NextResponse.json(translation.messages.cart.noItems, { status: 400 })
    }

    const { isValidQuantities } = createOrderItems(user.cart.items, userId)
    
    if (!isValidQuantities) {
        return NextResponse.json(translation.messages.cart.invalidQuantities, { status: 400 })
    }

    return NextResponse.json(translation.messages.cart.validQuantities, { status: 200 })
}