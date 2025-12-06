import { db } from "@/utils/prisma";
import { getProductLimit } from "@/utils/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const productId = (await params).id

    const product = await db.product.findUnique({
        where: { id: productId },
        select: { limit: true, stock: true }
    })

    if (!product) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    const productLimit = getProductLimit(product.stock, product.limit)

    return NextResponse.json({ productLimit }, { status: 200 })
}