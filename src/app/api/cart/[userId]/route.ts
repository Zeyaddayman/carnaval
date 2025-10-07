import { db } from '@/lib/prisma'
import { isAuthenticated } from '@/server/db/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {

    const session = await isAuthenticated()

    const userId = (await params).userId

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cart = await db.cart.findUnique({
        where: { userId },
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

    if (!cart) {

        const newCart = await db.cart.create({
            data: { userId },
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

        return NextResponse.json(newCart, { status: 200 })
    }

    return NextResponse.json(cart, { status: 200 })
}

export async function POST(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
        await db.cartItem.create({
            data: {
                cartId: body.cartId,
                productId: body.productId,
                quantity: body.quantity
            }
        })
    } catch {
        return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 })
}

export async function PUT(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
        await db.cartItem.update({
            where: { id: body.id },
            data: { quantity: body.quantity }
        })
    } catch {
        return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Cart item updated' }, { status: 200 })
}

export async function DELETE(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
        await db.cartItem.delete({
            where: { id: body.id }
        })
    } catch {
        return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Cart item deleted' }, { status: 200 })
}