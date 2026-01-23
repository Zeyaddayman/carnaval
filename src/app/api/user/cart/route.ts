import { db } from '@/lib/prisma'
import { cartItemSelector } from '@/server/query-selectors/cart'
import { isAuthenticated } from '@/server/utils/auth'
import { NextRequest, NextResponse } from 'next/server'
import { getProductLimit } from '@/utils/product'
import { modifyCartItemsQuantities } from '@/server/utils/cart'

export async function GET() {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    try {
        const cart = await db.cart.upsert({
            where: { userId },
            create: { userId },
            update: {},
            select: {
                items: {
                    select: cartItemSelector,
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        // Check if any cart item quantities need to be modified based on stock/limit
        const { newCartItems, quantityModifiedItems } = await modifyCartItemsQuantities(cart.items)

        cart.items = newCartItems

        return NextResponse.json({ cart, quantityModifiedItems }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Failed to get user cart' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    const { productId, quantity } = await req.json()

    try {

        const product = await db.product.findUnique({
            where: { id: productId },
            select: { limit: true, stock: true }
        })

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 })
        }

        if (product.stock <= 0) {
            return NextResponse.json({ message: 'Product is out of stock' }, { status: 422 })
        }

        const limit = getProductLimit(product.stock, product.limit)

        // Adjust quantity if it exceeds the limit
        const modifiedQuantity = quantity > limit ? limit : quantity

        const cart = await db.cart.upsert({
            where: { userId },
            create: { userId },
            update: {}
        })

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

        return NextResponse.json(
            {
                message: 'Item added to cart',
                limit,
                modifiedQuantity: modifiedQuantity !== quantity ? modifiedQuantity : null
            },
            { status: 200 }
        )

    } catch {
        return NextResponse.json({ message: 'Failed to add item to cart' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    const { productId } = await req.json()

    try {
        const cart = await db.cart.upsert({
            where: { userId },
            create: { userId },
            update: {}
        })

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
        return NextResponse.json({ message: 'Failed to delete cart item' }, { status: 500 })
    }
}