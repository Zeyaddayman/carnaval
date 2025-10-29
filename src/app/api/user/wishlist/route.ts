import { db } from '@/lib/prisma'
import { isAuthenticated } from '@/server/db/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    try {
        const wishlist = await db.wishlist.findMany({
            where: { userId },
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
        })

        return NextResponse.json({ items: wishlist }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Failed to fetch wishlist' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = session

    const { productId } = await req.json()

    try {

        const product = await db.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 })
        }

        await db.wishlist.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            create: {
                userId,
                productId
            },
            update: {}
        })

        return NextResponse.json({ message: 'Item added to wishlist' }, { status: 200 })

    } catch {
        return NextResponse.json({ message: 'Failed to add item to wishlist' }, { status: 500 })
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
        await db.wishlist.deleteMany({
            where: {
                userId,
                productId
            }
        })

        return NextResponse.json({ message: 'Wishlist item deleted' }, { status: 200 })

    } catch {
        return NextResponse.json({ message: 'Failed to delete wishlist item' }, { status: 500 })
    }
}