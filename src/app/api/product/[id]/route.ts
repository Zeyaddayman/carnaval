import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cardProductSelector } from "@/server/query-selectors/product"
import { getLanguage } from "@/utils/language";
import getTranslation from "@/utils/translation";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const [{ id: productId }, lang] = await Promise.all([params, getLanguage()])

    const translation = await getTranslation(lang)

    const product = await db.product.findUnique({
        where: { id: productId },
        select: cardProductSelector(lang)
    })

    if (!product) {
        return NextResponse.json({ message: translation.messages.product.productNotFound }, { status: 404 })
    }

    const brandTranslation = product.brand?.translation.find(trans => trans.lang === lang) || product.brand?.translation.find(trans => trans.lang === "en")
    const productTranslation = product.translation.find(trans => trans.lang === lang) || product.translation.find(trans => trans.lang === "en")!

    const finalProduct = {
        id: product.id,
        thumbnail: product.thumbnail,
        title: productTranslation.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        finalPrice: product.finalPrice,
        rating: product.rating,
        stock: product.stock,
        limit: product.limit,
        brand: brandTranslation ? { name: brandTranslation.name } : null
    }

    return NextResponse.json(finalProduct, { status: 200 })
}