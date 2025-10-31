import { db } from "@/lib/prisma";
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

    const productLimit = (product.limit && product.limit <= product.stock) ? product.limit : product.stock

    return NextResponse.json(productLimit, { status: 200 })
}