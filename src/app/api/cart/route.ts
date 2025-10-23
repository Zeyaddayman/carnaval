import { db } from '@/lib/prisma'
import { isAuthenticated } from '@/server/db/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ errorMessage: 'Unauthorized' }, { status: 401 })
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
                    orderBy: {
                        createdAt: 'desc'
                    },
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

        cart.items.map(item => {
            console.log('Cart Item:', `${item.product.title} - Quantity: ${item.quantity}`)
        })

        return NextResponse.json(cart, { status: 200 })
    } catch {
        return NextResponse.json({ errorMessage: 'Failed to fetch user cart' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ errorMessage: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    const { productId, quantity } = await req.json()

    try {

        const product = await db.product.findUnique({
            where: { id: productId },
            select: { limit: true, stock: true }
        })

        if (!product) {
            return NextResponse.json({ errorMessage: 'Failed to add item to cart' }, { status: 500 })
        }

        let limit: number = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

        // check if the requested quantity available or not
        const modifiedQuantity = quantity > limit ? limit : quantity

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
                quantity: modifiedQuantity
            },
            update: { 
                quantity: modifiedQuantity
            }
        })

        // check if we modified the quantity
        if (modifiedQuantity !== quantity) {
            return NextResponse.json({ modified: `Only ${modifiedQuantity} items are available`, limit: modifiedQuantity }, { status: 200 })
        } else {
            return NextResponse.json({ message: 'Item added to cart' }, { status: 200 })
        }

    } catch {
        return NextResponse.json({ errorMessage: 'Failed to add item to cart' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ errorMessage: 'Unauthorized' }, { status: 401 })
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

        return NextResponse.json({ message: 'Cart item deleted' }, { status: 200 })

    } catch {
        return NextResponse.json({ errorMessage: 'Failed to delete cart item' }, { status: 500 })
    }
}