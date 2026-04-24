import { db } from "@/lib/prisma";
import { getLanguage } from "@/utils/language";
import { getProductLimit } from "@/utils/product";
import getTranslation from "@/utils/translation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const [{ id: productId }, lang] = await Promise.all([params, getLanguage()])
    
    const translation = await getTranslation(lang)

    const product = await db.product.findUnique({
        where: { id: productId },
        select: { limit: true, stock: true }
    })

    if (!product) {
        return NextResponse.json({ message: translation.messages.product.productNotFound, productLimit: null }, { status: 404 })
    }

    const productLimit = getProductLimit(product.stock, product.limit)

    return NextResponse.json({ productLimit }, { status: 200 })
}