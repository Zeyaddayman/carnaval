import { db } from '@/lib/prisma'
import { wishlistItemSelector } from '@/server/query-selectors/wishlist'
import { isAuthenticated } from '@/server/utils/auth'
import { getLanguage } from '@/utils/language'
import getTranslation from '@/utils/translation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    const translation = await getTranslation(lang)

    if (!session) {
        return NextResponse.json({ message: translation.messages.auth.unauthorized }, { status: 401 })
    }

    const { userId } = session

    try {
        const wishlist = await db.wishlist.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            },
            select: wishlistItemSelector
        })

        return NextResponse.json({ items: wishlist }, { status: 200 })
    } catch {
        return NextResponse.json({ message: translation.messages.wishlist.getWishlistFailed }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    const translation = await getTranslation(lang)

    if (!session) {
        return NextResponse.json({ message: translation.messages.auth.unauthorized }, { status: 401 })
    }

    const { userId } = session

    const { productId } = await req.json()

    try {

        const product = await db.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json({ message: translation.messages.product.productNotFound }, { status: 404 })
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

        return NextResponse.json({ message: translation.messages.wishlist.itemAdded }, { status: 200 })

    } catch {
        return NextResponse.json({ message: translation.messages.wishlist.itemAddFailed }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    const translation = await getTranslation(lang)

    if (!session) {
        return NextResponse.json({ message: translation.messages.auth.unauthorized }, { status: 401 })
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

        return NextResponse.json({ message: translation.messages.wishlist.itemDeleted }, { status: 200 })

    } catch {
        return NextResponse.json({ message: translation.messages.wishlist.itemDeleteFailed }, { status: 500 })
    }
}