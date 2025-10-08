import { db } from '@/lib/prisma'
import { isAuthenticated } from '@/server/db/auth'
import { NextRequest, NextResponse } from 'next/server'
import { length } from 'zod'

export async function GET() {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    try {
        // get user cart by the sesion userId or create one if not exists
        const cart = await db.cart.upsert({
            where: { userId },
            create: { userId },
            update: {},
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                categories: true,
                                brand: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(cart, { status: 200 })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch user cart' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    let { productId, quantity } = await req.json()

    try {

        const product = await db.product.findUnique({
            where: { id: productId },
            select: { limit: true, stock: true }
        })

        let limit;

        if (product) {
            limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock
        }

        quantity = (limit && quantity > limit) ? limit : quantity

        // get user cart by the sesion userId or create one if not exists
        const cart = await db.cart.upsert({
            where: { userId },
            create: { userId },
            update: {}
        })

        // add item to cart or update its quantity if already exists
        await db.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            },
            create: {
                cartId: cart.id,
                productId,
                quantity
            },
            update: { 
                quantity
            }
        })

    } catch {
        return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 })
}

export async function DELETE(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    const { productId } = await req.json()

    try {
        // get user cart by the sesion userId or create one if not exists
        const cart = await db.cart.upsert({
            where: { userId },
            create: { userId },
            update: {}
        })

        // delete item from cart
        await db.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            }
        })

    } catch {
        return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Cart item deleted' }, { status: 200 })
}