import { db } from '@/lib/prisma'
import { isAuthenticated } from '@/server/utils/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
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
                            select: {
                                id: true,
                                title: true,
                                thumbnail: true,
                                price: true,
                                discountPercentage: true,
                                rating: true,
                                stock: true,
                                limit: true,
                                brand: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const quantityModifiedItems: { [id: string]: { oldQuantity: number, newQuantity: number } } = {}

        cart.items = await Promise.all(cart.items.map(async (item) => {

            const limit = (item.product.limit && item.product.limit <= item.product.stock) ? item.product.limit : item.product.stock

            if (item.quantity > limit && limit !== 0) {

                const newQuantity = limit

                quantityModifiedItems[item.id] = {
                    oldQuantity: item.quantity,
                    newQuantity
                }

                item.quantity = newQuantity

                await db.cartItem.update({
                    where: {
                        cartId_productId: {
                            cartId: item.cartId,
                            productId: item.productId
                        }
                    },
                    data: { quantity: newQuantity }
                })
            }

            return item
        }))

        return NextResponse.json({ cart, quantityModifiedItems }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Failed to fetch user cart' }, { status: 500 })
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
            return NextResponse.json({ message: 'Failed to add item to cart' }, { status: 500 })
        }

        if (product.stock <= 0) {
            return NextResponse.json({ message: 'Product is out of stock' }, { status: 400 })
        }

        const limit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

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

        return NextResponse.json({
                message: 'Item added to cart',
                limit,
                modifiedQuantity: modifiedQuantity !== quantity ? modifiedQuantity : undefined
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
        return NextResponse.json({ message: 'Failed to delete cart item' }, { status: 500 })
    }
}