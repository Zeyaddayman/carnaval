import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const productId = (await params).id

    const product = await db.product.findUnique({
        where: { id: productId },
        select: { limit: true, stock: true }
    })

    if (!product) {
        return NextResponse.json({ message: 'Failed to add item to cart' }, { status: 500 })
    }

    const productLimit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    return NextResponse.json(productLimit, { status: 200 })
}